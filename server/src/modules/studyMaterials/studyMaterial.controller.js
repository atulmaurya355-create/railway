import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  deleteStudyMaterial,
  getStudyMaterialById,
  getStudyMaterialDownload,
  listStudyMaterials,
  uploadStudyMaterial,
} from './studyMaterial.service.js';

export const uploadStudyMaterialHandler = asyncHandler(async (req, res) => {
  const material = await uploadStudyMaterial(req.body, req.file, req.user.id);

  res.status(201).json({
    success: true,
    message: 'Study material uploaded successfully',
    data: { material },
  });
});

export const listStudyMaterialsHandler = asyncHandler(async (req, res) => {
  const data = await listStudyMaterials(req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

export const getStudyMaterialHandler = asyncHandler(async (req, res) => {
  const material = await getStudyMaterialById(req.params.materialId);

  res.status(200).json({
    success: true,
    data: { material },
  });
});

export const downloadStudyMaterialHandler = asyncHandler(async (req, res) => {
  const material = await getStudyMaterialDownload(req.params.materialId);

  res.status(200).json({
    success: true,
    data: {
      downloadUrl: material.fileUrl,
      material,
    },
  });
});

export const deleteStudyMaterialHandler = asyncHandler(async (req, res) => {
  await deleteStudyMaterial(req.params.materialId);

  res.status(200).json({
    success: true,
    message: 'Study material deleted successfully',
  });
});
