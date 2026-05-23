import { ApiError } from '../../utils/apiError.js';
import { PreviousPaper } from './previousPaper.model.js';

export async function uploadPreviousPaper(payload, file, userId) {
  if (!file) {
    throw new ApiError(400, 'PDF file is required');
  }

  const paper = await PreviousPaper.create({
    ...payload,
    fileName: file.filename,
    originalName: file.originalname,
    fileUrl: `/uploads/previous-papers/${file.filename}`,
    fileSize: file.size,
    uploadedBy: userId,
  });

  return paper;
}

export async function listPreviousPapers(filters) {
  const page = filters.page;
  const limit = filters.limit;
  const skip = (page - 1) * limit;
  const query = { isActive: true };

  if (filters.year) {
    query.year = filters.year;
  }

  if (filters.examName) {
    query.examName = new RegExp(escapeRegex(filters.examName), 'i');
  }

  if (filters.search) {
    query.$or = [
      { title: new RegExp(escapeRegex(filters.search), 'i') },
      { examName: new RegExp(escapeRegex(filters.search), 'i') },
      { shift: new RegExp(escapeRegex(filters.search), 'i') },
      { language: new RegExp(escapeRegex(filters.search), 'i') },
      { originalName: new RegExp(escapeRegex(filters.search), 'i') },
    ];
  }

  const [papers, total, years] = await Promise.all([
    PreviousPaper.find(query).sort({ year: -1, createdAt: -1 }).skip(skip).limit(limit),
    PreviousPaper.countDocuments(query),
    PreviousPaper.distinct('year', { isActive: true }),
  ]);

  return {
    papers,
    years: years.sort((a, b) => b - a),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getPreviousPaperById(paperId) {
  const paper = await PreviousPaper.findOne({ _id: paperId, isActive: true });

  if (!paper) {
    throw new ApiError(404, 'Previous year paper not found');
  }

  return paper;
}

export async function deletePreviousPaper(paperId) {
  const paper = await PreviousPaper.findByIdAndUpdate(
    paperId,
    { isActive: false },
    { new: true },
  );

  if (!paper) {
    throw new ApiError(404, 'Previous year paper not found');
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
