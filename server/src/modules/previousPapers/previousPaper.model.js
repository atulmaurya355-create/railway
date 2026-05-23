import mongoose from 'mongoose';

const previousPaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
      index: true,
    },
    examName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      index: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1990,
      max: 2100,
      index: true,
    },
    shift: {
      type: String,
      trim: true,
      maxlength: 80,
      default: '',
      index: true,
    },
    language: {
      type: String,
      trim: true,
      maxlength: 50,
      default: 'English',
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

previousPaperSchema.index({
  title: 'text',
  examName: 'text',
  shift: 'text',
  language: 'text',
  originalName: 'text',
});

export const PreviousPaper = mongoose.model('PreviousPaper', previousPaperSchema);
