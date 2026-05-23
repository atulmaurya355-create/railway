import { z } from 'zod';
import { objectIdSchema } from '../../shared/validators/objectId.validator.js';

const materialTypeSchema = z.enum(['notes', 'pdf', 'formulaSheet']);

export const listStudyMaterialsSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    materialType: materialTypeSchema.optional(),
    topic: z.string().trim().optional(),
    category: z.string().trim().optional(),
    examName: z.string().trim().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(12),
  }),
});

export const uploadStudyMaterialSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(180),
    description: z.string().trim().max(800).optional().default(''),
    materialType: materialTypeSchema,
    topic: z.string().trim().min(2).max(120),
    category: z.string().trim().min(2).max(120),
    examName: z.string().trim().max(120).optional().default('Railway Exams'),
  }),
});

export const studyMaterialParamsSchema = z.object({
  params: z.object({
    materialId: objectIdSchema,
  }),
});
