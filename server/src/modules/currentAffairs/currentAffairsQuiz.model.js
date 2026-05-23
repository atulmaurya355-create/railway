import mongoose from 'mongoose';

const currentAffairsQuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    quizType: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      required: true,
      index: true,
    },
    relatedAffairs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CurrentAffairs',
      },
    ],
    questions: [
      {
        questionText: {
          type: String,
          required: true,
          trim: true,
        },
        questionType: {
          type: String,
          enum: ['mcq', 'multiselect', 'truefalse'],
          default: 'mcq',
        },
        options: [
          {
            text: {
              type: String,
              required: true,
              trim: true,
            },
            isCorrect: {
              type: Boolean,
              default: false,
            },
          },
        ],
        explanation: {
          type: String,
          trim: true,
          default: '',
        },
        difficulty: {
          type: String,
          enum: ['easy', 'medium', 'hard'],
          default: 'medium',
        },
        marks: {
          type: Number,
          default: 1,
        },
      },
    ],
    totalMarks: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    passingScore: {
      type: Number,
      default: 50,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const CurrentAffairsQuiz = mongoose.model('CurrentAffairsQuiz', currentAffairsQuizSchema);
