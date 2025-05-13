// src/api/readings.ts
import apiClient from './apiClient';
import type { Reading, ReadingFilter, ReadingStats } from '@/types';

// Mock data for fallback
const MOCK_READINGS: Reading[] = [
    {
        readingId: 1,
        sensorId: 1,
        value: 23.5,
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
        readingId: 2,
        sensorId: 1,
        value: 24.1,
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
        readingId: 3,
        sensorId: 1,
        value: 25.2,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
        readingId: 4,
        sensorId: 1,
        value: 24.8,
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
        readingId: 5,
        sensorId: 2,
        value: 45.2,
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
        readingId: 6,
        sensorId: 2,
        value: 46.0,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
        readingId: 7,
        sensorId: 3,
        value: 1012.5,
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
        readingId: 8,
        sensorId: 3,
        value: 1013.2,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
];

const MOCK_STATS: ReadingStats = {
    average: 24.4,
    min: 23.5,
    max: 25.2,
    count: 4,
    firstReading: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    lastReading: new Date().toISOString(),
    trend: 'up',
};

const isBackendAvailable = async () => {
    try {
        await apiClient.get('/health');
        return true;
    } catch (error) {
        console.warn('Backend not available, using mock data');
        return false;
    }
};

// Mock implementations
const mockGetReadings = async (filters: ReadingFilter): Promise<Reading[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const filtered = MOCK_READINGS.filter(r =>
              (!filters.sensorId || r.sensorId === filters.sensorId) &&
              (!filters.nodeId || r.sensorId === filters.nodeId) // Simplified for mock
            );
            resolve(filtered.slice(0, filters.limit || 100));
        }, 500);
    });
};

const mockGetReadingStats = async (): Promise<ReadingStats> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(MOCK_STATS), 500);
    });
};

// Actual API functions with fallback
export const getReadings = async (filters: ReadingFilter): Promise<Reading[]> => {
    try {
        const isAvailable = await isBackendAvailable();
        if (isAvailable) {
            const response = await apiClient.get('/api/readings', { params: filters });
            return response.data.content;
        }
        return mockGetReadings(filters);
    } catch (error) {
        console.error('Error fetching readings, using mock data', error);
        return mockGetReadings(filters);
    }
};

export const getSensorReadings = async (
  sensorId: number,
  page = 0,
  size = 20
): Promise<Reading[]> => {
    try {
        const isAvailable = await isBackendAvailable();
        if (isAvailable) {
            const response = await apiClient.get(`/api/readings/sensor/${sensorId}`, {
                params: { page, size }
            });
            return response.data.content;
        }
        return mockGetReadings({ sensorId, limit: size });
    } catch (error) {
        console.error('Error fetching sensor readings, using mock data', error);
        return mockGetReadings({ sensorId, limit: size });
    }
};

export const getNodeReadings = async (
  nodeId: number,
  page = 0,
  size = 20
): Promise<Reading[]> => {
    try {
        const isAvailable = await isBackendAvailable();
        if (isAvailable) {
            const response = await apiClient.get(`/api/readings/node/${nodeId}`, {
                params: { page, size }
            });
            return response.data.content;
        }
        return mockGetReadings({ nodeId, limit: size });
    } catch (error) {
        console.error('Error fetching node readings, using mock data', error);
        return mockGetReadings({ nodeId, limit: size });
    }
};

export const createReading = async (
  data: { sensorId: number; value: number }
): Promise<Reading> => {
    try {
        const isAvailable = await isBackendAvailable();
        if (isAvailable) {
            const response = await apiClient.post('/api/readings', data);
            return response.data;
        }
        // For mock, just return a new reading
        return {
            readingId: Math.max(...MOCK_READINGS.map(r => r.readingId)) + 1,
            sensorId: data.sensorId,
            value: data.value,
            timestamp: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Error creating reading, using mock response', error);
        throw error; // Even in mock mode, we should handle this properly
    }
};

export const getReadingStats = async (
  sensorId?: number,
  nodeId?: number,
  hours = 24
): Promise<ReadingStats> => {
    try {
        const isAvailable = await isBackendAvailable();
        if (isAvailable) {
            const response = await apiClient.get('/api/readings/stats', {
                params: { sensorId, nodeId, hours }
            });
            return response.data;
        }
        return mockGetReadingStats();
    } catch (error) {
        console.error('Error fetching reading stats, using mock data', error);
        return mockGetReadingStats();
    }
};