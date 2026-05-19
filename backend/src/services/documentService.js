import Document from '../models/Document.js';
import { extractText } from '../utils/textExtractor.js';
import { chunkText } from '../utils/textChunker.js';
import { embedDocumentChunks } from './embeddingService.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Document processing service.
 * Handles: text extraction → chunking → embedding pipeline.
 */

/**
 * Process an uploaded document: extract text, chunk it, generate embeddings.
 * This runs asynchronously after upload response is sent.
 * @param {string} documentId - The MongoDB document ID
 */
export const processDocument = async (documentId) => {
  const doc = await Document.findById(documentId);
  if (!doc) throw new Error('Document not found');

  try {
    // Update status to processing
    doc.embeddingStatus = 'processing';
    await doc.save();

    // Step 1: Extract text from file
    console.log(`📄 Extracting text from ${doc.originalName}...`);
    const text = await extractText(doc.filePath, doc.fileType);

    if (!text || text.trim().length === 0) {
      throw new Error('No text could be extracted from this document');
    }

    doc.extractedText = text;

    // Step 2: Chunk the text
    console.log(`✂️  Chunking text (${text.length} characters)...`);
    const chunks = chunkText(text);
    doc.chunks = chunks;

    console.log(`📦 Created ${chunks.length} chunks`);

    // Step 3: Generate embeddings and store in vector DB
    console.log(`🧠 Generating embeddings...`);
    const embeddedCount = await embedDocumentChunks(documentId, chunks);

    // Mark chunks as embedded
    doc.chunks.forEach((chunk, i) => {
      if (i < embeddedCount) chunk.embedded = true;
    });

    doc.embeddingStatus = 'completed';
    await doc.save();

    console.log(`✅ Document processed: ${doc.originalName} (${embeddedCount}/${chunks.length} chunks embedded)`);
  } catch (error) {
    console.error(`❌ Document processing failed for ${doc.originalName}:`, error.message);
    doc.embeddingStatus = 'failed';
    doc.embeddingError = error.message;
    await doc.save();
  }
};

/**
 * Delete a document and its associated files and embeddings.
 * @param {string} documentId
 * @param {string} userId - For ownership verification
 */
export const deleteDocument = async (documentId, userId) => {
  const doc = await Document.findOne({ _id: documentId, userId });
  if (!doc) throw new Error('Document not found or unauthorized');

  // Delete the physical file
  try {
    await fs.unlink(path.resolve(doc.filePath));
  } catch {
    console.warn(`Could not delete file: ${doc.filePath}`);
  }

  // Delete vector store data
  try {
    const vectorDir = path.resolve(process.env.VECTOR_STORE_DIR || './vector-store', documentId);
    await fs.rm(vectorDir, { recursive: true, force: true });
  } catch {
    console.warn(`Could not delete vector store for document: ${documentId}`);
  }

  // Delete from MongoDB
  await Document.findByIdAndDelete(documentId);

  return doc;
};

/**
 * Get the full text of a document (concatenated from chunks or extractedText).
 * @param {string} documentId
 * @returns {Promise<string>}
 */
export const getDocumentText = async (documentId) => {
  const doc = await Document.findById(documentId);
  if (!doc) throw new Error('Document not found');

  if (doc.extractedText) return doc.extractedText;

  // Fallback: reconstruct from chunks
  return doc.chunks.map((c) => c.content).join(' ');
};

export default { processDocument, deleteDocument, getDocumentText };
