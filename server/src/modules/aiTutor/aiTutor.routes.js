import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  askTutorHandler,
  deleteTutorSessionHandler,
  getTutorSessionHandler,
  listTutorSessionsHandler,
} from './aiTutor.controller.js';
import { askTutorSchema, sessionParamsSchema } from './aiTutor.validation.js';

export const aiTutorRoutes = Router();

aiTutorRoutes.use(authenticate);

aiTutorRoutes.get('/sessions', listTutorSessionsHandler);
aiTutorRoutes.get('/sessions/:sessionId', validateRequest(sessionParamsSchema), getTutorSessionHandler);
aiTutorRoutes.delete('/sessions/:sessionId', validateRequest(sessionParamsSchema), deleteTutorSessionHandler);
aiTutorRoutes.post('/ask', validateRequest(askTutorSchema), askTutorHandler);
