import axios from 'axios';
import { clearAccessToken, setAccessToken } from '../features/auth/authStorage.js';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const httpClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('railway-prep-access-token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url ?? '';
    const canRefresh =
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !url.includes('/auth/login') &&
      !url.includes('/auth/register') &&
      !url.includes('/auth/refresh');

    if (canRefresh) {
      try {
        originalRequest._retry = true;
        const response = await axios.post(`${apiBaseUrl}/auth/refresh`, null, {
          withCredentials: true,
        });
        const accessToken = response.data.data.accessToken;
        setAccessToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        clearAccessToken();
        return Promise.reject(refreshError.response?.data ?? refreshError);
      }
    }

    return Promise.reject(error.response?.data ?? error);
  },
);
