import { Router } from 'express';
import { generateQuiz, getMyQuizzes, getQuiz, updateQuiz, deleteQuiz, publishQuiz, createLiveSession } from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(protect);

router.post('/generate', aiLimiter, generateQuiz);
router.get('/', getMyQuizzes);
router.get('/:id', getQuiz);
router.patch('/:id', updateQuiz);
router.delete('/:id', deleteQuiz);
router.post('/:id/publish', publishQuiz);
router.post('/:id/live', createLiveSession);

export default router;
