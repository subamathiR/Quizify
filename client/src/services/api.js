import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Request Interceptor to add Bearer Token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('quizify_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me'),
};

export const userAPI = {
  updateProfile: (data) => API.put('/users/profile', data),
  getDashboardStats: () => API.get('/users/dashboard'),
  getAllUsers: () => API.get('/users'),
};

export const quizAPI = {
  getQuizzes: (params) => API.get('/quizzes', { params }),
  getQuizById: (id) => API.get(`/quizzes/${id}`),
  createQuiz: (data) => API.post('/quizzes', data),
  updateQuiz: (id, data) => API.put(`/quizzes/${id}`, data),
  deleteQuiz: (id) => API.delete(`/quizzes/${id}`),
  addQuestion: (quizId, data) => API.post(`/quizzes/${quizId}/questions`, data),
  updateQuestion: (quizId, questionId, data) => API.put(`/quizzes/${quizId}/questions/${questionId}`, data),
  deleteQuestion: (quizId, questionId) => API.delete(`/quizzes/${quizId}/questions/${questionId}`),
};

export const attemptAPI = {
  submitAttempt: (data) => API.post('/attempts', data),
  getMyAttempts: () => API.get('/attempts/my'),
  getAttemptById: (id) => API.get(`/attempts/${id}`),
  getAllAttempts: () => API.get('/attempts/all'),
};

export const categoryAPI = {
  getCategories: () => API.get('/categories'),
  createCategory: (data) => API.post('/categories', data),
  updateCategory: (id, data) => API.put(`/categories/${id}`, data),
  deleteCategory: (id) => API.delete(`/categories/${id}`),
};

export const leaderboardAPI = {
  getLeaderboard: (timeFrame) => API.get('/leaderboard', { params: { timeFrame } }),
};

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
};

export default API;
