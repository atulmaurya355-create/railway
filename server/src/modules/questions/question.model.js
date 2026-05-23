import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    options: {
      A: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300,
      },
      B: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300,
      },
      C: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300,
      },
      D: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300,
      },
    },
    correctAnswer: {
      type: String,
      enum: ['A', 'B', 'C', 'D'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      index: true,
    },
    explanation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1500,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

questionSchema.index({
  question: 'text',
  topic: 'text',
  category: 'text',
  explanation: 'text',
});

export const Question = mongoose.model('Question', questionSchema);
