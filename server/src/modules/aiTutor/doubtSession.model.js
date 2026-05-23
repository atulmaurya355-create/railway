import mongoose from 'mongoose';

const doubtMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ['Maths', 'Reasoning', 'Science', 'General Awareness', 'Current Affairs', 'General'],
      default: 'General',
    },
    shortcut: {
      type: String,
      default: '',
    },
    commonMistake: {
      type: String,
      default: '',
    },
    similarQuestion: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const doubtSessionSchema = new mongoose.Schema(
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
      trim: true,
      maxlength: 120,
    },
    subject: {
      type: String,
      enum: ['Maths', 'Reasoning', 'Science', 'General Awareness', 'Current Affairs', 'General'],
      default: 'General',
    },
    messages: [doubtMessageSchema],
    isBookmarked: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'resolved'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export const DoubtSession = mongoose.model('DoubtSession', doubtSessionSchema);
