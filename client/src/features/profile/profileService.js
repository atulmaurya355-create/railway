import { httpClient } from '../../services/httpClient.js';

export const profileService = {
  async getProfile() {
    const response = await httpClient.get('/profile');
    return response.data.data.user;
  },

  async updateProfile(payload) {
    const response = await httpClient.put('/profile', payload);
    return response.data;
  },

  async changePassword(payload) {
    const response = await httpClient.patch('/profile/password', payload);
    return response.data;
  },

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await httpClient.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async deleteAccount(password) {
    const response = await httpClient.delete('/profile', {
      data: { password },
    });
    return response.data;
  },
};
