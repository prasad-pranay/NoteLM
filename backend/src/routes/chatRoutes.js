import { Router } from 'express';
import { sendMessage, getChatHistory, clearHistory } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(protect);

router.post('/', aiLimiter, sendMessage);
router.get('/history/:documentId', getChatHistory);
router.delete('/history/:documentId', clearHistory);

export default router;

