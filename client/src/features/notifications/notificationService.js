import { httpClient } from '../../services/httpClient.js';

export const notificationService = {
  /**
   * Fetches user notifications with optional pagination and filtering
   * @param {Object} params - { status: 'unread'|'read', type, page, limit }
   */
  async getNotifications(params = {}) {
    try {
      const response = await httpClient.get('/notifications', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  /**
   * Marks a specific notification as read
   * @param {string} notificationId
   */
  async markAsRead(notificationId) {
    try {
      const response = await httpClient.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      throw error;
    }
  },

  /**
   * Marks all notifications as read
   */
  async markAllRead() {
    try {
      const response = await httpClient.patch('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Deletes a specific notification
   * @param {string} notificationId
   */
  async deleteNotification(notificationId) {
    try {
      const response = await httpClient.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting notification ${notificationId}:`, error);
      throw error;
    }
  },
};
