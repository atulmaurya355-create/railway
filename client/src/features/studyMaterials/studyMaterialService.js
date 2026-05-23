import { httpClient } from '../../services/httpClient.js';

export const materialTypes = [
  { id: '', label: 'All Materials' },
  { id: 'notes', label: 'Notes' },
  { id: 'pdf', label: 'PDFs' },
  { id: 'formulaSheet', label: 'Formula Sheets' },
];

const fallbackMaterials = [
  {
    _id: 'sample-notes-math',
    title: 'Arithmetic Quick Notes',
    description: 'Topic-wise notes for percentage, ratio, average, and time-speed-distance.',
    materialType: 'notes',
    topic: 'Mathematics',
    category: 'RRB NTPC',
    examName: 'Railway Exams',
    fileUrl: '',
    fileSize: 0,
    downloadCount: 0,
  },
  {
    _id: 'sample-formula-reasoning',
    title: 'Reasoning Formula Sheet',
    description: 'Shortcuts for series, coding-decoding, blood relation, and direction tests.',
    materialType: 'formulaSheet',
    topic: 'Reasoning',
    category: 'Group D',
    examName: 'Railway Exams',
    fileUrl: '',
    fileSize: 0,
    downloadCount: 0,
  },
  {
    _id: 'sample-pdf-science',
    title: 'General Science Revision PDF',
    description: 'Physics, chemistry, and biology one-shot revision for railway exams.',
    materialType: 'pdf',
    topic: 'General Science',
    category: 'RRB NTPC',
    examName: 'Railway Exams',
    fileUrl: '',
    fileSize: 0,
    downloadCount: 0,
  },
];

export const studyMaterialService = {
  async list(params = {}) {
    try {
      const response = await httpClient.get('/study-materials', { params });
      return response.data.data;
    } catch (_error) {
      return {
        materials: fallbackMaterials.filter((material) => {
          if (params.materialType && material.materialType !== params.materialType) return false;
          if (params.topic && material.topic !== params.topic) return false;
          if (params.category && material.category !== params.category) return false;
          if (params.search) {
            const haystack = `${material.title} ${material.description} ${material.topic} ${material.category}`.toLowerCase();
            return haystack.includes(params.search.toLowerCase());
          }
          return true;
        }),
        topics: ['Mathematics', 'Reasoning', 'General Science'],
        categories: ['RRB NTPC', 'Group D'],
        pagination: {
          page: 1,
          limit: 12,
          total: fallbackMaterials.length,
          totalPages: 1,
        },
      };
    }
  },

  async upload(payload) {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('materialType', payload.materialType);
    formData.append('topic', payload.topic);
    formData.append('category', payload.category);
    formData.append('examName', payload.examName);
    formData.append('material', payload.material);

    const response = await httpClient.post('/study-materials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async getDownloadUrl(materialId) {
    const response = await httpClient.get(`/study-materials/${materialId}/download`);
    return response.data.data.downloadUrl;
  },
};

export function buildMaterialAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';
  const serverBaseUrl = apiBaseUrl.replace(/\/api\/v\d+\/?$/, '');
  return `${serverBaseUrl}${path}`;
}
