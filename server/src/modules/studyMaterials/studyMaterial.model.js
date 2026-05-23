import mongoose from 'mongoose';

const studyMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 800,
      default: '',
    },
    materialType: {
      type: String,
      enum: ['notes', 'pdf', 'formulaSheet'],
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
    examName: {
      type: String,
      trim: true,
      maxlength: 120,
      default: 'Railway Exams',
      index: true,
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
    mimeType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
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

studyMaterialSchema.index({
  title: 'text',
  description: 'text',
  topic: 'text',
  category: 'text',
  examName: 'text',
  originalName: 'text',
});

export const StudyMaterial = mongoose.model('StudyMaterial', studyMaterialSchema);
