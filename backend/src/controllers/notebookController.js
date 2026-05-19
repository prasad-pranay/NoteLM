import Notebook from '../models/Notebook.js';
import Source from '../models/Source.js';
import { extractText } from '../utils/textExtractor.js';
import { chunkText } from '../utils/textChunker.js';
import { embedChunks, findSimilarChunks } from '../services/embeddingService.js';
import { parseWebsite, parseYouTube } from '../utils/webParser.js';
import { generateFromMyModel } from '../services/MyAiServer.js';
import { chatPrompt, mindmapPrompt, roadmapPrompt, flashcardsPrompt, quizGenerationPrompt } from '../utils/prompts.js';
import path from 'path';

export const createNotebook = async (req, res) => {
  try {
    const { title } = req.body;
    const notebook = await Notebook.create({
      title: title || 'New Workspace',
      userId: req.user._id,
    });
    res.status(201).json(notebook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotebooks = async (req, res) => {
  try {
    const notebooks = await Notebook.find({ userId: req.user._id }).sort('-createdAt');
    res.json(notebooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotebook = async (req, res) => {
  try {
    const notebook = await Notebook.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('sources');
    if (!notebook) return res.status(404).json({ message: 'Notebook not found' });
    res.json(notebook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addSource = async (req, res) => {
  const { id: notebookId } = req.params;
  const { type, url, title, text } = req.body;
  const userId = req.user._id;

  try {
    const notebook = await Notebook.findOne({ _id: notebookId, userId });
    if (!notebook) return res.status(404).json({ message: 'Notebook not found' });

    let sourceData = {
      type,
      notebookId,
      userId,
      status: 'processing',
    };

    if (type === 'file') {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
      const fileType = path.extname(req.file.originalname).substring(1).toLowerCase();
      sourceData.title = req.file.originalname;
      sourceData.metadata = {
        originalName: req.file.originalname,
        fileType,
        size: req.file.size,
        filePath: req.file.path,
      };
    } else if (type === 'url') {
      sourceData.title = url;
      sourceData.metadata = { url };
    } else if (type === 'youtube') {
      sourceData.title = url;
      sourceData.metadata = { url };
    } else if (type === 'text') {
      sourceData.title = title || 'Manual Note';
      sourceData.content = text;
      sourceData.status = 'completed';
    }

    const source = await Source.create(sourceData);
    notebook.sources.push(source._id);
    await notebook.save();

    // Start processing in background (except for text which is already done)
    if (type !== 'text') {
      processSourceInBackground(source._id);
    } else {
      // Chunk and embed text source
      const chunks = chunkText(text);
      await embedChunks(notebookId, chunks, { sourceId: source._id, type: 'text', title: source.title });
    }

    res.status(201).json(source);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const processSourceInBackground = async (sourceId) => {
  const source = await Source.findById(sourceId);
  if (!source) return;

  try {
    let extractedText = '';
    if (source.type === 'file') {
      extractedText = await extractText(source.metadata.filePath, source.metadata.fileType);
    } else if (source.type === 'url') {
      const { title, content } = await parseWebsite(source.metadata.url);
      extractedText = content;
      source.title = title;
    } else if (source.type === 'youtube') {
      const { title, content, youtubeId } = await parseYouTube(source.metadata.url);
      extractedText = content;
      source.title = title;
      source.metadata.youtubeId = youtubeId;
    }

    source.content = extractedText;
    const chunks = chunkText(extractedText);
    
    await embedChunks(source.notebookId, chunks, { 
      sourceId: source._id, 
      type: source.type, 
      title: source.title 
    });

    source.status = 'completed';
    await source.save();
  } catch (error) {
    console.error('Source processing error:', error);
    source.status = 'failed';
    source.error = error.message;
    await source.save();
  }
};

export const deleteSource = async (req, res) => {
  const { id: notebookId, sourceId } = req.params;
  try {
    const source = await Source.findOneAndDelete({ _id: sourceId, notebookId, userId: req.user._id });
    if (!source) return res.status(404).json({ message: 'Source not found' });
    
    await Notebook.findByIdAndUpdate(notebookId, { $pull: { sources: sourceId } });
    
    // Note: In a production app, we would also remove the vectors from the index.
    // Vectra doesn't support easy deletion of items by metadata filter yet, 
    // but we can ignore them in results or rebuild index.
    
    res.json({ message: 'Source deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const notebookChat = async (req, res) => {
  const { id: notebookId } = req.params;
  const { message, history } = req.body;

  try {
    const notebook = await Notebook.findOne({ _id: notebookId, userId: req.user._id });
    if (!notebook) return res.status(404).json({ message: 'Notebook not found' });

    // Search across the whole notebook index
    const relevantChunks = await findSimilarChunks(notebookId, message, 10);

    if (relevantChunks.length === 0) {
      return res.json({ 
        response: "I couldn't find any relevant information in your notebook to answer this question. Please make sure you've uploaded some content.",
        sources: [] 
      });
    }

    const context = relevantChunks
      .map((c, i) => `[Source: ${c.metadata.title}] (Type: ${c.metadata.type})\n${c.content}`)
      .join('\n\n---\n\n');

    const prompt = chatPrompt(context, history || [], message);
    const response = await generateFromMyModel(prompt);

    // Filter sources to only show those that were actually cited in the response
    const citedSources = [];
    const seenSourceIds = new Set();

    relevantChunks.forEach(chunk => {
      const sourceTitle = chunk.metadata.title;
      // Look for [Source: Title] in the response
      if (response.includes(`[Source: ${sourceTitle}]`) && !seenSourceIds.has(chunk.metadata.sourceId)) {
        citedSources.push({
          title: sourceTitle,
          type: chunk.metadata.type,
          content: chunk.content.substring(0, 150) + '...',
          sourceId: chunk.metadata.sourceId
        });
        seenSourceIds.add(chunk.metadata.sourceId);
      }
    });

    res.json({
      response,
      sources: citedSources
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateStudyMaterial = async (req, res) => {
  const { id: notebookId } = req.params;
  const { type } = req.body; // 'mindmap', 'flashcards', 'quiz', 'roadmap'

  try {
    const notebook = await Notebook.findOne({ _id: notebookId, userId: req.user._id }).populate('sources');
    if (!notebook) return res.status(404).json({ message: 'Notebook not found' });

    // Concatenate all source content for full context
    const allText = notebook.sources
      .filter(s => s.status === 'completed')
      .map(s => `--- Source: ${s.title} ---\n${s.content}`)
      .join('\n\n');

    if (!allText) {
      return res.status(400).json({ message: 'No processed content found in this notebook. Please add and process some sources first.' });
    }

    let prompt;
    switch (type) {
      case 'mindmap':
        prompt = mindmapPrompt(allText);
        break;
      case 'roadmap':
        prompt = roadmapPrompt(allText);
        break;
      case 'flashcards':
        prompt = flashcardsPrompt(allText);
        break;
      case 'quiz':
        prompt = quizGenerationPrompt(allText);
        break;
      default:
        return res.status(400).json({ message: 'Invalid material type' });
    }

    const response = await generateFromMyModel(prompt);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
