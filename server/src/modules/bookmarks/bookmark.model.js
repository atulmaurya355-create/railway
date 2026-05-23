import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    itemType: {
      type: String,
      enum: ['QuizQuestion', 'WrongQuestion', 'MockQuestion', 'Note', 'PYQ', 'Doubt', 'StudyMaterial'],
      required: true,
      index: true,
    },
    referenceId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      default: 'General',
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'Mixed', 'General'],
      default: 'General',
      index: true,
    },
    personalNote: {
      type: String,
      default: '',
      trim: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

bookmarkSchema.index({ user: 1, itemType: 1, referenceId: 1 }, { unique: true });

export const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
