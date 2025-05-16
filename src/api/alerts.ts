import apiClient from './apiClient';
import type { Alert, AlertStats, PaginatedResponse } from '@/types';

export const getAlerts = async (
  acknowledged?: boolean,
  page: number = 0,
  size: number = 10
): Promise<PaginatedResponse<Alert>> => {
    const response = await apiClient.get('/alerts', {
        params: { acknowledged, page, size }
    });
    return response.data;
};

export const getAlertById = async (alertId: number): Promise<Alert> => {
    const response = await apiClient.get(`/alerts/${alertId}`);
    return response.data;
};

export const acknowledgeAlert = async (
  alertId: number,
  userId: number
): Promise<Alert> => {
    const response = await apiClient.post(
      `/alerts/${alertId}/acknowledge`,
      { userId }
    );
    return response.data;
};

export const getAlertStats = async (): Promise<AlertStats> => {
    try {
        const response = await apiClient.get('/alerts/stats');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch alert stats:', error);
        throw error;
    }
};

export const getRecentAlerts = async (size: number = 5): Promise<Alert[]> => {
    try {
        const response = await apiClient.get('/alerts/recent', {
            params: { size }
        });
        return response.data.content;
    } catch (error) {
        console.error('Failed to fetch recent alerts:', error);
        throw error;
    }
};