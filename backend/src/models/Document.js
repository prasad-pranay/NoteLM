import mongoose from 'mongoose';

const chunkSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  chunkIndex: {
    type: Number,
    required: true,
  },
  tokenCount: {
    type: Number,
    default: 0,
  },
  embedded: {
    type: Boolean,
    default: false,
  },
});

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
      enum: ['pdf', 'docx', 'txt'],
    },
    filePath: {
      type: String,
      required: true,
    },
    size: {
      type: Number, // bytes
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    extractedText: {
      type: String,
      default: '',
    },
    chunks: [chunkSchema],
    embeddingStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    embeddingError: {
      type: String,
      default: null,
    },
    summary: {
      type: String,
      default: null,
    },
    keyPoints: [String],
  },
  {
    timestamps: true,
  }
);

// Virtual for human-readable file size
documentSchema.virtual('readableSize').get(function () {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = this.size;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
});

documentSchema.set('toJSON', { virtuals: true });

const Document = mongoose.model('Document', documentSchema);
export default Document;
