import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
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
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['dailyReminder', 'achievement', 'newQuiz'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['read', 'unread'],
      default: 'unread',
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for finding unread notifications of a specific user quickly
notificationSchema.index({ user: 1, status: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);
