import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  createQuestionHandler,
  deleteQuestionHandler,
  getQuestionHandler,
  listQuestionsHandler,
  updateQuestionHandler,
} from './question.controller.js';
import {
  createQuestionSchema,
  deleteQuestionSchema,
  getQuestionSchema,
  listQuestionsSchema,
  updateQuestionSchema,
} from './question.validation.js';

export const questionRoutes = Router();

questionRoutes.use(authenticate);

questionRoutes.get('/', validateRequest(listQuestionsSchema), listQuestionsHandler);
questionRoutes.get('/:id', validateRequest(getQuestionSchema), getQuestionHandler);
questionRoutes.post('/', authorize('admin'), validateRequest(createQuestionSchema), createQuestionHandler);
questionRoutes.put('/:id', authorize('admin'), validateRequest(updateQuestionSchema), updateQuestionHandler);
questionRoutes.delete(
  '/:id',
  authorize('admin'),
  validateRequest(deleteQuestionSchema),
  deleteQuestionHandler,
);
