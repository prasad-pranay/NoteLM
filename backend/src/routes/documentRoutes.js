import { Router } from 'express';
import { uploadDocument, getDocuments, getDocument, deleteDocumentHandler } from '../controllers/documentController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.use(protect);

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getDocuments);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocumentHandler);

export default router;
