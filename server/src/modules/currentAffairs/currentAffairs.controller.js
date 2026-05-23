import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  createCurrentAffairs,
  listCurrentAffairs,
  getCurrentAffairsById,
  updateCurrentAffairs,
  deleteCurrentAffairs,
  searchCurrentAffairs,
  createCurrentAffairsQuiz,
  listCurrentAffairsQuizzes,
  getCurrentAffairsQuizById,
  updateCurrentAffairsQuiz,
  deleteCurrentAffairsQuiz,
  submitCurrentAffairsQuiz,
  getUserQuizHistory,
  getCurrentAffairsQuizAttemptById,
} from './currentAffairs.service.js';

// ============ Current Affairs Controllers ============

export const createCurrentAffairsHandler = asyncHandler(async (req, res) => {
  const affairs = await createCurrentAffairs(req.body, req.user.id);

  res.status(201).json({
    success: true,
    message: 'Current affairs created successfully',
    data: { affairs },
  });
});

export const listCurrentAffairsHandler = asyncHandler(async (req, res) => {
  const data = await listCurrentAffairs(req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

export const getCurrentAffairsHandler = asyncHandler(async (req, res) => {
  const affairs = await getCurrentAffairsById(req.params.id);

  res.status(200).json({
    success: true,
    data: { affairs },
  });
});

export const updateCurrentAffairsHandler = asyncHandler(async (req, res) => {
  const affairs = await updateCurrentAffairs(req.params.id, req.body, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Current affairs updated successfully',
    data: { affairs },
  });
});

export const deleteCurrentAffairsHandler = asyncHandler(async (req, res) => {
  await deleteCurrentAffairs(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Current affairs deleted successfully',
  });
});

export const searchCurrentAffairsHandler = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const data = await searchCurrentAffairs(q, req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

// ============ Current Affairs Quiz Controllers ============

export const createCurrentAffairsQuizHandler = asyncHandler(async (req, res) => {
  const quiz = await createCurrentAffairsQuiz(req.body, req.user.id);

  res.status(201).json({
    success: true,
    message: 'Quiz created successfully',
    data: { quiz },
  });
});

export const listCurrentAffairsQuizzesHandler = asyncHandler(async (req, res) => {
  const data = await listCurrentAffairsQuizzes(req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

export const getCurrentAffairsQuizHandler = asyncHandler(async (req, res) => {
  const quiz = await getCurrentAffairsQuizById(req.params.id);

  res.status(200).json({
    success: true,
    data: { quiz },
  });
});

export const updateCurrentAffairsQuizHandler = asyncHandler(async (req, res) => {
  const quiz = await updateCurrentAffairsQuiz(req.params.id, req.body, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Quiz updated successfully',
    data: { quiz },
  });
});

export const deleteCurrentAffairsQuizHandler = asyncHandler(async (req, res) => {
  await deleteCurrentAffairsQuiz(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Quiz deleted successfully',
  });
});

export const submitCurrentAffairsQuizHandler = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const { answers, duration } = req.body;

  const { attempt, result } = await submitCurrentAffairsQuiz(quizId, answers, req.user.id, duration);

  res.status(200).json({
    success: true,
    message: 'Quiz submitted successfully',
    data: {
      attemptId: attempt._id,
      result,
    },
  });
});

export const getUserQuizHistoryHandler = asyncHandler(async (req, res) => {
  const data = await getUserQuizHistory(req.user.id, req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

export const getQuizAttemptHandler = asyncHandler(async (req, res) => {
  const attempt = await getCurrentAffairsQuizAttemptById(req.params.attemptId);

  res.status(200).json({
    success: true,
    data: { attempt },
  });
});
