import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
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
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Reasoning', 'Maths', 'Science', 'GK', 'Current Affairs', 'Formula', 'Short Tricks'],
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isAutoSaved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.index({ user: 1, isPinned: -1, updatedAt: -1 });

export const Note = mongoose.model('Note', noteSchema);
