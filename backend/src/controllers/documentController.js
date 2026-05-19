import Document from '../models/Document.js';
import User from '../models/User.js';
import { processDocument, deleteDocument as deleteDocService } from '../services/documentService.js';
import path from 'path';

/**
 * @desc Upload a document
 * @route POST /api/documents/upload
 */
export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { originalname, filename, path: filePath, size, mimetype } = req.file;

    // Determine file type from mimetype
    const typeMap = {
      'application/pdf': 'pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'text/plain': 'txt',
    };

    const fileType = typeMap[mimetype];
    if (!fileType) {
      return res.status(400).json({ success: false, message: 'Unsupported file type' });
    }

    // Create document record
    const doc = await Document.create({
      title: req.body.title || path.parse(originalname).name,
      originalName: originalname,
      fileType,
      filePath,
      size,
      userId: req.user._id,
      embeddingStatus: 'pending',
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.documentsUploaded': 1 },
    });

    // Start async processing (don't wait for it)
    processDocument(doc._id.toString()).catch((err) => {
      console.error('Background document processing failed:', err.message);
    });

    res.status(201).json({
      success: true,
      data: doc,
      message: 'Document uploaded. Processing will begin in the background.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all documents for the current user
 * @route GET /api/documents
 */
export const getDocuments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;

    const docs = await Document.find({ userId: req.user._id })
      .select('-extractedText -chunks') // Exclude heavy fields from list
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Document.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: docs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get a single document
 * @route GET /api/documents/:id
 */
export const getDocument = async (req, res, next) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete a document
 * @route DELETE /api/documents/:id
 */
export const deleteDocumentHandler = async (req, res, next) => {
  try {
    const doc = await deleteDocService(req.params.id, req.user._id.toString());

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.documentsUploaded': -1 },
    });

    res.json({ success: true, message: 'Document deleted', data: { id: doc._id } });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export default { uploadDocument, getDocuments, getDocument, deleteDocument: deleteDocumentHandler };
