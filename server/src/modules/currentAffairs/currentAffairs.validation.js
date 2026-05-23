import { z } from 'zod';
import { objectIdSchema } from '../../shared/validators/objectId.validator.js';

// Current Affairs CRUD schemas
export const createCurrentAffairsSchema = z.object({
  body: z.object({
    title: z.string().trim().min(5).max(200),
    description: z.string().trim().min(10).max(2000),
    content: z.string().min(20),
    category: z.enum(['governance', 'economy', 'defence', 'sports', 'sciencetech', 'international', 'national', 'other']),
    affairsType: z.enum(['daily', 'weekly', 'monthly']),
    date: z.string().datetime().or(z.date()),
    keyPoints: z.array(z.string().trim()).optional(),
    relatedTopics: z.array(z.string().trim()).optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    importance: z.enum(['high', 'medium', 'low']).optional(),
    source: z.string().trim().max(200).optional(),
    isPublished: z.boolean().optional(),
  }),
});

export const updateCurrentAffairsSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    title: z.string().trim().min(5).max(200).optional(),
    description: z.string().trim().min(10).max(2000).optional(),
    content: z.string().min(20).optional(),
    category: z.enum(['governance', 'economy', 'defence', 'sports', 'sciencetech', 'international', 'national', 'other']).optional(),
    affairsType: z.enum(['daily', 'weekly', 'monthly']).optional(),
    date: z.string().datetime().or(z.date()).optional(),
    keyPoints: z.array(z.string().trim()).optional(),
    relatedTopics: z.array(z.string().trim()).optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    importance: z.enum(['high', 'medium', 'low']).optional(),
    source: z.string().trim().max(200).optional(),
    isPublished: z.boolean().optional(),
  }),
});

export const getAffairsParamsSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const listCurrentAffairsSchema = z.object({
  query: z.object({
    affairsType: z.enum(['daily', 'weekly', 'monthly']).optional(),
    category: z.string().trim().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    page: z.coerce.number().int().min(1).default(1),
    sort: z.enum(['newest', 'oldest', 'mostViewed']).optional(),
  }),
});

// Current Affairs Quiz schemas
export const createCurrentAffairsQuizSchema = z.object({
  body: z.object({
    title: z.string().trim().min(5).max(200),
    description: z.string().trim().max(500).optional(),
    quizType: z.enum(['daily', 'weekly', 'monthly']),
    relatedAffairs: z.array(objectIdSchema).optional(),
    questions: z.array(
      z.object({
        questionText: z.string().trim().min(5),
        questionType: z.enum(['mcq', 'multiselect', 'truefalse']).default('mcq'),
        options: z.array(
          z.object({
            text: z.string().trim().min(1),
            isCorrect: z.boolean(),
          })
        ),
        explanation: z.string().trim().optional(),
        difficulty: z.enum(['easy', 'medium', 'hard']),
        marks: z.number().int().min(1).optional(),
      })
    ),
    totalMarks: z.number().int().min(1),
    duration: z.number().int().min(1),
    passingScore: z.number().int().min(1).max(100).optional(),
    isPublished: z.boolean().optional(),
  }),
});

export const updateCurrentAffairsQuizSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    title: z.string().trim().min(5).max(200).optional(),
    description: z.string().trim().max(500).optional(),
    quizType: z.enum(['daily', 'weekly', 'monthly']).optional(),
    relatedAffairs: z.array(objectIdSchema).optional(),
    questions: z.array(
      z.object({
        questionText: z.string().trim().min(5),
        questionType: z.enum(['mcq', 'multiselect', 'truefalse']).default('mcq'),
        options: z.array(
          z.object({
            text: z.string().trim().min(1),
            isCorrect: z.boolean(),
          })
        ),
        explanation: z.string().trim().optional(),
        difficulty: z.enum(['easy', 'medium', 'hard']),
        marks: z.number().int().min(1).optional(),
      })
    ).optional(),
    totalMarks: z.number().int().min(1).optional(),
    duration: z.number().int().min(1).optional(),
    passingScore: z.number().int().min(1).max(100).optional(),
    isPublished: z.boolean().optional(),
  }),
});

export const startCurrentAffairsQuizSchema = z.object({
  params: z.object({
    quizId: objectIdSchema,
  }),
});

export const submitCurrentAffairsQuizSchema = z.object({
  params: z.object({
    quizId: objectIdSchema,
  }),
  body: z.object({
    answers: z.array(
      z.object({
        questionIndex: z.number().int().min(0),
        selectedOptions: z.array(z.string().trim()),
      })
    ),
    duration: z.number().int().min(0),
  }),
});

export const getQuizAttemptsSchema = z.object({
  query: z.object({
    quizType: z.enum(['daily', 'weekly', 'monthly']).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    page: z.coerce.number().int().min(1).default(1),
  }),
});

export const getQuizParamsSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});
