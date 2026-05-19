import mongoose from 'mongoose';

const sourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['file', 'url', 'youtube', 'text'],
      required: true,
    },
    content: {
      type: String, // Extracted text content
      default: '',
    },
    metadata: {
      originalName: String,
      url: String,
      youtubeId: String,
      fileType: String, // pdf, docx, txt
      size: Number,
      filePath: String,
    },
    notebookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notebook',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    error: String,
  },
  {
    timestamps: true,
  }
);

const Source = mongoose.model('Source', sourceSchema);
export default Source;
