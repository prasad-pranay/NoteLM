import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['mcq', 'truefalse', 'short'],
  },
  options: [String], // For MCQ: 4 options; for T/F: ['True', 'False']
  correctAnswer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    default: '',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      default: null,
    },
    topic: {
      type: String,
      default: 'General',
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'mixed'],
      default: 'mixed',
    },
    questions: [questionSchema],
    timeLimit: {
      type: Number, // in minutes
      default: 15,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Update average score when attempts are added
quizSchema.methods.updateStats = function (score) {
  this.totalScore += score;
  this.attempts += 1;
  this.averageScore = this.totalScore / this.attempts;
};

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
