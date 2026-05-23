import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  getGlobalLeaderboard,
  getWeeklyLeaderboard,
  getMonthlyLeaderboard,
  getHighestScores,
  getStreakLeaderboard,
  getAccuracyLeaderboard,
  getTopPerformers,
  getUserRank,
  getUserStats,
  updateUserStats,
  recalculateLeaderboard,
  resetWeeklyScores,
  resetMonthlyScores,
  searchLeaderboard,
  getNearbyRanks,
} from './leaderboard.service.js';

export const getGlobalLeaderboardHandler = asyncHandler(async (req, res) => {
  const data = await getGlobalLeaderboard(req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

export const getWeeklyLeaderboardHandler = asyncHandler(async (req, res) => {
  const data = await getWeeklyLeaderboard(req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

export const getMonthlyLeaderboardHandler = asyncHandler(async (req, res) => {
  const data = await getMonthlyLeaderboard(req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

export const getHighestScoresHandler = asyncHandler(async (req, res) => {
  const data = await getHighestScores(req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

export const getStreakLeaderboardHandler = asyncHandler(async (req, res) => {
  const data = await getStreakLeaderboard(req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

export const getAccuracyLeaderboardHandler = asyncHandler(async (req, res) => {
  const data = await getAccuracyLeaderboard(req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

export const getTopPerformersHandler = asyncHandler(async (req, res) => {
  const data = await getTopPerformers(req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

export const getUserRankHandler = asyncHandler(async (req, res) => {
  const data = await getUserRank(req.params.userId);

  res.status(200).json({
    success: true,
    data,
  });
});

export const getUserStatsHandler = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user.id;
  const stats = await getUserStats(userId);

  res.status(200).json({
    success: true,
    data: { stats },
  });
});

export const updateUserStatsHandler = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const stats = await updateUserStats(userId, req.body);

  res.status(200).json({
    success: true,
    message: 'User stats updated',
    data: { stats },
  });
});

export const getNearbyRanksHandler = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const range = req.query.range || 5;
  const data = await getNearbyRanks(userId, parseInt(range));

  res.status(200).json({
    success: true,
    data,
  });
});

export const searchLeaderboardHandler = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required',
    });
  }

  const data = await searchLeaderboard(q, req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

// Admin handlers
export const recalculateLeaderboardHandler = asyncHandler(async (req, res) => {
  const result = await recalculateLeaderboard();

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const resetWeeklyScoresHandler = asyncHandler(async (req, res) => {
  const result = await resetWeeklyScores();

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const resetMonthlyScoresHandler = asyncHandler(async (req, res) => {
  const result = await resetMonthlyScores();

  res.status(200).json({
    success: true,
    message: result.message,
  });
});
