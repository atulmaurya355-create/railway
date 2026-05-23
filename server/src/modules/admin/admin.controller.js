import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  listUsers,
  toggleUserRole,
  toggleUserSuspension,
  deleteUser,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  broadcastNotification,
  resetLeaderboardScores,
  getAnalyticsOverview,
} from './admin.service.js';

export const listUsersHandler = asyncHandler(async (req, res) => {
  const data = await listUsers(req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

export const toggleUserRoleHandler = asyncHandler(async (req, res) => {
  const user = await toggleUserRole(req.params.userId, req.user.id);

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    data: { user },
  });
});

export const toggleUserSuspensionHandler = asyncHandler(async (req, res) => {
  const user = await toggleUserSuspension(req.params.userId, req.user.id);

  res.status(200).json({
    success: true,
    message: user.isSuspended ? 'User suspended successfully' : 'User suspension lifted',
    data: { user },
  });
});

export const deleteUserHandler = asyncHandler(async (req, res) => {
  const result = await deleteUser(req.params.userId, req.user.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const createQuestionHandler = asyncHandler(async (req, res) => {
  const question = await createQuestion(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: 'Question added successfully',
    data: { question },
  });
});

export const updateQuestionHandler = asyncHandler(async (req, res) => {
  const question = await updateQuestion(req.params.questionId, req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Question updated successfully',
    data: { question },
  });
});

export const deleteQuestionHandler = asyncHandler(async (req, res) => {
  const result = await deleteQuestion(req.params.questionId);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const broadcastNotificationHandler = asyncHandler(async (req, res) => {
  const result = await broadcastNotification(req.body);

  res.status(201).json({
    success: true,
    message: result.message,
    data: { sentCount: result.sentCount },
  });
});

export const resetLeaderboardScoresHandler = asyncHandler(async (req, res) => {
  const result = await resetLeaderboardScores();

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const getAnalyticsOverviewHandler = asyncHandler(async (req, res) => {
  const data = await getAnalyticsOverview();

  res.status(200).json({
    success: true,
    data,
  });
});
