import { ollamaConfig } from '../config/ollama.js';

/**
 * Service for interacting with the Ollama REST API.
 * Handles chat, generation, and embedding requests.
 */

/**
 * Generate a chat completion (non-streaming).
 * @param {string} prompt - The full prompt to send
 * @param {object} options - Additional options
 * @returns {Promise<string>} The model's response text
 */
export const generate = async (prompt, options = {}) => {
  const { model = ollamaConfig.chatModel, temperature = 0.7 } = options;

  const res = await fetch(`${ollamaConfig.baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      options: {
        temperature,
        num_predict: options.maxTokens || 2048,
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Ollama generate failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return data.response;
};

/**
 * Generate a streaming chat completion using SSE.
 * Calls the callback with each chunk of text as it arrives.
 * @param {string} prompt - The full prompt
 * @param {function} onChunk - Callback called with each text chunk
 * @param {object} options - Additional options
 * @returns {Promise<string>} The complete response text
 */
export const generateStream = async (prompt, onChunk, options = {}) => {
  const { model = ollamaConfig.chatModel, temperature = 0.7 } = options;

  const res = await fetch(`${ollamaConfig.baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: true,
      options: {
        temperature,
        num_predict: options.maxTokens || 2048,
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Ollama stream failed (${res.status}): ${errorText}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullResponse = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    // Ollama returns newline-delimited JSON objects
    const lines = chunk.split('\n').filter((line) => line.trim());

    for (const line of lines) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.response) {
          fullResponse += parsed.response;
          onChunk(parsed.response);
        }
      } catch {
        // Skip malformed lines
      }
    }
  }

  return fullResponse;
};

/**
 * Generate embeddings for a text using Ollama's embedding model.
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} The embedding vector
 */
export const embed = async (text) => {
  const res = await fetch(`${ollamaConfig.baseUrl}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: ollamaConfig.embedModel,
      prompt: text,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Ollama embedding failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return data.embedding;
};

/**
 * Chat with conversation context (non-streaming).
 * @param {Array<{role: string, content: string}>} messages - Conversation messages
 * @param {object} options
 * @returns {Promise<string>} The assistant's response
 */
export const chat = async (messages, options = {}) => {
  const { model = ollamaConfig.chatModel, temperature = 0.7 } = options;

  const res = await fetch(`${ollamaConfig.baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      options: {
        temperature,
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Ollama chat failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return data.message?.content || '';
};

export default { generate, generateStream, embed, chat };
