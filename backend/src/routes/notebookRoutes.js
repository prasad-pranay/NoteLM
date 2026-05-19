import { Router } from 'express';
import {
  createNotebook,
  getNotebooks,
  getNotebook,
  addSource,
  deleteSource,
  notebookChat,
  generateStudyMaterial,
} from '../controllers/notebookController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.use(protect);1

router.post('/', createNotebook);
router.get('/', getNotebooks);
router.get('/:id', getNotebook);

router.post('/:id/sources', upload.single('file'), addSource);
router.delete('/:id/sources/:sourceId', deleteSource);

router.post('/:id/chat', notebookChat);
router.post('/:id/generate-study-material', generateStudyMaterial);

export default router;
