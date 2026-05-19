/**
 * Text chunking utility for RAG (Retrieval-Augmented Generation).
 * Splits text into overlapping chunks for embedding and retrieval.
 */

/**
 * Split text into chunks with overlap using a sliding window approach.
 * Respects sentence boundaries when possible.
 *
 * @param {string} text - The full text to chunk
 * @param {object} options
 * @param {number} options.chunkSize - Target size per chunk in characters (default: 512)
 * @param {number} options.chunkOverlap - Overlap between chunks in characters (default: 64)
 * @returns {Array<{content: string, chunkIndex: number, tokenCount: number}>}
 */
export const chunkText = (text, options = {}) => {
  const {
    chunkSize = parseInt(process.env.CHUNK_SIZE) || 512,
    chunkOverlap = parseInt(process.env.CHUNK_OVERLAP) || 64,
  } = options;

  if (!text || text.trim().length === 0) {
    return [];
  }

  // Clean up the text — normalize whitespace
  const cleanedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();

  if (cleanedText.length <= chunkSize) {
    return [
      {
        content: cleanedText,
        chunkIndex: 0,
        tokenCount: estimateTokens(cleanedText),
      },
    ];
  }

  // Split into sentences for better boundary handling
  const sentences = splitIntoSentences(cleanedText);
  const chunks = [];
  let currentChunk = '';
  let chunkIndex = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];

    // If adding this sentence would exceed the chunk size
    if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
      // Save current chunk
      chunks.push({
        content: currentChunk.trim(),
        chunkIndex: chunkIndex++,
        tokenCount: estimateTokens(currentChunk),
      });

      // Start new chunk with overlap — take the last N characters from the previous chunk
      if (chunkOverlap > 0) {
        const overlapText = currentChunk.slice(-chunkOverlap);
        currentChunk = overlapText + ' ' + sentence;
      } else {
        currentChunk = sentence;
      }
    } else {
      currentChunk += (currentChunk.length > 0 ? ' ' : '') + sentence;
    }
  }

  // Don't forget the last chunk
  if (currentChunk.trim().length > 0) {
    chunks.push({
      content: currentChunk.trim(),
      chunkIndex: chunkIndex,
      tokenCount: estimateTokens(currentChunk),
    });
  }

  return chunks;
};

/**
 * Split text into sentences using common delimiters.
 * Handles abbreviations and decimal numbers reasonably well.
 */
const splitIntoSentences = (text) => {
  // Split on sentence-ending punctuation followed by space or newline
  const raw = text.split(/(?<=[.!?])\s+|\n+/);
  return raw.filter((s) => s.trim().length > 0);
};

/**
 * Rough estimate of token count (≈ 4 characters per token for English).
 * This avoids needing a full tokenizer library.
 */
const estimateTokens = (text) => {
  return Math.ceil(text.length / 4);
};

export default { chunkText };
