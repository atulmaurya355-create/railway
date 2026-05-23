import mongoose from 'mongoose';

const leaderboardStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    overallRank: {
      type: Number,
      default: null,
      index: true,
    },
    weeklyRank: {
      type: Number,
      default: null,
      index: true,
    },
    monthlyRank: {
      type: Number,
      default: null,
      index: true,
    },
    // Overall stats
    totalTests: {
      type: Number,
      default: 0,
    },
    totalQuizzes: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    totalAttempts: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    // Weekly stats
    weeklyScore: {
      type: Number,
      default: 0,
    },
    weeklyTests: {
      type: Number,
      default: 0,
    },
    weeklyAccuracy: {
      type: Number,
      default: 0,
    },
    weekStartDate: {
      type: Date,
      default: () => {
        const now = new Date();
        now.setDate(now.getDate() - now.getDay());
        now.setHours(0, 0, 0, 0);
        return now;
      },
    },
    // Monthly stats
    monthlyScore: {
      type: Number,
      default: 0,
    },
    monthlyTests: {
      type: Number,
      default: 0,
    },
    monthlyAccuracy: {
      type: Number,
      default: 0,
    },
    monthStartDate: {
      type: Date,
      default: () => {
        const now = new Date();
        now.setDate(1);
        now.setHours(0, 0, 0, 0);
        return now;
      },
    },
    // Streak tracking
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastActivityDate: {
      type: Date,
      default: null,
    },
    // Achievements
    totalXP: {
      type: Number,
      default: 0,
    },
    badges: [
      {
        name: String,
        earnedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient leaderboard queries
leaderboardStatsSchema.index({ weeklyRank: 1, weekStartDate: -1 });
leaderboardStatsSchema.index({ monthlyRank: 1, monthStartDate: -1 });
leaderboardStatsSchema.index({ totalScore: -1 });
leaderboardStatsSchema.index({ weeklyScore: -1 });
leaderboardStatsSchema.index({ monthlyScore: -1 });
leaderboardStatsSchema.index({ accuracy: -1 });
leaderboardStatsSchema.index({ currentStreak: -1 });

export const LeaderboardStats = mongoose.model('LeaderboardStats', leaderboardStatsSchema);
