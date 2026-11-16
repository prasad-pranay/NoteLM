/**
 * Ollama client configuration.
 * Wraps all calls to the local Ollama REST API.
 */

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const CHAT_MODEL = process.env.OLLAMA_CHAT_MODEL || 'phi3';
const EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text';

export const ollamaConfig = {
  baseUrl: OLLAMA_BASE_URL,
  chatModel: CHAT_MODEL,
  embedModel: EMBED_MODEL,
};

/**
 * Check if Ollama is reachable.
 */
export const checkOllamaHealth = async () => {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!res.ok) throw new Error(`Ollama returned status ${res.status}`);
    const data = await res.json();
    const modelNames = data.models?.map((m) => m.name) || [];
    console.log(`✅ Ollama is running. Available models: ${modelNames.join(', ') || 'none'}`);
    return true;
  } catch (error) {
    console.warn(`⚠️  Ollama is not reachable at ${OLLAMA_BASE_URL}: ${error.message}`);
    console.warn('   AI features will not work until Ollama is running.');
    return false;
  }
};

export default ollamaConfig;


// import { GoogleGenAI } from '@google/genai';

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const CHAT_MODEL =
//   process.env.GEMINI_CHAT_MODEL || 'gemini-2.5-flash';

// const EMBED_MODEL =
//   process.env.GEMINI_EMBED_MODEL || 'gemini-embedding-001';

// // Generate text embeddings
// export const embed = async (text) => {
//   const response = await ai.models.embedContent({
//     model: EMBED_MODEL,
//     contents: text,
//     config: {
//       outputDimensionality: 768,
//     },
//   });

//   return response.embeddings[0].values;
// };

// // Generate chat response
// export const generateResponse = async (prompt) => {
//   const response = await ai.models.generateContent({
//     model: CHAT_MODEL,
//     contents: prompt,
//   });

//   return response.text;
// };

// export default { embed, generateResponse };
