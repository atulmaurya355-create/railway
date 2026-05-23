import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { uploadAvatar } from './avatar.upload.js';
import {
  getProfile,
  removeAccount,
  updatePassword,
  updateProfileDetails,
  uploadProfileAvatar,
} from './profile.controller.js';
import {
  changePasswordSchema,
  deleteAccountSchema,
  updateProfileSchema,
} from './profile.validation.js';

export const profileRoutes = Router();

profileRoutes.use(authenticate);

profileRoutes.get('/', getProfile);
profileRoutes.put('/', validateRequest(updateProfileSchema), updateProfileDetails);
profileRoutes.patch('/password', validateRequest(changePasswordSchema), updatePassword);
profileRoutes.post('/avatar', uploadAvatar.single('avatar'), uploadProfileAvatar);
profileRoutes.delete('/', validateRequest(deleteAccountSchema), removeAccount);
