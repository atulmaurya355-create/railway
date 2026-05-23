import { z } from 'zod';
import { objectIdSchema } from '../../shared/validators/objectId.validator.js';

export const listPreviousPapersSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    year: z.coerce.number().int().min(1990).max(2100).optional(),
    examName: z.string().trim().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(12),
  }),
});

export const uploadPreviousPaperSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(180),
    examName: z.string().trim().min(2).max(120),
    year: z.coerce.number().int().min(1990).max(2100),
    shift: z.string().trim().max(80).optional().default(''),
    language: z.string().trim().max(50).optional().default('English'),
  }),
});

export const previousPaperParamsSchema = z.object({
  params: z.object({
    paperId: objectIdSchema,
  }),
});
