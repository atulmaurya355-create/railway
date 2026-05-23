import mongoose from 'mongoose';

const attemptQuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      A: { type: String, required: true },
      B: { type: String, required: true },
      C: { type: String, required: true },
      D: { type: String, required: true },
    },
    correctAnswer: {
      type: String,
      enum: ['A', 'B', 'C', 'D'],
      required: true,
    },
    selectedAnswer: {
      type: String,
      enum: ['A', 'B', 'C', 'D', null],
      default: null,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    isSkipped: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

const mockTestAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    testType: {
      type: String,
      enum: ['fullLength', 'sectional'],
      required: true,
      index: true,
    },
    category: {
      type: String,
      default: 'All Railway Exams',
      index: true,
    },
    topic: {
      type: String,
      default: '',
      index: true,
    },
    durationSeconds: {
      type: Number,
      required: true,
    },
    timeTakenSeconds: {
      type: Number,
      default: 0,
    },
    questions: {
      type: [attemptQuestionSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['inProgress', 'submitted', 'autoSubmitted'],
      default: 'inProgress',
      index: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    wrongAnswers: {
      type: Number,
      default: 0,
    },
    skippedAnswers: {
      type: Number,
      default: 0,
    },
    submittedAt: Date,
  },
  {
    timestamps: true,
  },
);

mockTestAttemptSchema.index({
  testType: 1,
  category: 1,
  topic: 1,
  score: -1,
  timeTakenSeconds: 1,
});

export const MockTestAttempt = mongoose.model('MockTestAttempt', mockTestAttemptSchema);
