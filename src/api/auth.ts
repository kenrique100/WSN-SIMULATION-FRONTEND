import axios from 'axios';
import { LoginData, RegisterData, AuthResponse } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
};

export const register = async (data: {
    name: string;
    username: string;
    email: string;
    password: string
}): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
};

export const refreshToken = async (): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/refresh`);
    return response.data;
};

export const logout = async (): Promise<void> => {
    await axios.post(`${API_URL}/auth/logout`);
};