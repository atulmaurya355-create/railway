import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  getGlobalLeaderboardHandler,
  getWeeklyLeaderboardHandler,
  getMonthlyLeaderboardHandler,
  getHighestScoresHandler,
  getStreakLeaderboardHandler,
  getAccuracyLeaderboardHandler,
  getTopPerformersHandler,
  getUserRankHandler,
  getUserStatsHandler,
  updateUserStatsHandler,
  getNearbyRanksHandler,
  searchLeaderboardHandler,
  recalculateLeaderboardHandler,
  resetWeeklyScoresHandler,
  resetMonthlyScoresHandler,
} from './leaderboard.controller.js';
import {
  getGlobalLeaderboardSchema,
  getWeeklyLeaderboardSchema,
  getMonthlyLeaderboardSchema,
  getHighestScoresSchema,
  getStreakLeaderboardSchema,
  getAccuracyLeaderboardSchema,
  topPerformersSchema,
  getUserRankSchema,
  getUserStatsSchema,
  updateUserStatsSchema,
} from './leaderboard.validation.js';

export const leaderboardRoutes = Router();

// ============ Public Routes ============
leaderboardRoutes.get(
  '/global',
  validateRequest(getGlobalLeaderboardSchema),
  getGlobalLeaderboardHandler
);

leaderboardRoutes.get(
  '/weekly',
  validateRequest(getWeeklyLeaderboardSchema),
  getWeeklyLeaderboardHandler
);

leaderboardRoutes.get(
  '/monthly',
  validateRequest(getMonthlyLeaderboardSchema),
  getMonthlyLeaderboardHandler
);

leaderboardRoutes.get(
  '/highest-scores',
  validateRequest(getHighestScoresSchema),
  getHighestScoresHandler
);

leaderboardRoutes.get(
  '/streak',
  validateRequest(getStreakLeaderboardSchema),
  getStreakLeaderboardHandler
);

leaderboardRoutes.get(
  '/accuracy',
  validateRequest(getAccuracyLeaderboardSchema),
  getAccuracyLeaderboardHandler
);

leaderboardRoutes.get(
  '/top-performers',
  validateRequest(topPerformersSchema),
  getTopPerformersHandler
);

leaderboardRoutes.get(
  '/search',
  validateRequest(getHighestScoresSchema),
  searchLeaderboardHandler
);

leaderboardRoutes.get(
  '/user/:userId',
  validateRequest(getUserRankSchema),
  getUserRankHandler
);

// ============ Protected Routes ============
leaderboardRoutes.use(authenticate);

leaderboardRoutes.get(
  '/stats',
  validateRequest(getUserStatsSchema),
  getUserStatsHandler
);

leaderboardRoutes.get(
  '/stats/:userId',
  validateRequest(getUserStatsSchema),
  getUserStatsHandler
);

leaderboardRoutes.post(
  '/stats/update',
  validateRequest(updateUserStatsSchema),
  updateUserStatsHandler
);

leaderboardRoutes.get(
  '/nearby',
  getNearbyRanksHandler
);

// ============ Admin Routes ============
leaderboardRoutes.post(
  '/admin/recalculate',
  authorize('admin'),
  recalculateLeaderboardHandler
);

leaderboardRoutes.post(
  '/admin/reset-weekly',
  authorize('admin'),
  resetWeeklyScoresHandler
);

leaderboardRoutes.post(
  '/admin/reset-monthly',
  authorize('admin'),
  resetMonthlyScoresHandler
);
