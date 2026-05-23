import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  getAttemptRankHandler,
  getLeaderboardHandler,
  getMockTestAttemptHandler,
  getMockTestConfigHandler,
  startMockTestHandler,
  submitMockTestHandler,
  getAttemptsHistoryHandler,
} from './mockTest.controller.js';
import {
  attemptParamsSchema,
  leaderboardSchema,
  startMockTestSchema,
  submitMockTestSchema,
} from './mockTest.validation.js';

export const mockTestRoutes = Router();

mockTestRoutes.use(authenticate);

mockTestRoutes.get('/config', getMockTestConfigHandler);
mockTestRoutes.get('/leaderboard', validateRequest(leaderboardSchema), getLeaderboardHandler);
mockTestRoutes.post('/start', validateRequest(startMockTestSchema), startMockTestHandler);
mockTestRoutes.get('/history/attempts', getAttemptsHistoryHandler);
mockTestRoutes.get('/:attemptId', validateRequest(attemptParamsSchema), getMockTestAttemptHandler);
mockTestRoutes.post('/:attemptId/submit', validateRequest(submitMockTestSchema), submitMockTestHandler);
mockTestRoutes.get('/:attemptId/rank', validateRequest(attemptParamsSchema), getAttemptRankHandler);
