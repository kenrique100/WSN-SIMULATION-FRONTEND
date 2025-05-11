import apiClient from './apiClient';
import type { Alert } from '@/types';

export const getAlerts = async (): Promise<Alert[]> => {
    const response = await apiClient.get('/alerts');
    return response.data;
};

export const getAlertDetails = async (id: number): Promise<Alert> => {
    const response = await apiClient.get(`/alerts/${id}`);
    return response.data;
};

export const acknowledgeAlert = async (alertId: number, userId: number): Promise<Alert> => {
    const response = await apiClient.post(`/alerts/${alertId}/acknowledge`, { userId });
    return response.data;
};

export const getAlertStats = async (): Promise<{
    critical: number;
    warning: number;
    info: number;
    acknowledged: number;
}> => {
    const response = await apiClient.get('/alerts/stats');
    return response.data;
};

export const getRecentAlerts = async (limit: number = 5): Promise<Alert[]> => {
    const response = await apiClient.get(`/alerts/recent?limit=${limit}`);
    return response.data;
};