import { ApiError } from '../../utils/apiError.js';
import { StudyMaterial } from './studyMaterial.model.js';

export async function uploadStudyMaterial(payload, file, userId) {
  if (!file) {
    throw new ApiError(400, 'Study material file is required');
  }

  const material = await StudyMaterial.create({
    ...payload,
    fileName: file.filename,
    originalName: file.originalname,
    fileUrl: `/uploads/study-materials/${file.filename}`,
    mimeType: file.mimetype,
    fileSize: file.size,
    uploadedBy: userId,
  });

  return material;
}

export async function listStudyMaterials(filters) {
  const page = filters.page;
  const limit = filters.limit;
  const skip = (page - 1) * limit;
  const query = { isActive: true };

  if (filters.materialType) query.materialType = filters.materialType;
  if (filters.topic) query.topic = new RegExp(escapeRegex(filters.topic), 'i');
  if (filters.category) query.category = new RegExp(escapeRegex(filters.category), 'i');
  if (filters.examName) query.examName = new RegExp(escapeRegex(filters.examName), 'i');

  if (filters.search) {
    query.$or = [
      { title: new RegExp(escapeRegex(filters.search), 'i') },
      { description: new RegExp(escapeRegex(filters.search), 'i') },
      { topic: new RegExp(escapeRegex(filters.search), 'i') },
      { category: new RegExp(escapeRegex(filters.search), 'i') },
      { examName: new RegExp(escapeRegex(filters.search), 'i') },
      { originalName: new RegExp(escapeRegex(filters.search), 'i') },
    ];
  }

  const [materials, total, topics, categories] = await Promise.all([
    StudyMaterial.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    StudyMaterial.countDocuments(query),
    StudyMaterial.distinct('topic', { isActive: true }),
    StudyMaterial.distinct('category', { isActive: true }),
  ]);

  return {
    materials,
    topics: topics.sort(),
    categories: categories.sort(),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getStudyMaterialById(materialId) {
  const material = await StudyMaterial.findOne({ _id: materialId, isActive: true });

  if (!material) {
    throw new ApiError(404, 'Study material not found');
  }

  return material;
}

export async function getStudyMaterialDownload(materialId) {
  const material = await getStudyMaterialById(materialId);
  material.downloadCount += 1;
  await material.save();

  return material;
}

export async function deleteStudyMaterial(materialId) {
  const material = await StudyMaterial.findByIdAndUpdate(
    materialId,
    { isActive: false },
    { new: true },
  );

  if (!material) {
    throw new ApiError(404, 'Study material not found');
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
