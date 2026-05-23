import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { globalSearchHandler } from './search.controller.js';
import { globalSearchSchema } from './search.validation.js';

export const searchRoutes = Router();

// Protect all search endpoints with authentication
searchRoutes.use(authenticate);

searchRoutes.get('/', validateRequest(globalSearchSchema), globalSearchHandler);
