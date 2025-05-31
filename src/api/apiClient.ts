import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Types
interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
  [key: string]: unknown;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string; // Ensure this is always returned
  user: any;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Store notification function (set externally)
let showNotification: (message: string, type: 'error' | 'success' | 'info') => void;

// Store logout function (set externally)
let handleLogout: () => Promise<void>;

/**
 * Initialize API client with required functions
 */
export const initApiClient = (config: {
  showNotification: (message: string, type: 'error' | 'success' | 'info') => void;
  handleLogout: () => Promise<void>;
}) => {
  showNotification = config.showNotification;
  handleLogout = config.handleLogout;
};

/**
 * Handles successful login response
 */
export const handleLoginSuccess = (response: AxiosResponse<LoginResponse>) => {
  const { accessToken, refreshToken } = response.data;

  if (!refreshToken) {
    throw new Error('No refresh token received from server');
  }

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);

  return response;
};

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Skip token refresh for login endpoint
    if (originalRequest.url?.includes('/auth/login')) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized (token refresh)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          if (handleLogout) await handleLogout();
          throw new Error('No refresh token available');
        }

        const response = await axios.post<RefreshTokenResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        if (!accessToken) {
          throw new Error('No access token received from refresh');
        }

        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        if (showNotification) {
          showNotification('Session expired. Please log in again.', 'error');
        }
        if (handleLogout) await handleLogout();
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = getErrorMessage(error);
    if (showNotification) showNotification(errorMessage, 'error');
    return Promise.reject(error);
  }
);

// Helper function for error messages
function getErrorMessage(error: AxiosError<ApiErrorResponse>): string {
  if (error.response) {
    switch (error.response.status) {
      case 400: return error.response.data?.message || 'Bad request';
      case 401: return 'Please log in to continue';
      case 403: return 'Access denied';
      case 404: return 'Resource not found';
      case 500: return 'Server error';
      default: return error.response.data?.message || 'Request failed';
    }
  } else if (error.code === 'ECONNABORTED') {
    return 'Request timeout';
  } else if (error.code === 'ERR_NETWORK') {
    return 'Network error';
  }
  return 'An unexpected error occurred';
}

export default apiClient;