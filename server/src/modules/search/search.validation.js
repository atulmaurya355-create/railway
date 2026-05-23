import { z } from 'zod';

export const globalSearchSchema = z.object({
  query: z.object({
    q: z.string().trim().default(''),
    type: z.enum(['all', 'question', 'note', 'pdf', 'current_affair']).default('all'),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    category: z.string().trim().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  }),
});
