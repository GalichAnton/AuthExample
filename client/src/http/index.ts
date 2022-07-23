import axios, { AxiosRequestConfig } from 'axios';

import { IAuthResponse } from '../interfaces/response/AuthResponse';

export const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get<IAuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
        localStorage.setItem('token', response.data.accessToken);
        return await api.request(originalRequest);
      } catch (e) {
        console.log('Unauthorized');
      }
    }
    throw error;
  }
);

export default api;
