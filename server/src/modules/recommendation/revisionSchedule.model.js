import mongoose from 'mongoose';

const revisionScheduleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topicName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Maths', 'Reasoning', 'Science', 'General Awareness', 'Current Affairs'],
      required: true,
    },
    intervalDays: {
      type: Number,
      default: 1,
    },
    lastRevisedAt: {
      type: Date,
      default: Date.now,
    },
    nextRevisionAt: {
      type: Date,
      required: true,
      index: true,
    },
    confidenceScore: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const RevisionSchedule = mongoose.model('RevisionSchedule', revisionScheduleSchema);
