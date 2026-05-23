import mongoose from 'mongoose';

const studyTaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studyPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudyPlan',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Maths', 'Reasoning', 'Science', 'GK', 'Current Affairs', 'Mock Test', 'General'],
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const StudyTask = mongoose.model('StudyTask', studyTaskSchema);
