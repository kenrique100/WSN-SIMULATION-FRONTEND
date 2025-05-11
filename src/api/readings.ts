import apiClient from './apiClient';
import type { Reading, ReadingFilter } from '@/types';

export const getReadings = async (filters: ReadingFilter): Promise<Reading[]> => {
    const response = await apiClient.get('/readings', { params: filters });
    return response.data;
};

export const getNodeReadings = async (nodeId: number, hours: number): Promise<Reading[]> => {
    const response = await apiClient.get(`/nodes/${nodeId}/readings?hours=${hours}`);
    return response.data;
};

export const fetchLatestReadings = async (nodeId?: string): Promise<Reading[]> => {
    const response = await apiClient.get('/readings/latest', {
        params: { nodeId }
    });
    return response.data;
};

export const fetchReadingStats = async (): Promise<any> => {
    const response = await apiClient.get('/readings/stats');
    return response.data;
};