import mongoose from 'mongoose';

const currentAffairsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['governance', 'economy', 'defence', 'sports', 'sciencetech', 'international', 'national', 'other'],
      required: true,
      index: true,
    },
    affairsType: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    keyPoints: [
      {
        type: String,
        trim: true,
      },
    ],
    relatedTopics: [
      {
        type: String,
        trim: true,
      },
    ],
    imageUrl: {
      type: String,
      default: '',
    },
    importance: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    source: {
      type: String,
      trim: true,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

currentAffairsSchema.index({ affairsType: 1, date: -1 });
currentAffairsSchema.index({ category: 1, affairsType: 1 });

export const CurrentAffairs = mongoose.model('CurrentAffairs', currentAffairsSchema);
