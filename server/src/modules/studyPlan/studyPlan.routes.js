import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import {
  getActiveStudyPlanHandler,
  generateStudyPlanHandler,
  addStudyTaskHandler,
  toggleStudyTaskHandler,
} from './studyPlan.controller.js';

export const studyPlanRoutes = Router();

// Apply auth protection globally to all study plan actions
studyPlanRoutes.use(authenticate);

studyPlanRoutes.get('/', getActiveStudyPlanHandler);
studyPlanRoutes.post('/generate', generateStudyPlanHandler);
studyPlanRoutes.post('/tasks', addStudyTaskHandler);
studyPlanRoutes.put('/tasks/:taskId/toggle', toggleStudyTaskHandler);
