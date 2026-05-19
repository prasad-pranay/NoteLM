/**
 * LLM Prompt templates for all AI features.
 * Structured prompts ensure consistent, high-quality outputs from the model.
 */

/**
 * RAG Chat prompt — grounded in document context.
 */
export const chatPrompt = (context, chatHistory, userQuery) => {
  const historyText = chatHistory
    .slice(-6) // Last 3 turns (6 messages)
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  return `You are an intelligent study assistant. Answer the user's question based ONLY on the provided document context. 

## Instructions:
1. Use the provided context to answer the question.
2. If the answer cannot be found in the context, say "I couldn't find that information in your notebook."
3. **CRITICAL**: For every claim or piece of information you provide, cite the source using the format [Source: Source Title].
4. Only cite a source if you actually used information from it.
5. Be concise, accurate, and helpful.

## Document Context:
${context}

${historyText ? `## Recent Conversation:\n${historyText}\n` : ''}
## User Question:
${userQuery}

Answer:`;
};

/**
 * Document summarization prompt.
 */
export const summarizePrompt = (text) => {
  return `You are an expert summarizer. Create a comprehensive yet concise summary of the following text.

## Text:
${text}

## Instructions:
- Capture all main ideas and key points
- Use clear, academic language
- Organize logically with paragraph breaks
- Keep it under 500 words
- Do NOT add information not present in the text

Summary:`;
};

/**
 * Key points extraction prompt.
 */
export const keyPointsPrompt = (text) => {
  return `Extract the most important key points from the following text. Return them as a JSON array of strings.

## Text:
${text}

## Instructions:
- Extract 5-10 key points
- Each point should be a complete, self-contained statement
- Order from most to least important
- Return ONLY a valid JSON array of strings, nothing else

Example format:
["Point 1", "Point 2", "Point 3"]

Key points:`;
};

/**
 * Flashcard generation prompt.
 */
export const flashcardsPrompt = (text) => {
  return `Generate study flashcards from the following text. Return them as a JSON array of objects with "front" (question) and "back" (answer) fields.

## Text:
${text}

## Instructions:
- Create 5-10 flashcards
- Questions should test key concepts and understanding
- Answers should be concise but complete
- Cover the most important topics in the text
- Return ONLY a valid JSON array, nothing else

Example format:
[{"front": "What is X?", "back": "X is..."}]

Flashcards:`;
};

/**
 * Quiz generation prompt.
 */
export const quizGenerationPrompt = (text, options = {}) => {
  const { numQuestions = 10, difficulty = 'mixed', types = ['mcq', 'truefalse', 'short'] } = options;

  const typeInstructions = [];
  if (types.includes('mcq')) typeInstructions.push('- MCQ: 4 options with one correct answer');
  if (types.includes('truefalse')) typeInstructions.push('- True/False: statement that is either true or false');
  if (types.includes('short')) typeInstructions.push('- Short Answer: a question with a brief text answer');

  return `You are an expert educator. Generate a quiz from the following text.

## Text:
${text}

## Requirements:
- Generate exactly ${numQuestions} questions
- Difficulty level: ${difficulty}
- Question types to include:
${typeInstructions.join('\n')}

## Return a valid JSON object with this exact structure:
{
  "title": "Quiz title based on the content",
  "description": "Brief description of what this quiz covers",
  "topic": "Main topic of the content",
  "questions": [
    {
      "questionText": "The question",
      "type": "mcq",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Why this is the correct answer",
      "difficulty": "easy"
    },
    {
      "questionText": "True or false: statement here",
      "type": "truefalse",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "explanation": "Explanation",
      "difficulty": "medium"
    },
    {
      "questionText": "Short answer question?",
      "type": "short",
      "options": [],
      "correctAnswer": "Expected answer",
      "explanation": "Explanation",
      "difficulty": "hard"
    }
  ]
}

## Important:
- Questions must be directly based on the provided text
- Each question must have an explanation
- MCQ distractors should be plausible but clearly wrong
- Return ONLY valid JSON, nothing else

Quiz:`;
};

/**
 * Mindmap generation prompt.
 */
export const mindmapPrompt = (text) => {
  return `Create a structured mindmap from the following text. Use Markdown-style nested lists to represent the hierarchy.

## Text:
${text}

## Instructions:
- Start with the main topic as the top-level bullet
- Branch out into sub-topics and details
- Use deep nesting (up to 4 levels)
- Be comprehensive but concise
- Format as a clean markdown list

Mindmap:`;
};

/**
 * Learning Roadmap prompt.
 */
export const roadmapPrompt = (text) => {
  return `Create a step-by-step learning roadmap based on the following text. 

## Text:
${text}

## Instructions:
- Organize the content into a logical learning sequence
- Break it down into phases (e.g., Phase 1: Fundamentals)
- For each step, provide a brief objective
- Include key terms or concepts to master at each stage
- Format as a clear, structured guide

Roadmap:`;
};

/**
 * Question solver prompt.
 */
export const solverPrompt = (question, config) => {
  const { detailLevel = 'medium', style = 'paragraph', difficulty = 'exam', language = 'English' } = config;

  return `You are an expert academic solver. Solve the following question accurately.

## Question:
${question}

## Configuration:
- Detail Level: ${detailLevel} (short/medium/detailed)
- Answer Style: ${style} (bullet/paragraph/step-by-step)
- Target Difficulty: ${difficulty} (beginner/exam/advanced)
- Language: ${language}

## Instructions:
1. Provide a direct and accurate answer.
2. Follow the requested Detail Level and Style strictly.
3. Use ${language} for the entire response.
4. If it's a numerical problem, show calculations if style is "step-by-step".
5. If it's a coding problem, provide clean code blocks.
6. Highlight key terms using bold text.

Answer:`;
};

/**
 * Question splitter prompt — extracts individual questions from a raw block of text.
 */
export const splitQuestionsPrompt = (text) => {
  return `Extract all individual questions from the following text. Return them as a JSON array of strings.

## Text:
${text}

## Instructions:
- Identify distinct questions even if they are not numbered.
- Keep the original wording of each question.
- Return ONLY a valid JSON array of strings.

Questions:`;
};

export default {
  chatPrompt,
  summarizePrompt,
  keyPointsPrompt,
  flashcardsPrompt,
  quizGenerationPrompt,
  mindmapPrompt,
  roadmapPrompt,
  solverPrompt,
  splitQuestionsPrompt,
};
