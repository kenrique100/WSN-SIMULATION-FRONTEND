import axios from 'axios';
import { LoginData, AuthResponse, UserCreateRequest } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;

// All auth functions are commented out
/*
export const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
};

export const createUser = async (data: UserCreateRequest, token: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/create-user`, data, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const logout = async (): Promise<void> => {
    await axios.post(`${API_URL}/auth/logout`);
};
*/