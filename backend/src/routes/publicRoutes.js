import { Router } from 'express';
import { listPublicQuizzes, getPublicQuiz, attemptQuiz, getLeaderboard } from '../controllers/publicQuizController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/quizzes', optionalAuth, listPublicQuizzes);
router.get('/leaderboard', getLeaderboard);
router.get('/quizzes/:id', optionalAuth, getPublicQuiz);
router.post('/quizzes/:id/attempt', protect, attemptQuiz);

export default router;
