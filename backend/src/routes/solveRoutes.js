import express from 'express';
import { processQuestions, saveSolution, getHistory } from '../controllers/solveController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/process', upload.single('file'), processQuestions);
router.post('/save', saveSolution);
router.get('/history', getHistory);

export default router;
