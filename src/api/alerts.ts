import apiClient from './index';
import type { Alert } from '../types';

export const getAlerts = async (): Promise<Alert[]> => {
    const response = await apiClient.get('/alerts');
    return response.data;
};

export const acknowledgeAlert = async (alertId: number, userId: number): Promise<Alert> => {
    const response = await apiClient.post(`/alerts/${alertId}/acknowledge`, { userId });
    return response.data;
};