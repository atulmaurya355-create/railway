import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import {
  listUsersHandler,
  toggleUserRoleHandler,
  toggleUserSuspensionHandler,
  deleteUserHandler,
  createQuestionHandler,
  updateQuestionHandler,
  deleteQuestionHandler,
  broadcastNotificationHandler,
  resetLeaderboardScoresHandler,
  getAnalyticsOverviewHandler,
} from './admin.controller.js';

export const adminRoutes = Router();

// Apply auth protection globally - exclusively for administrators
adminRoutes.use(authenticate, authorize('admin'));

adminRoutes.get('/analytics', getAnalyticsOverviewHandler);

adminRoutes.route('/users')
  .get(listUsersHandler);

adminRoutes.route('/users/:userId/role')
  .put(toggleUserRoleHandler);

adminRoutes.route('/users/:userId/suspend')
  .put(toggleUserSuspensionHandler);

adminRoutes.route('/users/:userId')
  .delete(deleteUserHandler);

adminRoutes.route('/questions')
  .post(createQuestionHandler);

adminRoutes.route('/questions/:questionId')
  .put(updateQuestionHandler)
  .delete(deleteQuestionHandler);

adminRoutes.post('/notifications/broadcast', broadcastNotificationHandler);
adminRoutes.post('/leaderboard/reset', resetLeaderboardScoresHandler);
