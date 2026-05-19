import ChatHistory from '../models/ChatHistory.js';
import Document from '../models/Document.js';
import { ragChatStream } from '../services/ragService.js';

/**
 * @desc Send a chat message (RAG) — streams response via SSE
 * @route POST /api/chat
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { documentId, message } = req.body;

    if (!documentId || !message) {
      return res.status(400).json({ success: false, message: 'documentId and message are required' });
    }

    // Verify document ownership and readiness
    const doc = await Document.findOne({ _id: documentId, userId: req.user._id });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (doc.embeddingStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: `Document is not ready for chat. Status: ${doc.embeddingStatus}`,
      });
    }

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({
      documentId,
      userId: req.user._id,
    });

    if (!chatHistory) {
      chatHistory = new ChatHistory({
        documentId,
        userId: req.user._id,
        messages: [],
      });
    }

    // Add user message to history
    chatHistory.messages.push({
      role: 'user',
      content: message,
    });

    // Set up SSE headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    // Stream the response
    const { response, sources } = await ragChatStream(
      documentId,
      message,
      chatHistory.messages.slice(-10), // Last 5 turns
      (chunk) => {
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      }
    );

    // Add assistant response to history
    chatHistory.messages.push({
      role: 'assistant',
      content: response,
      sources,
    });

    await chatHistory.save();

    // Send final event with sources and close
    res.write(`data: ${JSON.stringify({ type: 'done', sources })}\n\n`);
    res.end();
  } catch (error) {
    // If headers haven't been sent yet, send error as JSON
    if (!res.headersSent) {
      return next(error);
    }
    // If we're already streaming, send error as SSE event
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    res.end();
  }
};

/**
 * @desc Get chat history for a document
 * @route GET /api/chat/history/:documentId
 */
export const getChatHistory = async (req, res, next) => {
  try {
    const chatHistory = await ChatHistory.findOne({
      documentId: req.params.documentId,
      userId: req.user._id,
    });

    res.json({
      success: true,
      data: chatHistory?.messages || [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Clear chat history for a document
 * @route DELETE /api/chat/history/:documentId
 */
export const clearHistory = async (req, res, next) => {
  try {
    await ChatHistory.findOneAndDelete({
      documentId: req.params.documentId,
      userId: req.user._id,
    });

    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    next(error);
  }
};

export default { sendMessage, getChatHistory, clearHistory };
