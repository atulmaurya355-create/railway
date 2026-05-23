import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  getAttemptForUser,
  getAttemptRank,
  getLeaderboard,
  getMockTestConfig,
  startMockTest,
  submitMockTest,
  getAttemptsHistory,
} from './mockTest.service.js';

export const getMockTestConfigHandler = asyncHandler(async (_req, res) => {
  res.status(200).json({
    success: true,
    data: getMockTestConfig(),
  });
});

export const startMockTestHandler = asyncHandler(async (req, res) => {
  const attempt = await startMockTest(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: 'Mock test started successfully',
    data: { attempt },
  });
});

export const getMockTestAttemptHandler = asyncHandler(async (req, res) => {
  const attempt = await getAttemptForUser(req.params.attemptId, req.user.id);

  res.status(200).json({
    success: true,
    data: { attempt },
  });
});

export const submitMockTestHandler = asyncHandler(async (req, res) => {
  const result = await submitMockTest(req.params.attemptId, req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Mock test submitted successfully',
    data: { result },
  });
});

export const getAttemptRankHandler = asyncHandler(async (req, res) => {
  const rank = await getAttemptRank(req.params.attemptId, req.user.id);

  res.status(200).json({
    success: true,
    data: { rank },
  });
});

export const getLeaderboardHandler = asyncHandler(async (req, res) => {
  const leaderboard = await getLeaderboard(req.query);

  res.status(200).json({
    success: true,
    data: { leaderboard },
  });
});

export const getAttemptsHistoryHandler = asyncHandler(async (req, res) => {
  const attempts = await getAttemptsHistory(req.user.id);

  res.status(200).json({
    success: true,
    data: { attempts },
  });
});

