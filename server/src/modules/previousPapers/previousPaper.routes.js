import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  deletePreviousPaperHandler,
  downloadPreviousPaperHandler,
  getPreviousPaperHandler,
  listPreviousPapersHandler,
  uploadPreviousPaperHandler,
} from './previousPaper.controller.js';
import { uploadPreviousPaperPdf } from './previousPaper.upload.js';
import {
  listPreviousPapersSchema,
  previousPaperParamsSchema,
  uploadPreviousPaperSchema,
} from './previousPaper.validation.js';

export const previousPaperRoutes = Router();

previousPaperRoutes.use(authenticate);

previousPaperRoutes.get('/', validateRequest(listPreviousPapersSchema), listPreviousPapersHandler);
previousPaperRoutes.post(
  '/',
  authorize('admin'),
  uploadPreviousPaperPdf.single('pdf'),
  validateRequest(uploadPreviousPaperSchema),
  uploadPreviousPaperHandler,
);
previousPaperRoutes.get(
  '/:paperId',
  validateRequest(previousPaperParamsSchema),
  getPreviousPaperHandler,
);
previousPaperRoutes.get(
  '/:paperId/download',
  validateRequest(previousPaperParamsSchema),
  downloadPreviousPaperHandler,
);
previousPaperRoutes.delete(
  '/:paperId',
  authorize('admin'),
  validateRequest(previousPaperParamsSchema),
  deletePreviousPaperHandler,
);
