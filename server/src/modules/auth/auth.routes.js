import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  forgotPassword,
  login,
  logout,
  me,
  refresh,
  register,
  updatePasswordFromReset,
  verifyEmailAddress,
} from './auth.controller.js';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from './auth.validation.js';

export const authRoutes = Router();

authRoutes.post('/register', validateRequest(registerSchema), register);
authRoutes.post('/login', validateRequest(loginSchema), login);
authRoutes.post('/refresh', refresh);
authRoutes.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);
authRoutes.post('/reset-password', validateRequest(resetPasswordSchema), updatePasswordFromReset);
authRoutes.get('/verify-email/:token', validateRequest(verifyEmailSchema), verifyEmailAddress);
authRoutes.get('/me', authenticate, me);
authRoutes.post('/logout', authenticate, logout);
