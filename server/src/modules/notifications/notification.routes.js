import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  getUserNotificationsHandler,
  markAsReadHandler,
  markAllAsReadHandler,
  deleteNotificationHandler,
} from './notification.controller.js';
import {
  getUserNotificationsSchema,
  notificationIdParamSchema,
} from './notification.validation.js';

export const notificationRoutes = Router();

// Secure all endpoints with authentication
notificationRoutes.use(authenticate);

notificationRoutes.get(
  '/',
  validateRequest(getUserNotificationsSchema),
  getUserNotificationsHandler
);

notificationRoutes.patch(
  '/read-all',
  markAllAsReadHandler
);

notificationRoutes.patch(
  '/:notificationId/read',
  validateRequest(notificationIdParamSchema),
  markAsReadHandler
);

notificationRoutes.delete(
  '/:notificationId',
  validateRequest(notificationIdParamSchema),
  deleteNotificationHandler
);
