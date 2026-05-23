import { httpClient } from '../../services/httpClient.js';

export const currentAffairsService = {
  // ============ Current Affairs Endpoints ============

  async getAffairsList(params = {}) {
    try {
      const response = await httpClient.get('/current-affairs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching current affairs list:', error);
      throw error;
    }
  },

  async getAffairsByType(type, params = {}) {
    try {
      const response = await httpClient.get('/current-affairs', {
        params: { ...params, affairsType: type },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current affairs by type:', error);
      throw error;
    }
  },

  async getAffairsByCategory(category, params = {}) {
    try {
      const response = await httpClient.get('/current-affairs', {
        params: { ...params, category },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current affairs by category:', error);
      throw error;
    }
  },

  async getAffairsById(id) {
    try {
      const response = await httpClient.get(`/current-affairs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current affairs details:', error);
      throw error;
    }
  },

  async searchAffairs(query, params = {}) {
    try {
      const response = await httpClient.get('/current-affairs/search', {
        params: { q: query, ...params },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching current affairs:', error);
      throw error;
    }
  },

  async createAffairs(payload) {
    try {
      const response = await httpClient.post('/current-affairs', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating current affairs:', error);
      throw error;
    }
  },

  async updateAffairs(id, payload) {
    try {
      const response = await httpClient.patch(`/current-affairs/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating current affairs:', error);
      throw error;
    }
  },

  async deleteAffairs(id) {
    try {
      const response = await httpClient.delete(`/current-affairs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting current affairs:', error);
      throw error;
    }
  },

  // ============ Current Affairs Quiz Endpoints ============

  async getQuizList(params = {}) {
    try {
      const response = await httpClient.get('/current-affairs/quiz/list', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz list:', error);
      throw error;
    }
  },

  async getQuizzesByType(type, params = {}) {
    try {
      const response = await httpClient.get('/current-affairs/quiz/list', {
        params: { ...params, quizType: type },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching quizzes by type:', error);
      throw error;
    }
  },

  async getQuizById(id) {
    try {
      const response = await httpClient.get(`/current-affairs/quiz/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz details:', error);
      throw error;
    }
  },

  async submitQuiz(quizId, answers, duration) {
    try {
      const response = await httpClient.post(`/current-affairs/quiz/submit/${quizId}`, {
        answers,
        duration,
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  },

  async getQuizHistory(params = {}) {
    try {
      const response = await httpClient.get('/current-affairs/attempts/history', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz history:', error);
      throw error;
    }
  },

  async getQuizAttempt(attemptId) {
    try {
      const response = await httpClient.get(`/current-affairs/attempts/${attemptId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz attempt:', error);
      throw error;
    }
  },

  // ============ Admin Endpoints ============

  async createQuiz(payload) {
    try {
      const response = await httpClient.post('/current-affairs/quiz', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  },

  async updateQuiz(id, payload) {
    try {
      const response = await httpClient.patch(`/current-affairs/quiz/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  },

  async deleteQuiz(id) {
    try {
      const response = await httpClient.delete(`/current-affairs/quiz/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  },
};
