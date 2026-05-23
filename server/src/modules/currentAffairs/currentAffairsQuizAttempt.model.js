import mongoose from 'mongoose';

const currentAffairsQuizAttemptSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CurrentAffairsQuiz',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    answers: [
      {
        questionIndex: {
          type: Number,
          required: true,
        },
        selectedOptions: [
          {
            text: String,
            isCorrect: Boolean,
          },
        ],
        isCorrect: {
          type: Boolean,
          required: true,
        },
        marksObtained: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalMarksObtained: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    incorrectAnswers: {
      type: Number,
      required: true,
    },
    unattempted: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      required: true,
    },
    isPassed: {
      type: Boolean,
      required: true,
    },
    duration: {
      type: Number, // in seconds
      required: true,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    submittedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

currentAffairsQuizAttemptSchema.index({ quizId: 1, userId: 1 });
currentAffairsQuizAttemptSchema.index({ userId: 1, createdAt: -1 });

export const CurrentAffairsQuizAttempt = mongoose.model(
  'CurrentAffairsQuizAttempt',
  currentAffairsQuizAttemptSchema
);
