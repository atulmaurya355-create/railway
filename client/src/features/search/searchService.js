import { httpClient } from '../../services/httpClient.js';

export const searchService = {
  /**
   * Triggers the global unified search API
   * @param {Object} params - { q, type, difficulty, category, page, limit }
   */
  async globalSearch(params = {}) {
    try {
      const response = await httpClient.get('/search', { params });
      return response.data;
    } catch (error) {
      window.console.error('Error performing global search:', error);
      throw error;
    }
  },
};
