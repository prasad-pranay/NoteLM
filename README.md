# NoteLM

A full-stack learning platform that uses local and cloud LLMs to turn your study materials into interactive tools. It lets you upload documents, chat with them via RAG, generate quizzes, host live quiz sessions, and track your learning analytics. 

I built this to have a personalized, privacy-first study assistant that actually understands my course materials without relying entirely on generic AI responses.

## Core Features

- **Document Processing:** Upload PDFs, DOCX, TXT, or images. The app extracts text (using tools like pdf-parse, mammoth, and tesseract) and chunks it for processing.
- **RAG-based Chat:** Ask questions about your documents. The backend uses a local vector store (Vectra) and Ollama/Mistral to retrieve relevant chunks and generate accurate, context-aware answers.
- **Smart Quizzes:** Automatically generate MCQs, true/false, and short-answer questions from your notes. 
- **Live Multiplayer Quizzes:** Host Kahoot-style live sessions where participants can join via a code, answer in real-time, and compete on a leaderboard (powered by Socket.io).
- **Notebooks:** Group different sources (PDFs, URLs, YouTube transcripts, raw text) into a single workspace and chat with the combined knowledge base.
- **Analytics Dashboard:** Track your learning streaks, average scores, and recent activities with dynamic charts (Recharts).

## Tech Stack

**Frontend:**
- React (Vite)
- React Router DOM
- Zustand (State management)
- Tailwind CSS & Custom CSS variables (Dark mode by default)
- Framer Motion (Animations)
- Recharts (Data visualization)

**Backend:**
- Node.js & Express
- MongoDB (Mongoose)
- Socket.io (Real-time features)
- Vectra (Local file-based vector database)
- Ollama & Mistral API (LLM integration)
- JSON Web Tokens (Auth)

## Folder Structure

```
├── backend/
│   ├── src/
│   │   ├── config/       # DB, Ollama, Vector store setup
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth, Uploads, Rate limiting
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Express routers
│   │   ├── services/     # RAG, Embeddings, LLM providers
│   │   ├── socket/       # Real-time quiz event handlers
│   │   └── utils/        # Text extraction, prompt templates
│   └── uploads/          # Local file storage
│
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios config
│   │   ├── components/   # Reusable UI parts
│   │   ├── hooks/        # Custom React hooks
│   │   ├── notebook/     # Notebook specific views
│   │   ├── pages/        # Main route components
│   │   └── store/        # Zustand stores
```

## Major API Routes

- `/api/auth` - JWT authentication, profile updates.
- `/api/documents` - File uploads, document management, and text extraction.
- `/api/chat` - RAG chat endpoints for individual documents.
- `/api/quiz` - Quiz generation, CRUD operations, and live session initialization.
- `/api/notebooks` - Manage multi-source notebooks and combined chats.
- `/api/analytics` - Fetch user stats, streaks, and performance trends.
- `/api/solve` - Processing images/files for automated problem solving.
- `/api/ai` - Direct LLM tasks like summaries and flashcard generation.

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI
- (Optional) Ollama installed locally if you want to run models on your own hardware.

### Backend
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in the values:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/notelm
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   OLLAMA_BASE_URL=http://localhost:11434  # If using Ollama
   # Check .env.example for other configs
   ```
4. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. Create a `.env` file if needed to set the API base URL (defaults to `http://localhost:5000/api`).
4. `npm run dev`

## Key Workflows & Implementation Details

- **Vector Search & RAG:** When a document is uploaded, it gets chunked and embedded via Ollama's embedding model. The vectors are stored locally using `vectra`. When chatting, the user's query is embedded, relevant chunks are retrieved, and passed into the LLM prompt as context.
- **Real-time Quizzes:** A host generates a code and opens a Socket.io room. Participants join the room. The host controls the flow (start, next question) while the server calculates scores based on correctness and response time.
- **LLM Fallbacks:** The app supports local inference via Ollama, but also integrates Mistral AI (`MyAiServer.js`) for faster cloud generation when needed.

## Future Improvements

- Add support for more embedding models and cloud vector databases (e.g., Pinecone).
- Implement background workers (like Redis/Bull) for processing large PDF uploads so they don't block the HTTP request.
- Polish the mobile responsive views for the live quiz participant screen.
- Better visual feedback for vector processing status in the UI.

---
*Created for better, context-aware learning.*
