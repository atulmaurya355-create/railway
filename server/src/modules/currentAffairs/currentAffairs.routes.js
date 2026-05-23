import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  createCurrentAffairsHandler,
  listCurrentAffairsHandler,
  getCurrentAffairsHandler,
  updateCurrentAffairsHandler,
  deleteCurrentAffairsHandler,
  searchCurrentAffairsHandler,
  createCurrentAffairsQuizHandler,
  listCurrentAffairsQuizzesHandler,
  getCurrentAffairsQuizHandler,
  updateCurrentAffairsQuizHandler,
  deleteCurrentAffairsQuizHandler,
  submitCurrentAffairsQuizHandler,
  getUserQuizHistoryHandler,
  getQuizAttemptHandler,
} from './currentAffairs.controller.js';
import {
  createCurrentAffairsSchema,
  updateCurrentAffairsSchema,
  getAffairsParamsSchema,
  listCurrentAffairsSchema,
  createCurrentAffairsQuizSchema,
  updateCurrentAffairsQuizSchema,
  startCurrentAffairsQuizSchema,
  submitCurrentAffairsQuizSchema,
  getQuizAttemptsSchema,
  getQuizParamsSchema,
} from './currentAffairs.validation.js';

export const currentAffairsRoutes = Router();

// ============ Current Affairs Routes - Public ============
currentAffairsRoutes.get(
  '/',
  validateRequest(listCurrentAffairsSchema),
  listCurrentAffairsHandler
);

currentAffairsRoutes.get(
  '/search',
  validateRequest(listCurrentAffairsSchema),
  searchCurrentAffairsHandler
);

currentAffairsRoutes.get(
  '/:id',
  validateRequest(getAffairsParamsSchema),
  getCurrentAffairsHandler
);

// ============ Current Affairs Routes - Protected (Admin) ============
currentAffairsRoutes.use(authenticate);

currentAffairsRoutes.post(
  '/',
  authorize('admin'),
  validateRequest(createCurrentAffairsSchema),
  createCurrentAffairsHandler
);

currentAffairsRoutes.patch(
  '/:id',
  authorize('admin'),
  validateRequest(updateCurrentAffairsSchema),
  updateCurrentAffairsHandler
);

currentAffairsRoutes.delete(
  '/:id',
  authorize('admin'),
  validateRequest(getAffairsParamsSchema),
  deleteCurrentAffairsHandler
);

// ============ Quiz Routes - Public ============
currentAffairsRoutes.get(
  '/quiz/list',
  validateRequest(getQuizAttemptsSchema),
  listCurrentAffairsQuizzesHandler
);

currentAffairsRoutes.get(
  '/quiz/:id',
  validateRequest(getQuizParamsSchema),
  getCurrentAffairsQuizHandler
);

// ============ Quiz Routes - Protected ============
currentAffairsRoutes.post(
  '/quiz/submit/:quizId',
  validateRequest(submitCurrentAffairsQuizSchema),
  submitCurrentAffairsQuizHandler
);

currentAffairsRoutes.get(
  '/attempts/history',
  validateRequest(getQuizAttemptsSchema),
  getUserQuizHistoryHandler
);

currentAffairsRoutes.get(
  '/attempts/:attemptId',
  getQuizAttemptHandler
);

// ============ Quiz Routes - Admin ============
currentAffairsRoutes.post(
  '/quiz',
  authorize('admin'),
  validateRequest(createCurrentAffairsQuizSchema),
  createCurrentAffairsQuizHandler
);

currentAffairsRoutes.patch(
  '/quiz/:id',
  authorize('admin'),
  validateRequest(updateCurrentAffairsQuizSchema),
  updateCurrentAffairsQuizHandler
);

currentAffairsRoutes.delete(
  '/quiz/:id',
  authorize('admin'),
  validateRequest(getQuizParamsSchema),
  deleteCurrentAffairsQuizHandler
);
