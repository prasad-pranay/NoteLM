import { LocalIndex } from 'vectra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VECTOR_STORE_DIR = process.env.VECTOR_STORE_DIR || './vector-store';

// Cache of initialized indexes per document
const indexCache = new Map();

/**
 * Get or create a Vectra LocalIndex for a specific document.
 * Each document gets its own vector index directory.
 * @param {string} documentId - The MongoDB document ID
 * @returns {Promise<LocalIndex>} The vector index
 */
export const getVectorIndex = async (documentId) => {
  if (indexCache.has(documentId)) {
    return indexCache.get(documentId);
  }

  const indexPath = path.resolve(VECTOR_STORE_DIR, documentId.toString());
  const index = new LocalIndex(indexPath);

  // Create the index if it doesn't exist
  if (!(await index.isIndexCreated())) {
    await index.createIndex();
  }

  indexCache.set(documentId, index);
  return index;
};

/**
 * Add vectors to a document's index.
 * @param {string} documentId
 * @param {Array<{id: string, vector: number[], metadata: object}>} items
 */
export const addVectors = async (documentId, items) => {
  const index = await getVectorIndex(documentId);

  for (const item of items) {
    await index.insertItem({
      id: item.id,
      vector: item.vector,
      metadata: item.metadata,
    });
  }
};

/**
 * Query the vector index for similar chunks.
 * @param {string} documentId
 * @param {number[]} queryVector - The embedding of the user's query
 * @param {number} topK - Number of results to return
 * @returns {Promise<Array>} Matching items sorted by similarity
 */
export const queryVectors = async (documentId, queryVector, topK = 5) => {
  const index = await getVectorIndex(documentId);

  if (!(await index.isIndexCreated())) {
    return [];
  }

  const results = await index.queryItems(queryVector, topK);
  return results;
};

/**
 * Delete a document's entire vector index.
 * @param {string} documentId
 */
export const deleteVectorIndex = async (documentId) => {
  if (indexCache.has(documentId)) {
    indexCache.delete(documentId);
  }
  // The index files will be cleaned up with the directory
};

export default {
  getVectorIndex,
  addVectors,
  queryVectors,
  deleteVectorIndex,
};
