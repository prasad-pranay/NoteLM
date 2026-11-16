<div align="center">
  <table>
    <tr>
      <td align="center" width="120">
        <img src="../frontend/public/icon.png" width="120" height="120" />
      </td>
      <td>
        <h1>NoteLM</h1>
        <p>
          Backend Setup
        </p>
      </td>
    </tr>
  </table>
</div>

## Table of Contents

- [Tech Stack](#tech-stack)
- [Environment Configuration](#environment-configuration)
- [Backend Setup](#backend-setup)
  - [Prerequisites](#prerequisites)
  - [Installation & Running](#installation--running)
  - [Access the Application](#access-the-application)

## Tech Stack

- **Node.js:** JavaScript runtime for backend development.
- **Express.js:** REST API development and backend routing.
- **MongoDB & Mongoose:** Database and object data modeling (ODM).
- **JWT (jsonwebtoken):** Access and refresh token-based authentication.
- **Bcrypt.js:** Password hashing and verification.
- **Socket.IO:** Real-time communication for collaborative quizzes and live updates.
- **Ollama:** Local LLM inference and text embedding generation.
- **Google Gemini API:** Cloud-based AI text generation.
- **Vectra:** Local vector storage and similarity search for RAG.
- **PDF Parse & PDF.js:** PDF text extraction and document processing.
- **Mammoth:** Extracting text from Microsoft Word documents.
- **Tesseract.js:** OCR for extracting text from images.
- **Cheerio:** HTML parsing and content extraction from web pages.
- **YouTube Transcript:** Retrieving transcripts from YouTube videos.
- **Multer:** Handling multipart file uploads.
- **Express Validator:** Request data validation.
- **Helmet & CORS:** HTTP security headers and cross-origin resource sharing.
- **Express Rate Limit:** API rate limiting and request protection.

## Environment Configuration
Create a .env file in the backend directory and add the following configuration:

```bash
# Server Configuration
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/notelm

# Authentication
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# AI Configuration
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_CHAT_MODEL=phi3
OLLAMA_EMBED_MODEL=nomic-embed-text

# File Storage
UPLOAD_DIR=./uploads
VECTOR_STORE_DIR=./vector-store
MAX_FILE_SIZE_MB=50

# RAG Configuration
CHUNK_SIZE=512
CHUNK_OVERLAP=64
TOP_K_RESULTS=5

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```


## Environment Variables 
|Reference Variable	|Description|
|---|---|
|PORT|Port on which the backend server runs. Default: 5000.|
|MONGO_URI|MongoDB connection string. For local setup, use the default URI or get a cloud connection string from MongoDB Atlas.|
|JWT_SECRET|Secret key used to sign access tokens. Generate a strong, random secret.|
|JWT_REFRESH_SECRET|Secret key used to sign refresh tokens. Use a different random secret from JWT_SECRET.|
|JWT_EXPIRE|Expiration duration for access tokens. Default: 15m.|
|JWT_REFRESH_EXPIRE|Expiration duration for refresh tokens. Default: 7d.|
|GEMINI_API_KEY|API key for Google Gemini integration. Get one from Google AI Studio. Optional if using only local Ollama models.|
|OLLAMA_BASE_URL|Base URL of the running Ollama server. Default: http://localhost:11434. See Ollama.|
|OLLAMA_CHAT_MODEL|Ollama model used for AI text generation. Default: phi3. See Ollama Model Library.|
|OLLAMA_EMBED_MODEL|Ollama model used to generate text embeddings for vector search. Default: nomic-embed-text. See Nomic Embed Text.|
|UPLOAD_DIR|Directory where uploaded files are stored. Default: ./uploads.|
|VECTOR_STORE_DIR|Directory used for storing local vector embeddings. Default: ./vector-store.|
|MAX_FILE_SIZE_MB|Maximum allowed file upload size in MB. Default: 50.|
|CHUNK_SIZE|Number of characters used when splitting documents into chunks. Default: 512.|
|CHUNK_OVERLAP|Number of overlapping characters between consecutive chunks. Default: 64.|
|TOP_K_RESULTS|Number of relevant chunks retrieved during vector similarity search. Default: 5.|
|RATE_LIMIT_WINDOW_MS|Time window for API rate limiting, specified in milliseconds. Default: 900000 (15 minutes).|
|RATE_LIMIT_MAX|Maximum number of requests allowed per IP within the configured time window. Default: 100.|

### Important Notes
- For local AI inference, install Ollama and pull the required models:
    ```bash
    ollama pull phi3
    ollama pull nomic-embed-text
    ```

- You only need GEMINI_API_KEY if you intend to use Gemini-based generation.
- The default MongoDB URI assumes MongoDB is running locally on port 27017.



## Backend Setup

### Prerequisites
- Node.js (v18 or later)
- npm
- MongoDB (local instance or MongoDB Atlas)
- Ollama (optional, for local AI inference)

### Installation & Running

1. Clone the repository (if you haven't already):

   ```bash
   git clone https://github.com/prasad-pranay/notelm.git
   ```

2. Navigate to the backend directory:

   ```bash
   cd notelm/backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure your environment variables by creating a `.env` file. Refer to the [Environment Configuration](#environment-configuration) section above.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. The backend server should now be running at:

   **http://localhost:5000**

### Access the Application

Once both servers are running, open the frontend:

**http://localhost:5173**

If the frontend isn't running, follow the [Frontend Setup Guide](../frontend/README.md).





<br/>

---
### 🎉 Ta-da! Backend Setup Complete!

For any queries or issues, feel free to contact me at [prasadpranay2005@gmail.com](mailto:prasadpranay2005@gmail.com).