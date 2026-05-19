import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import User from '../models/User.js';

export const listPublicQuizzes = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, topic, difficulty, sort = '-createdAt', search } = req.query;
    const filter = { isPublic: true };
    if (topic) filter.topic = new RegExp(topic, 'i');
    if (difficulty && difficulty !== 'all') filter.difficulty = difficulty;
    if (search) filter.title = new RegExp(search, 'i');

    const quizzes = await Quiz.find(filter)
      .populate('createdBy', 'name')
      .select('-questions.correctAnswer -questions.explanation')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Quiz.countDocuments(filter);
    res.json({ success: true, data: quizzes, pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

export const getPublicQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, isPublic: true })
      .populate('createdBy', 'name')
      .select('-questions.correctAnswer -questions.explanation');
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, data: quiz });
  } catch (error) { next(error); }
};

export const attemptQuiz = async (req, res, next) => {
  try {
    const { answers, timeTaken } = req.body;
    const quiz = await Quiz.findOne({ _id: req.params.id, isPublic: true });
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    let correctCount = 0;
    const gradedAnswers = answers.map((a) => {
      const question = quiz.questions.id(a.questionId);
      const isCorrect = question && question.correctAnswer.toLowerCase().trim() === a.selectedAnswer.toLowerCase().trim();
      if (isCorrect) correctCount++;
      return { questionId: a.questionId, selectedAnswer: a.selectedAnswer, isCorrect: !!isCorrect };
    });

    const score = quiz.questions.length > 0 ? Math.round((correctCount / quiz.questions.length) * 100) : 0;

    const attempt = await QuizAttempt.create({
      quizId: quiz._id, userId: req.user._id,
      answers: gradedAnswers, score, correctCount,
      totalQuestions: quiz.questions.length, timeTaken: timeTaken || 0,
    });

    quiz.updateStats(score);
    await quiz.save();

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.quizzesAttempted': 1, 'stats.totalScore': score, points: Math.floor(score / 10) },
    });

    // Recalculate average
    const user = await User.findById(req.user._id);
    if (user.stats.quizzesAttempted > 0) {
      user.stats.averageScore = Math.round(user.stats.totalScore / user.stats.quizzesAttempted);
      await user.save();
    }

    // Return results with explanations
    const results = quiz.questions.map((q) => {
      const userAnswer = gradedAnswers.find((a) => a.questionId.toString() === q._id.toString());
      return {
        questionText: q.questionText, type: q.type, options: q.options,
        correctAnswer: q.correctAnswer, explanation: q.explanation,
        selectedAnswer: userAnswer?.selectedAnswer || '', isCorrect: userAnswer?.isCorrect || false,
      };
    });

    res.json({ success: true, data: { attempt, score, correctCount, total: quiz.questions.length, results } });
  } catch (error) { next(error); }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find({})
      .sort('-points')
      .limit(50)
      .select('name points stats.quizzesAttempted stats.averageScore badges');
    res.json({ success: true, data: users });
  } catch (error) { next(error); }
};
