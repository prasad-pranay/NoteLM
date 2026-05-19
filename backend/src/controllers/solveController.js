import SolutionSession from '../models/SolutionSession.js';
import { extractText } from '../utils/textExtractor.js';
import { generateFromMyModel } from '../services/MyAiServer.js';
import { solverPrompt, splitQuestionsPrompt } from '../utils/prompts.js';
import path from 'path';

export const processQuestions = async (req, res) => {
  const { text, config: configStr } = req.body;
  // const config = JSON.parse(configStr || '{}');
  let config = {};
try {
  config = configStr ? JSON.parse(configStr) : {};
} catch (e) {
  console.warn("Invalid config JSON:", configStr);
  config = {};
}
  
  try {
    console.log('Solver Request:', { body: req.body, file: req.file });
    console.log("BODY:", req.body);
console.log("TEXT:", text);
console.log("CONFIG:", configStr);
console.log("FILE:", req.file);
    
    let rawText = text || '';

    // 1. Extract text from file if provided
    if (req.file) {
      const fileType = path.extname(req.file.originalname).substring(1).toLowerCase();
      console.log("error occured before extracting text",req.file.path,fileType)
      rawText = await extractText(req.file.path, fileType);
    }

    console.log("Raw Text: ",rawText)

    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ message: 'No text could be extracted from your input or file. Please check your content.' });
    }

    // 2. Split into individual questions
    const splitPrompt = splitQuestionsPrompt(rawText);
    const splitRes = await generateFromMyModel(splitPrompt);
    
    let questions = [];
    try {
      // Clean up JSON response if LLM adds markdown
      const jsonStr = splitRes.replace(/```json|```/g, '').trim();
      questions = JSON.parse(jsonStr);
    } catch (e) {
      // Fallback if JSON parsing fails
      questions = rawText.split('\n').filter(q => q.trim().length > 10);
    }
    console.log(questions)

    // 3. Solve each question
    const solvedQuestions = [];
    for (const qText of questions) {
      const solveP = solverPrompt(qText, config);
      const answer = await generateFromMyModel(solveP);
      
      solvedQuestions.push({
        question: qText,
        answer,
        type: detectType(qText),
        keywords: extractKeywords(answer)
      });
    }

    res.json({ questions: solvedQuestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveSolution = async (req, res) => {
  try {
    const { title, questions, config } = req.body;
    const session = await SolutionSession.create({
      userId: req.user._id,
      title,
      questions,
      config
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await SolutionSession.find({ userId: req.user._id }).sort('-createdAt');
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper functions
function detectType(q) {
  const text = q.toLowerCase();
  if (text.includes('code') || text.includes('function') || text.includes('program')) return 'coding';
  if (text.includes('calculate') || text.includes('solve for') || /\d+[\+\-\*\/]/.test(text)) return 'numerical';
  return 'theory';
}

function extractKeywords(a) {
  // Simple keyword extraction (bolded text)
  const matches = a.match(/\*\*(.*?)\*\*/g);
  return matches ? matches.map(m => m.replace(/\*\*/g, '')) : [];
}
