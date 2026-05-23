import mongoose from 'mongoose';

const weakTopicSchema = new mongoose.Schema(
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
    subject: {
      type: String,
      enum: ['Maths', 'Reasoning', 'Science', 'General Awareness', 'Current Affairs'],
      required: true,
      index: true,
    },
    accuracyScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    questionsAttempted: {
      type: Number,
      default: 0,
    },
    questionsCorrect: {
      type: Number,
      default: 0,
    },
    sprintCompleted: {
      type: Boolean,
      default: false,
    },
    aiStrategy: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const WeakTopic = mongoose.model('WeakTopic', weakTopicSchema);
