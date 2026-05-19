import Quiz from '../models/Quiz.js';
import User from '../models/User.js';
import LiveSession from '../models/LiveSession.js';
import { generateQuiz as genQuizSvc } from '../services/quizService.js';
import { getDocumentText } from '../services/documentService.js';
import { v4 as uuidv4 } from 'uuid';

export const generateQuiz = async (req, res, next) => {
  try {
    const { documentId, numQuestions = 10, difficulty = 'mixed', types = ['mcq', 'truefalse', 'short'], selectedText } = req.body;
    let text;
    if (selectedText) {
      text = selectedText;
    } else if (documentId) {
      text = await getDocumentText(documentId);
    } else {
      return res.status(400).json({ success: false, message: 'Either documentId or selectedText is required' });
    }
    const quiz = await genQuizSvc(text, { numQuestions, difficulty, types, userId: req.user._id, documentId });
    await User.findByIdAndUpdate(req.user._id, { $inc: { 'stats.quizzesCreated': 1, points: 10 } });
    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

export const getMyQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id }).sort('-createdAt');
    res.json({ success: true, data: quizzes });
  } catch (error) {
    next(error);
  }
};

export const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, createdBy: req.user._id }).populate('createdBy', 'name');
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

export const updateQuiz = async (req, res, next) => {
  try {
    const allowed = ['title', 'description', 'topic', 'difficulty', 'timeLimit', 'tags', 'questions'];
    const updates = {};
    for (const f of allowed) { if (req.body[f] !== undefined) updates[f] = req.body[f]; }
    const quiz = await Quiz.findOneAndUpdate({ _id: req.params.id, createdBy: req.user._id }, updates, { new: true, runValidators: true });
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

export const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, message: 'Quiz deleted' });
  } catch (error) {
    next(error);
  }
};

export const publishQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    quiz.isPublic = !quiz.isPublic;
    await quiz.save();
    res.json({ success: true, data: { isPublic: quiz.isPublic }, message: quiz.isPublic ? 'Quiz published' : 'Quiz unpublished' });
  } catch (error) {
    next(error);
  }
};

export const createLiveSession = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found or unauthorized' });

    // Generate a simple 6-digit code
    const joinCode = Math.floor(100000 + Math.random() * 900000).toString();

    const session = await LiveSession.create({
      quizId: quiz._id,
      hostId: req.user._id,
      joinCode,
      status: 'waiting',
      participants: []
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};
