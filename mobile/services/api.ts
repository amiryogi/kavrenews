import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../constants/Config';

const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
      // Navigation is handled by the auth context
    }
    return Promise.reject(error);
  }
);

// News API
export const newsAPI = {
  getAll: (params?: object) => api.get('/news', { params }),
  getBySlug: (slug: string) => api.get(`/news/${slug}`),
  getByCategory: (slug: string, params?: object) => api.get(`/news/category/${slug}`, { params }),
  getFeatured: (limit?: number) => api.get('/news/featured', { params: { limit } }),
  getBreaking: (limit?: number) => api.get('/news/breaking', { params: { limit } }),
  getTrending: (limit?: number) => api.get('/news/trending', { params: { limit } }),
  getRelated: (id: string, limit?: number) => api.get(`/news/${id}/related`, { params: { limit } }),
  search: (params: object) => api.get('/news/search', { params }),
};

// Category API
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
};

// Comment API
export const commentAPI = {
  getByNews: (newsId: string) => api.get(`/comments/news/${newsId}`),
  create: (data: object) => api.post('/comments', data),
};

// Auth API (for future admin features)
export const authAPI = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Subscriber API
export const subscriberAPI = {
  subscribe: (data: { email: string }) => api.post('/subscribers', data),
};

export default api;
