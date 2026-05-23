import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import {
  getRecommendationsHandler,
  getWeakTopicsHandler,
  createWeakTopicSprintHandler,
  getRevisionPlannerHandler,
  updateRevisionConfidenceHandler,
} from './recommendation.controller.js';

export const recommendationRoutes = Router();

// Apply auth checkpoint globally
recommendationRoutes.use(authenticate);

recommendationRoutes.get('/', getRecommendationsHandler);
recommendationRoutes.get('/weak-topics', getWeakTopicsHandler);
recommendationRoutes.post('/weak-topics/:topicName/sprint', createWeakTopicSprintHandler);
recommendationRoutes.get('/revisions', getRevisionPlannerHandler);
recommendationRoutes.put('/revisions/:scheduleId/confidence', updateRevisionConfidenceHandler);
