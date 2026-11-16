import { embed } from './ollamaService.js';
import { addVectors, queryVectors } from '../config/vectorStore.js';

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


export const findSimilarChunks = async (indexId, queryText, topK = 5) => {
  console.log("start query")
  // Generate embedding for the query
  const queryVector = await embed(queryText);
  console.log("query done",queryVector)

  // Search the vector DB
  const results = await queryVectors(indexId, queryVector, topK);

  console.log("result",results)
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
