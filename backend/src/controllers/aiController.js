import Document from '../models/Document.js';
import { generate } from '../services/ollamaService.js';
import { summarizePrompt, keyPointsPrompt, flashcardsPrompt } from '../utils/prompts.js';
import { getDocumentText } from '../services/documentService.js';
import { generateFromMyModel } from '../services/MyAiServer.js';

/**
 * @desc Summarize a document
 * @route POST /api/ai/summarize
 */
export const summarize = async (req, res, next) => {
  try {
    const { documentId } = req.body;
    console.log(documentId)
    const doc = await Document.findOne({ _id: documentId });

    // const doc = await Document.findOne({ _id: documentId, userId: req.user._id });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Check if summary already exists
    if (doc.summary) {
      return res.json({ success: true, data: { summary: doc.summary }, cached: true });
    }

    const text = await getDocumentText(documentId);

    // Truncate for model context window
    const truncated = text.substring(0, 6000);
    const prompt = summarizePrompt(truncated);
    console.log("Prompt done")
    console.log(prompt)
    // const summary = await generate(prompt, { temperature: 0.5 });
    const summary = await generateFromMyModel(prompt);

    // Cache the summary
    doc.summary = summary;
    await doc.save();

    res.json({ success: true, data: { summary } });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Extract key points from a document
 * @route POST /api/ai/keypoints
 */
export const extractKeyPoints = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    const doc = await Document.findOne({ _id: documentId });
    // const doc = await Document.findOne({ _id: documentId, userId: req.user._id });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Check cache
    if (doc.keyPoints && doc.keyPoints.length > 0) {
      return res.json({ success: true, data: { keyPoints: doc.keyPoints }, cached: true });
    }

    const text = await getDocumentText(documentId);
    const truncated = text.substring(0, 6000);
    const prompt = keyPointsPrompt(truncated);
    console.log("Prompt done")
    console.log(prompt)
    // const rawResponse = await generate(prompt, { temperature: 0.5 });
    const rawResponse = await generateFromMyModel(prompt);

    // Parse JSON array from response
    let keyPoints;
    try {
      // Try to extract JSON array from the response
      const match = rawResponse.match(/\[[\s\S]*\]/);
      keyPoints = match ? JSON.parse(match[0]) : [rawResponse];
    } catch {
      keyPoints = rawResponse.split('\n').filter((line) => line.trim().length > 0);
    }

    // Cache key points
    doc.keyPoints = keyPoints;
    await doc.save();

    res.json({ success: true, data: { keyPoints } });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Generate flashcards from a document
 * @route POST /api/ai/flashcards
 */
export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    const doc = await Document.findOne({ _id: documentId });
    // const doc = await Document.findOne({ _id: documentId, userId: req.user._id });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const text = await getDocumentText(documentId);
    const truncated = text.substring(0, 6000);
    const prompt = flashcardsPrompt(truncated);

    // const rawResponse = await generate(prompt, { temperature: 0.7 });
    const rawResponse = await generateFromMyModel(prompt, { temperature: 0.7 });

    // Parse JSON array from response
    let flashcards;
    try {
      const match = rawResponse.match(/\[[\s\S]*\]/);
      flashcards = match ? JSON.parse(match[0]) : [];
    } catch {
      flashcards = [{ front: 'Failed to parse flashcards', back: rawResponse }];
    }

    res.json({ success: true, data: { flashcards } });
  } catch (error) {
    next(error);
  }
};

export default { summarize, extractKeyPoints, generateFlashcards };
