import apiClient from './apiClient';
import type {
  LoginRequest,
  AuthResponse,
  UserCreateRequest,
  UserResponse,
  TokenRefreshResponse,
  UserUpdateRequest
} from '@/types';

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const refreshToken = async (refreshToken: string): Promise<TokenRefreshResponse> => {
  const response = await apiClient.post('/auth/refresh', { refreshToken });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

export const createUser = async (data: UserCreateRequest): Promise<UserResponse> => {
  const response = await apiClient.post('/auth/create-user', data);
  return response.data;
};

export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  await apiClient.put('/auth/change-password', data);
};

export const updateProfile = async (data: {
  name?: string;
  email?: string;
  avatarUrl?: string;
}): Promise<UserResponse> => {
  const response = await apiClient.put('/auth/profile', data);
  return response.data;
};

export const getAllUsers = async (page = 0, size = 10): Promise<UserResponse[]> => {
  const response = await apiClient.get('/users', { params: { page, size } });
  return response.data;
};

export const getUserById = async (userId: number): Promise<UserResponse> => {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
};

export const updateUser = async (
  userId: number,
  data: UserUpdateRequest
): Promise<UserResponse> => {
  const response = await apiClient.put(`/users/${userId}`, data);
  return response.data;
};

export const updateUserStatus = async (
  userId: number,
  active: boolean
): Promise<UserResponse> => {
  const response = await apiClient.put(`/users/${userId}/status`, null, {
    params: { active }
  });
  return response.data;
};

export const deleteUser = async (userId: number): Promise<void> => {
  await apiClient.delete(`/users/${userId}`);
};