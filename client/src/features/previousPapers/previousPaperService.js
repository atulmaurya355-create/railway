import { httpClient } from '../../services/httpClient.js';

const fallbackPapers = [
  {
    _id: 'sample-rrb-ntpc-2025',
    title: 'RRB NTPC 2025 Shift 1 Paper',
    examName: 'RRB NTPC',
    year: 2025,
    shift: 'Shift 1',
    language: 'English',
    fileUrl: '',
    fileSize: 0,
  },
  {
    _id: 'sample-group-d-2024',
    title: 'RRB Group D 2024 Practice Paper',
    examName: 'RRB Group D',
    year: 2024,
    shift: 'Morning',
    language: 'English',
    fileUrl: '',
    fileSize: 0,
  },
];

export const previousPaperService = {
  async list(params = {}) {
    try {
      const response = await httpClient.get('/previous-papers', { params });
      return response.data.data;
    } catch (_error) {
      return {
        papers: fallbackPapers,
        years: [2025, 2024],
        pagination: {
          page: 1,
          limit: fallbackPapers.length,
          total: fallbackPapers.length,
          totalPages: 1,
        },
      };
    }
  },

  async upload(payload) {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('examName', payload.examName);
    formData.append('year', payload.year);
    formData.append('shift', payload.shift);
    formData.append('language', payload.language);
    formData.append('pdf', payload.pdf);

    const response = await httpClient.post('/previous-papers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async getDownloadUrl(paperId) {
    const response = await httpClient.get(`/previous-papers/${paperId}/download`);
    return response.data.data.downloadUrl;
  },
};

export function buildPaperAssetUrl(path) {
  if (!path) {
    return '';
  }

  if (path.startsWith('http')) {
    return path;
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';
  const serverBaseUrl = apiBaseUrl.replace(/\/api\/v\d+\/?$/, '');
  return `${serverBaseUrl}${path}`;
}
