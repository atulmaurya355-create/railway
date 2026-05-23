import mongoose from 'mongoose';

const studyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    examTarget: {
      type: String,
      enum: ['RRB NTPC', 'Group D', 'ALP', 'JE', 'RPF'],
      required: true,
    },
    examDate: {
      type: Date,
      required: true,
    },
    dailyHours: {
      type: Number,
      required: true,
      min: 1,
      max: 24,
    },
    strongSubjects: {
      type: [String],
      default: [],
    },
    weakSubjects: {
      type: [String],
      default: [],
    },
    prepLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    language: {
      type: String,
      enum: ['English', 'Hindi'],
      default: 'English',
    },
    timetable: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    weeklyPlan: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    monthlyRevisionPlan: {
      type: String,
      default: '',
    },
    mockTestSchedule: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);
