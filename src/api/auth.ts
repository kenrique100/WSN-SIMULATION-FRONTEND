import apiClient from './apiClient';
import type { LoginRequest, AuthResponse, UserCreateRequest, UserResponse, TokenRefreshResponse } from '@/types';

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const refreshToken = async (refreshToken: string): Promise<TokenRefreshResponse> => {
  const response = await apiClient.post('/auth/refresh', null, { params: { refreshToken } });
  return response.data;
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
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

export const getAllUsers = async (): Promise<UserResponse[]> => {
  const response = await apiClient.get('/users');
  return response.data;
};

export const activateUser = async (userId: number): Promise<UserResponse> => {
  const response = await apiClient.put(`/users/${userId}/activate`);
  return response.data;
};

export const deactivateUser = async (userId: number): Promise<UserResponse> => {
  const response = await apiClient.put(`/users/${userId}/deactivate`);
  return response.data;
};
