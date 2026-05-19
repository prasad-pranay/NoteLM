import { Router } from 'express';
import { summarize, extractKeyPoints, generateFlashcards } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// router.use(protect);
router.use(aiLimiter);

router.post('/summarize', summarize);
router.post('/keypoints', extractKeyPoints);
router.post('/flashcards', generateFlashcards);

export default router;
