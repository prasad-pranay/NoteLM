import { embed } from './ollamaService.js';
import { addVectors, queryVectors } from '../config/vectorStore.js';

/**
 * Embedding service — generates and stores embeddings for document chunks.
 */

/**
 * Generate embeddings for all chunks of a source/document and store them in the vector DB.
 * @param {string} indexId - The ID of the index (documentId or notebookId)
 * @param {Array<{content: string, chunkIndex: number}>} chunks - Text chunks
 * @param {object} extraMetadata - Additional metadata to store (e.g., sourceId)
 * @returns {Promise<number>} Number of chunks embedded
 */
export const embedChunks = async (indexId, chunks, extraMetadata = {}) => {
  const vectorItems = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    try {
      // Generate embedding via Ollama
      const vector = await embed(chunk.content);

      vectorItems.push({
        id: `${indexId}_${extraMetadata.sourceId || 'chunk'}_${chunk.chunkIndex}`,
        vector,
        metadata: {
          ...extraMetadata,
          indexId,
          chunkIndex: chunk.chunkIndex,
          content: chunk.content,
          tokenCount: chunk.tokenCount || 0,
        },
      });
    } catch (error) {
      console.error(`Failed to embed chunk ${i} of index ${indexId}:`, error.message);
    }
  }

  // Store all vectors in the vector DB
  if (vectorItems.length > 0) {
    await addVectors(indexId, vectorItems);
  }

  return vectorItems.length;
};

/**
 * Query the vector DB for chunks similar to a query string.
 * @param {string} indexId - The index to search within
 * @param {string} queryText - The user's question
 * @param {number} topK - Number of results to return
 * @returns {Promise<Array<{content: string, score: number, chunkIndex: number, metadata: object}>>}
 */
export const findSimilarChunks = async (indexId, queryText, topK = 5) => {
  // Generate embedding for the query
  const queryVector = await embed(queryText);

  // Search the vector DB
  const results = await queryVectors(indexId, queryVector, topK);

  // Map results to a clean format
  return results.map((result) => ({
    content: result.item.metadata.content,
    chunkIndex: result.item.metadata.chunkIndex,
    score: result.score,
    metadata: result.item.metadata,
  }));
};

export const embedDocumentChunks = (documentId, chunks) => embedChunks(documentId, chunks, { documentId });

export default { embedChunks, findSimilarChunks, embedDocumentChunks };
