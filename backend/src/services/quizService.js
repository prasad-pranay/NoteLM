import { generate } from './ollamaService.js';
import { quizGenerationPrompt } from '../utils/prompts.js';
import Quiz from '../models/Quiz.js';
import { generateFromMyModel } from './MyAiServer.js';

/**
 * Quiz generation service.
 * Uses LLM to generate structured quiz data from document text.
 */

/**
 * Generate a quiz from document text.
 * @param {string} text - The source text to generate questions from
 * @param {object} options
 * @param {number} options.numQuestions - Number of questions to generate (default: 10)
 * @param {string} options.difficulty - easy | medium | hard | mixed
 * @param {string[]} options.types - Question types: ['mcq', 'truefalse', 'short']
 * @param {string} options.userId - The creator's user ID
 * @param {string} options.documentId - The source document ID
 * @returns {Promise<object>} The saved Quiz document
 */
export const generateQuiz = async (text, options = {}) => {
  const { numQuestions = 10, difficulty = 'mixed', types = ['mcq', 'truefalse', 'short'], userId, documentId } = options;

  // Truncate text if too long (most models have limited context windows)
  const maxChars = 8000;
  const truncatedText = text.length > maxChars ? text.substring(0, maxChars) + '\n\n[Text truncated...]' : text;

  // Build the prompt
  const prompt = quizGenerationPrompt(truncatedText, { numQuestions, difficulty, types });

  // Generate quiz via LLM
  console.log(`🧠 Generating quiz (${numQuestions} questions, ${difficulty} difficulty)...`);
  // const rawResponse = await generate(prompt, { temperature: 0.7, maxTokens: 4096 });
  const rawResponse = await generateFromMyModel(prompt);

  // Parse the JSON response
  const quizData = parseQuizResponse(rawResponse);

  // Validate and save
  const quiz = new Quiz({
    title: quizData.title || 'Generated Quiz',
    description: quizData.description || '',
    topic: quizData.topic || 'General',
    createdBy: userId,
    documentId: documentId || null,
    difficulty,
    questions: quizData.questions.map((q) => ({
      questionText: q.questionText,
      type: q.type || 'mcq',
      options: q.options || [],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      difficulty: q.difficulty || difficulty,
    })),
    isPublic: false,
  });

  await quiz.save();
  console.log(`✅ Quiz generated: "${quiz.title}" with ${quiz.questions.length} questions`);

  return quiz;
};

/**
 * Parse the LLM's response into structured quiz data.
 * Handles common issues like markdown code fences, trailing commas, etc.
 */
const parseQuizResponse = (rawResponse) => {
  let cleaned = rawResponse.trim();

  // Remove markdown code fences if present
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '');
  cleaned = cleaned.replace(/\n?\s*```$/i, '');

  // Try to find JSON object boundaries
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('Failed to parse quiz response: no JSON object found');
  }

  cleaned = cleaned.substring(jsonStart, jsonEnd + 1);

  // Remove trailing commas before closing brackets (common LLM mistake)
  cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');

  try {
    const parsed = JSON.parse(cleaned);

    // Validate required fields
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Parsed quiz has no questions array');
    }

    if (parsed.questions.length === 0) {
      throw new Error('Parsed quiz has 0 questions');
    }

    // Validate each question has minimum required fields
    parsed.questions = parsed.questions.filter((q) => {
      return q.questionText && q.correctAnswer;
    });

    return parsed;
  } catch (error) {
    console.error('Quiz JSON parse error:', error.message);
    console.error('Raw response:', rawResponse.substring(0, 500));
    throw new Error(`Failed to parse quiz from AI response: ${error.message}`);
  }
};

export default { generateQuiz };
