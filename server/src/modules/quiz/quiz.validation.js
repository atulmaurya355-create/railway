import { z } from 'zod';

export const submitQuizSchema = z.object({
  body: z.object({
    answers: z.record(z.string(), z.number().int().min(0).max(10)),
    skippedQuestionIds: z.array(z.string()).optional().default([]),
    bookmarkedQuestionIds: z.array(z.string()).optional().default([]),
    timeTakenSeconds: z.number().int().min(0),
  }),
});
