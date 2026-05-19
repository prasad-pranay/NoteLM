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
