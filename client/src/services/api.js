import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePassword: (data) => api.put('/auth/password', data),
};

// News API
export const newsAPI = {
  getAll: (params) => api.get('/news', { params }),
  getBySlug: (slug) => api.get(`/news/${slug}`),
  getByCategory: (slug, params) => api.get(`/news/category/${slug}`, { params }),
  getFeatured: (limit) => api.get('/news/featured', { params: { limit } }),
  getBreaking: (limit) => api.get('/news/breaking', { params: { limit } }),
  getTrending: (limit) => api.get('/news/trending', { params: { limit } }),
  getRelated: (id, limit) => api.get(`/news/${id}/related`, { params: { limit } }),
  search: (params) => api.get('/news/search', { params }),
  // Admin
  getAllAdmin: (params) => api.get('/news/admin/all', { params }),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
};

// Category API
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  // Admin
  getAllAdmin: () => api.get('/categories/admin/all'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Comment API
export const commentAPI = {
  getByNews: (newsId) => api.get(`/comments/news/${newsId}`),
  create: (data) => api.post('/comments', data),
  // Admin
  getAll: (params) => api.get('/comments/admin', { params }),
  approve: (id) => api.put(`/comments/${id}/approve`),
  delete: (id) => api.delete(`/comments/${id}`),
};

// Media API
export const mediaAPI = {
  getAll: (params) => api.get('/media', { params }),
  upload: (formData) => api.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/media/${id}`),
};

// User API (Admin)
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  resetPassword: (id, data) => api.put(`/users/${id}/reset-password`, data),
};

// Subscriber API
export const subscriberAPI = {
  subscribe: (data) => api.post('/subscribers', data),
  unsubscribe: (data) => api.put('/subscribers/unsubscribe', data),
  // Admin
  getAll: (params) => api.get('/subscribers', { params }),
  delete: (id) => api.delete(`/subscribers/${id}`),
};

export default api;
