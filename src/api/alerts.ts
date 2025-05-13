// src/api/alerts.ts
import apiClient from './apiClient';
import { getMockAlerts, mockAlertStats } from './mockAlerts';
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
    try {
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
    } catch (error: any) {
        console.warn('Using mock alerts data due to error:', error);
        return getMockAlerts(acknowledged, page, size);
    }
};

export const getAlertById = async (alertId: number): Promise<Alert> => {
    try {
        const response = await apiClient.get(`/api/alerts/${alertId}`);
        return response.data;
    } catch (error: any) {
        const message =
          error?.response?.status === 500
            ? 'Internal server error while loading alert details.'
            : error?.message || 'Failed to fetch alert.';
        throw new Error(message);
    }
};

export const acknowledgeAlert = async (
  alertId: number,
  userId: number
): Promise<Alert> => {
    try {
        const response = await apiClient.patch(
          `/api/alerts/${alertId}/acknowledge`,
          { userId }
        );
        return response.data;
    } catch (error: any) {
        const message =
          error?.response?.status === 500
            ? 'Internal server error while acknowledging alert.'
            : error?.message || 'Failed to acknowledge alert.';
        throw new Error(message);
    }
};

export const getAlertStats = async (): Promise<AlertStats> => {
    try {
        const response = await apiClient.get('/api/alerts/stats');
        return response.data;
    } catch (error) {
        console.warn('Using mock alert stats due to error:', error);
        return mockAlertStats;
    }
};

export const getRecentAlerts = async (size: number = 5): Promise<Alert[]> => {
    try {
        const response = await apiClient.get('/api/alerts/recent', {
            params: { size }
        });
        return response.data;
    } catch (error: any) {
        const message =
          error?.response?.status === 500
            ? 'Internal server error while fetching recent alerts.'
            : error?.message || 'Failed to fetch recent alerts.';
        throw new Error(message);
    }
};
