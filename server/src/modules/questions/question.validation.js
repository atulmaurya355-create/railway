import { z } from 'zod';
import { objectIdSchema } from '../../shared/validators/objectId.validator.js';

const difficultySchema = z.enum(['easy', 'medium', 'hard']);
const answerSchema = z.enum(['A', 'B', 'C', 'D']);

const questionBodySchema = z.object({
  question: z.string().trim().min(10).max(1000),
  optionA: z.string().trim().min(1).max(300),
  optionB: z.string().trim().min(1).max(300),
  optionC: z.string().trim().min(1).max(300),
  optionD: z.string().trim().min(1).max(300),
  correctAnswer: answerSchema,
  difficulty: difficultySchema,
  topic: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(120),
  explanation: z.string().trim().min(10).max(1500),
  isActive: z.boolean().optional(),
});

export const createQuestionSchema = z.object({
  body: questionBodySchema,
});

export const updateQuestionSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: questionBodySchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field is required',
  }),
});

export const getQuestionSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const deleteQuestionSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const listQuestionsSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    topic: z.string().trim().optional(),
    category: z.string().trim().optional(),
    difficulty: difficultySchema.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    includeInactive: z
      .string()
      .optional()
      .transform((value) => value === 'true'),
  }),
});
