import { httpClient } from '../../services/httpClient.js';

export const authService = {
  async register(payload) {
    const response = await httpClient.post('/auth/register', payload);
    return response.data.data;
  },

  async login(payload) {
    const response = await httpClient.post('/auth/login', payload);
    return response.data.data;
  },

  async logout() {
    await httpClient.post('/auth/logout');
  },

  async refresh() {
    const response = await httpClient.post('/auth/refresh');
    return response.data.data;
  },

  async me() {
    const response = await httpClient.get('/auth/me');
    return response.data.data.user;
  },

  async forgotPassword(email) {
    const response = await httpClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(payload) {
    const response = await httpClient.post('/auth/reset-password', payload);
    return response.data;
  },

  async verifyEmail(token) {
    const response = await httpClient.get(`/auth/verify-email/${token}`);
    return response.data;
  },
};
