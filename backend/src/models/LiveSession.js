import mongoose from 'mongoose';

const liveSessionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  joinCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'finished'],
    default: 'waiting',
  },
  currentQuestionIndex: {
    type: Number,
    default: -1, // -1 means waiting to start
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: String,
    score: {
      type: Number,
      default: 0,
    },
    answers: [{
      questionIndex: Number,
      answer: String,
      isCorrect: Boolean,
      points: Number,
      answeredAt: Date,
    }]
  }],
}, { timestamps: true });

const LiveSession = mongoose.model('LiveSession', liveSessionSchema);
export default LiveSession;
