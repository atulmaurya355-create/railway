import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  deletePreviousPaper,
  getPreviousPaperById,
  listPreviousPapers,
  uploadPreviousPaper,
} from './previousPaper.service.js';

export const uploadPreviousPaperHandler = asyncHandler(async (req, res) => {
  const paper = await uploadPreviousPaper(req.body, req.file, req.user.id);

  res.status(201).json({
    success: true,
    message: 'Previous year paper uploaded successfully',
    data: { paper },
  });
});

export const listPreviousPapersHandler = asyncHandler(async (req, res) => {
  const data = await listPreviousPapers(req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

export const getPreviousPaperHandler = asyncHandler(async (req, res) => {
  const paper = await getPreviousPaperById(req.params.paperId);

  res.status(200).json({
    success: true,
    data: { paper },
  });
});

export const downloadPreviousPaperHandler = asyncHandler(async (req, res) => {
  const paper = await getPreviousPaperById(req.params.paperId);

  res.status(200).json({
    success: true,
    data: {
      downloadUrl: paper.fileUrl,
      paper,
    },
  });
});

export const deletePreviousPaperHandler = asyncHandler(async (req, res) => {
  await deletePreviousPaper(req.params.paperId);

  res.status(200).json({
    success: true,
    message: 'Previous year paper deleted successfully',
  });
});
