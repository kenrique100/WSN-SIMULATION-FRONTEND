import apiClient from './apiClient';
import type { Alert, AlertStats } from '@/types';

interface ApiAlertResponse {
    alertId: number;
    sensorId: number;
    readingId: number;
    alertLevel: string;
    message?: string;
    timestamp: string;
    acknowledged: boolean;
    acknowledgedBy?: number;
    acknowledgedAt?: string;
}

interface PaginatedAlerts {
    content: Alert[];
    totalElements: number;
    totalPages: number;
}

export const getAlerts = async (
    acknowledged?: boolean,
    page: number = 0,
    size: number = 10
): Promise<PaginatedAlerts> => {
    const response = await apiClient.get('/api/alerts', {
        params: { acknowledged, page, size }
    });

    return {
        content: response.data.content.map((alert: ApiAlertResponse) => ({
            alertId: alert.alertId,
            sensorId: alert.sensorId,
            readingId: alert.readingId,
            alertLevel: alert.alertLevel as 'INFO' | 'WARNING' | 'CRITICAL',
            message: alert.message,
            timestamp: alert.timestamp,
            acknowledged: alert.acknowledged,
            acknowledgedBy: alert.acknowledgedBy,
            acknowledgedAt: alert.acknowledgedAt
        })),
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages
    };
};

export const getAlertById = async (alertId: number): Promise<Alert> => {
    const response = await apiClient.get(`/api/alerts/${alertId}`);
    return response.data;
};

export const acknowledgeAlert = async (
    alertId: number,
    userId: number
): Promise<Alert> => {
    const response = await apiClient.patch(
        `/api/alerts/${alertId}/acknowledge`,
        { userId }
    );
    return response.data;
};

export const getAlertStats = async (): Promise<AlertStats> => {
    const response = await apiClient.get('/api/alerts/stats');
    return response.data;
};

export const getRecentAlerts = async (size: number = 5): Promise<Alert[]> => {
    const response = await apiClient.get('/api/alerts/recent', {
        params: { size }
    });
    return response.data;
};