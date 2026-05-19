import { findSimilarChunks } from './embeddingService.js';
import { generateStream, generate } from './ollamaService.js';
import { chatPrompt } from '../utils/prompts.js';
import { generateFromMyModel } from './MyAiServer.js';

/**
 * RAG (Retrieval-Augmented Generation) Service.
 * Orchestrates the flow: query → vector search → context building → LLM response.
 */

/**
 * Build context string from retrieved chunks.
 * @param {Array<{content: string, score: number, chunkIndex: number}>} chunks
 * @returns {string} Formatted context text
 */
const buildContext = (chunks) => {
  return chunks
    .map((chunk, i) => `[Passage ${i + 1}] (relevance: ${(chunk.score * 100).toFixed(0)}%)\n${chunk.content}`)
    .join('\n\n---\n\n');
};

/**
 * RAG chat with streaming response.
 * @param {string} documentId - Document to search within
 * @param {string} userQuery - The user's question
 * @param {Array} chatHistory - Previous messages
 * @param {function} onChunk - Callback for each streamed text chunk
 * @param {object} options
 * @returns {Promise<{response: string, sources: Array}>}
 */
export const ragChatStream = async (documentId, userQuery, chatHistory = [], onChunk, options = {}) => {
  const topK = parseInt(process.env.TOP_K_RESULTS) || 5;

  // Step 1: Retrieve relevant chunks via vector similarity
  const relevantChunks = await findSimilarChunks(documentId, userQuery, topK);

  if (relevantChunks.length === 0) {
    const fallbackMsg = "I couldn't find relevant information in this document to answer your question. Could you try rephrasing, or ask something about the document's content?";
    onChunk(fallbackMsg);
    return {
      response: fallbackMsg,
      sources: [],
    };
  }

  // Step 2: Build context from retrieved chunks
  const context = buildContext(relevantChunks);

  // Step 3: Build the full prompt with context + history
  const prompt = chatPrompt(context, chatHistory, userQuery);

  // Step 4: Stream response from Ollama
  const response = await generateStream(prompt, onChunk, options);

  return {
    response,
    sources: relevantChunks.map((c) => ({
      chunkIndex: c.chunkIndex,
      content: c.content.substring(0, 200) + '...',
      score: c.score,
    })),
  };
};

/**
 * RAG chat without streaming (for internal use).
 */
export const ragChat = async (documentId, userQuery, chatHistory = [], options = {}) => {
  const topK = parseInt(process.env.TOP_K_RESULTS) || 5;

  const relevantChunks = await findSimilarChunks(documentId, userQuery, topK);

  if (relevantChunks.length === 0) {
    return {
      response: "I couldn't find relevant information in this document to answer your question.",
      sources: [],
    };
  }

  const context = buildContext(relevantChunks);
  const prompt = chatPrompt(context, chatHistory, userQuery);
  // const response = await generate(prompt, options);
  const response = await generateFromMyModel(prompt);

  return {
    response,
    sources: relevantChunks.map((c) => ({
      chunkIndex: c.chunkIndex,
      content: c.content.substring(0, 200) + '...',
      score: c.score,
    })),
  };
};

export default { ragChatStream, ragChat };
