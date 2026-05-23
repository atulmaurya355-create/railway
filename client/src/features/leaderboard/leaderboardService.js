import { httpClient } from '../../services/httpClient.js';

export const leaderboardService = {
  // ============ Public Leaderboard Endpoints ============

  async getGlobalLeaderboard(params = {}) {
    try {
      const response = await httpClient.get('/leaderboard/global', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching global leaderboard:', error);
      throw error;
    }
  },

  async getWeeklyLeaderboard(params = {}) {
    try {
      const response = await httpClient.get('/leaderboard/weekly', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly leaderboard:', error);
      throw error;
    }
  },

  async getMonthlyLeaderboard(params = {}) {
    try {
      const response = await httpClient.get('/leaderboard/monthly', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly leaderboard:', error);
      throw error;
    }
  },

  async getHighestScores(params = {}) {
    try {
      const response = await httpClient.get('/leaderboard/highest-scores', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching highest scores:', error);
      throw error;
    }
  },

  async getStreakLeaderboard(params = {}) {
    try {
      const response = await httpClient.get('/leaderboard/streak', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching streak leaderboard:', error);
      throw error;
    }
  },

  async getAccuracyLeaderboard(params = {}) {
    try {
      const response = await httpClient.get('/leaderboard/accuracy', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching accuracy leaderboard:', error);
      throw error;
    }
  },

  async getTopPerformers(params = {}) {
    try {
      const response = await httpClient.get('/leaderboard/top-performers', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top performers:', error);
      throw error;
    }
  },

  async getUserRank(userId) {
    try {
      const response = await httpClient.get(`/leaderboard/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user rank:', error);
      throw error;
    }
  },

  async searchLeaderboard(query, params = {}) {
    try {
      const response = await httpClient.get('/leaderboard/search', {
        params: { q: query, ...params },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching leaderboard:', error);
      throw error;
    }
  },

  // ============ Protected User Stats Endpoints ============

  async getUserStats(userId = null) {
    try {
      const url = userId ? `/leaderboard/stats/${userId}` : '/leaderboard/stats';
      const response = await httpClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  async updateUserStats(updateData) {
    try {
      const response = await httpClient.post('/leaderboard/stats/update', updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  },

  async getNearbyRanks(range = 5) {
    try {
      const response = await httpClient.get('/leaderboard/nearby', {
        params: { range },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby ranks:', error);
      throw error;
    }
  },

  // ============ Admin Endpoints ============

  async recalculateLeaderboard() {
    try {
      const response = await httpClient.post('/leaderboard/admin/recalculate');
      return response.data;
    } catch (error) {
      console.error('Error recalculating leaderboard:', error);
      throw error;
    }
  },

  async resetWeeklyScores() {
    try {
      const response = await httpClient.post('/leaderboard/admin/reset-weekly');
      return response.data;
    } catch (error) {
      console.error('Error resetting weekly scores:', error);
      throw error;
    }
  },

  async resetMonthlyScores() {
    try {
      const response = await httpClient.post('/leaderboard/admin/reset-monthly');
      return response.data;
    } catch (error) {
      console.error('Error resetting monthly scores:', error);
      throw error;
    }
  },
};
