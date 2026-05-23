import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import {
  getLanguagePreferenceHandler,
  setLanguagePreferenceHandler,
} from './language.controller.js';

export const languageRoutes = Router();

// Secure preference setting under auth check
languageRoutes.use(authenticate);

languageRoutes.route('/')
  .get(getLanguagePreferenceHandler)
  .post(setLanguagePreferenceHandler);
