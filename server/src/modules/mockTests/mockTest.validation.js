import { z } from 'zod';
import { objectIdSchema } from '../../shared/validators/objectId.validator.js';

export const startMockTestSchema = z.object({
  body: z.object({
    testType: z.enum(['fullLength', 'sectional']),
    category: z.string().trim().min(2).max(120).optional(),
    topic: z.string().trim().max(120).optional(),
    questionCount: z.number().int().min(1).max(100).optional(),
    durationMinutes: z.number().int().min(1).max(180).optional(),
  }),
});

export const submitMockTestSchema = z.object({
  params: z.object({
    attemptId: objectIdSchema,
  }),
  body: z.object({
    answers: z.record(z.string(), z.enum(['A', 'B', 'C', 'D'])),
    timeTakenSeconds: z.number().int().min(0),
    isAutoSubmitted: z.boolean().optional().default(false),
  }),
});

export const attemptParamsSchema = z.object({
  params: z.object({
    attemptId: objectIdSchema,
  }),
});

export const leaderboardSchema = z.object({
  query: z.object({
    testType: z.enum(['fullLength', 'sectional']).optional(),
    category: z.string().trim().optional(),
    topic: z.string().trim().optional(),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  }),
});
