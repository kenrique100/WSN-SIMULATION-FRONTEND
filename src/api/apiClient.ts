// apiClient.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';
import { notify } from '@/store/notificationService';

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
    skipErrorNotification?: boolean;
  }
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
  [key: string]: unknown;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    if (config.skipAuthRefresh) {
      return config;
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Skip handling for auth endpoints or already retried requests
    if (error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/')) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/auth/refresh`,
            { refreshToken: refreshToken.startsWith('Bearer ') ? refreshToken : `Bearer ${refreshToken}` },
            { skipAuthRefresh: true, skipErrorNotification: true }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Refresh token failed', refreshError);
        if (!originalRequest.skipErrorNotification) {
          notify('Session expired. Please login again.', 'error');
        }
        await useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }

    // Skip notification for requests that explicitly request it
    if (originalRequest.skipErrorNotification) {
      return Promise.reject(error);
    }

    const errorMessage = getErrorMessage(error);
    if (!originalRequest.skipAuthRefresh && error.response?.status === 401) {
      notify('Session expired. Please login again.', 'error');
    } else {
      notify(errorMessage, 'error');
    }

    return Promise.reject(error);
  }
);

function getErrorMessage(error: AxiosError<ApiErrorResponse>): string {
  if (error.response) {
    if (error.response.status === 403) {
      return 'You do not have permission to perform this action';
    } else if (error.response.status >= 500) {
      return 'Server error. Please try again later.';
    }
    return error.response.data?.message ||
      error.response.data?.error ||
      error.message ||
      'An unexpected error occurred';
  } else if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.';
  } else if (error.code === 'ERR_NETWORK') {
    return 'Network error. Please check your connection.';
  }
  return 'An unexpected error occurred';
}

export default apiClient;