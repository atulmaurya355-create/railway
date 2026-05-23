import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  deleteStudyMaterialHandler,
  downloadStudyMaterialHandler,
  getStudyMaterialHandler,
  listStudyMaterialsHandler,
  uploadStudyMaterialHandler,
} from './studyMaterial.controller.js';
import { uploadStudyMaterialFile } from './studyMaterial.upload.js';
import {
  listStudyMaterialsSchema,
  studyMaterialParamsSchema,
  uploadStudyMaterialSchema,
} from './studyMaterial.validation.js';

export const studyMaterialRoutes = Router();

studyMaterialRoutes.use(authenticate);

studyMaterialRoutes.get('/', validateRequest(listStudyMaterialsSchema), listStudyMaterialsHandler);
studyMaterialRoutes.post(
  '/',
  authorize('admin'),
  uploadStudyMaterialFile.single('material'),
  validateRequest(uploadStudyMaterialSchema),
  uploadStudyMaterialHandler,
);
studyMaterialRoutes.get(
  '/:materialId',
  validateRequest(studyMaterialParamsSchema),
  getStudyMaterialHandler,
);
studyMaterialRoutes.get(
  '/:materialId/download',
  validateRequest(studyMaterialParamsSchema),
  downloadStudyMaterialHandler,
);
studyMaterialRoutes.delete(
  '/:materialId',
  authorize('admin'),
  validateRequest(studyMaterialParamsSchema),
  deleteStudyMaterialHandler,
);
