import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Token expired or invalid - clear auth and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/admin/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; full_name: string; password: string }) =>
    api.post('/register', data),
  
  login: (data: { email: string; password: string; is_admin?: boolean }) =>
    api.post('/login', data),
  
  adminLogin: (email: string, password: string) =>
    api.post('/login', { email, password, is_admin: true }),
  
  getMe: () => api.get('/me'),
  
  updateMe: (data: { full_name?: string }) => api.put('/me', data),
  
  changePassword: (data: { current_password: string; new_password: string }) =>
    api.put('/me/password', data),
  
  logout: () => api.post('/logout'),
};

// User API
export const userApi = {
  getProfile: () => api.get('/me'),
  updateProfile: (data: { full_name?: string }) => api.put('/me', data),
  changePassword: (data: { current_password: string; new_password: string }) =>
    api.put('/me/password', data),
};

// Admin API
export const adminApi = {
  listUsers: (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    role?: string;
    is_active?: boolean;
  }) => api.get('/admin/users', { params }),
  
  getUser: (userId: number) => api.get(`/admin/users/${userId}`),
  
  createUser: (data: {
    email: string;
    full_name?: string;
    password: string;
    role: 'user' | 'admin';
    is_active?: boolean;
  }) => api.post('/admin/users', data),
  
  updateUser: (userId: number, data: {
    full_name?: string;
    role?: 'user' | 'admin';
    is_active?: boolean;
    is_verified?: boolean;
  }) => api.put(`/admin/users/${userId}`, data),
  
  deleteUser: (userId: number) => api.delete(`/admin/users/${userId}`),
  
  activateUser: (userId: number) => api.post(`/admin/users/${userId}/activate`),
  
  deactivateUser: (userId: number) => api.post(`/admin/users/${userId}/deactivate`),
};

// Health check
export const healthApi = {
  check: () => api.get('/health'),
};

export default api;