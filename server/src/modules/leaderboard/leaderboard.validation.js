import { z } from 'zod';
import { objectIdSchema } from '../../shared/validators/objectId.validator.js';

export const getGlobalLeaderboardSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z
      .enum(['rank', 'score', 'accuracy', 'tests'])
      .optional()
      .default('rank'),
  }),
});

export const getWeeklyLeaderboardSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z
      .enum(['rank', 'score', 'accuracy', 'tests'])
      .optional()
      .default('rank'),
    week: z.coerce.number().int().min(1).optional(),
    year: z.coerce.number().int().min(2020).optional(),
  }),
});

export const getMonthlyLeaderboardSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z
      .enum(['rank', 'score', 'accuracy', 'tests'])
      .optional()
      .default('rank'),
    month: z.coerce.number().int().min(1).max(12).optional(),
    year: z.coerce.number().int().min(2020).optional(),
  }),
});

export const getHighestScoresSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    period: z.enum(['all', 'week', 'month']).optional().default('all'),
    category: z.string().trim().optional(),
  }),
});

export const getUserRankSchema = z.object({
  params: z.object({
    userId: objectIdSchema,
  }),
});

export const getStreakLeaderboardSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    type: z.enum(['current', 'longest']).optional().default('current'),
  }),
});

export const getAccuracyLeaderboardSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    minAttempts: z.coerce.number().int().min(1).default(5),
  }),
});

export const topPerformersSchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(50).default(10),
    period: z.enum(['week', 'month']).optional(),
  }),
});

export const getUserStatsSchema = z.object({
  params: z.object({
    userId: objectIdSchema.optional(),
  }),
});

export const updateUserStatsSchema = z.object({
  body: z.object({
    testScore: z.number().optional(),
    quizScore: z.number().optional(),
    accuracy: z.number().optional(),
    testPassed: z.boolean().optional(),
    xpGained: z.number().optional(),
  }),
});
