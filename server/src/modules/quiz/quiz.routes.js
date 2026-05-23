import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { getActiveQuiz, submitActiveQuiz } from './quiz.controller.js';
import { submitQuizSchema } from './quiz.validation.js';

export const quizRoutes = Router();

quizRoutes.use(authenticate);
quizRoutes.get('/active', getActiveQuiz);
quizRoutes.post('/submit', validateRequest(submitQuizSchema), submitActiveQuiz);
