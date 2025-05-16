// src/api/readings.
import apiClient from './apiClient';
import type { Reading, ReadingFilter, ReadingStats, PaginatedResponse } from '@/types';

export const getReadings = async (filters: ReadingFilter = {}): Promise<PaginatedResponse<Reading>> => {
    const response = await apiClient.get('/readings', {
        params: {
            page: filters.page || 0,
            size: filters.size || 20,
            sensorId: filters.sensorId,
            nodeId: filters.nodeId,
            hours: filters.hours
        }
    });
    return response.data;
};

export const getSensorReadings = async (
  sensorId: number,
  page = 0,
  size = 20
): Promise<PaginatedResponse<Reading>> => {
    const response = await apiClient.get(`/readings/sensor/${sensorId}`, {
        params: { page, size }
    });
    return response.data;
};

export const getNodeReadings = async (
  nodeId: number,
  page = 0,
  size = 20
): Promise<PaginatedResponse<Reading>> => {
    const response = await apiClient.get(`/readings/node/${nodeId}`, {
        params: { page, size }
    });
    return response.data;
};

export const createReading = async (
  sensorId: number,
  value: number
): Promise<Reading> => {
    const response = await apiClient.post('/readings', { sensorId, value });
    return response.data;
};

export const getReadingStats = async (
  sensorId?: number,
  nodeId?: number,
  hours = 24
): Promise<ReadingStats> => {
    const response = await apiClient.get('/readings/stats', {
        params: { sensorId, nodeId, hours }
    });
    return response.data;
};