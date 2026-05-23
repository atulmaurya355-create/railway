import mongoose from 'mongoose';

const aiTutorMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    mode: {
      type: String,
      enum: ['doubt', 'reasoning', 'explain', 'generate', 'planner', 'recommend'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    copiedAt: Date,
  },
  {
    timestamps: true,
  },
);

const aiTutorSessionSchema = new mongoose.Schema(
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
    messages: {
      type: [aiTutorMessageSchema],
      default: [],
    },
    lastMode: {
      type: String,
      enum: ['doubt', 'reasoning', 'explain', 'generate', 'planner', 'recommend'],
      default: 'doubt',
    },
  },
  {
    timestamps: true,
  },
);

aiTutorSessionSchema.index({ user: 1, updatedAt: -1 });

export const AiTutorSession = mongoose.model('AiTutorSession', aiTutorSessionSchema);
