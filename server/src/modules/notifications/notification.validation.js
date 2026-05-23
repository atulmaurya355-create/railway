import { z } from 'zod';
import { objectIdSchema } from '../../shared/validators/objectId.validator.js';

export const notificationIdParamSchema = z.object({
  params: z.object({
    notificationId: objectIdSchema,
  }),
});

export const getUserNotificationsSchema = z.object({
  query: z.object({
    status: z.enum(['read', 'unread']).optional(),
    type: z.enum(['dailyReminder', 'achievement', 'newQuiz']).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    page: z.coerce.number().int().min(1).default(1),
  }),
});
