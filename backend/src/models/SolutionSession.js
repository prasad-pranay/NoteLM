import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  type: { type: String, enum: ['theory', 'numerical', 'coding', 'unknown'], default: 'unknown' },
  keywords: [String],
});

const solutionSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Untitled Solution' },
  questions: [questionSchema],
  config: {
    detailLevel: { type: String, enum: ['short', 'medium', 'detailed'], default: 'medium' },
    style: { type: String, enum: ['bullet', 'paragraph', 'step-by-step'], default: 'paragraph' },
    difficulty: { type: String, enum: ['beginner', 'exam', 'advanced'], default: 'exam' },
    language: { type: String, default: 'English' },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('SolutionSession', solutionSessionSchema);
