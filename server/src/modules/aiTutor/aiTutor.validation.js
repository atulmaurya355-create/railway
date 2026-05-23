import { z } from 'zod';
import { objectIdSchema } from '../../shared/validators/objectId.validator.js';

const tutorModeSchema = z.enum(['doubt', 'reasoning', 'explain', 'generate', 'planner', 'recommend']);

export const askTutorSchema = z.object({
  body: z.object({
    sessionId: objectIdSchema.optional(),
    mode: tutorModeSchema.default('doubt'),
    message: z.string().trim().min(2).max(4000),
    context: z
      .object({
        examTarget: z.string().trim().max(120).optional(),
        topic: z.string().trim().max(120).optional(),
        difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
      })
      .optional()
      .default({}),
  }),
});

export const sessionParamsSchema = z.object({
  params: z.object({
    sessionId: objectIdSchema,
  }),
});
