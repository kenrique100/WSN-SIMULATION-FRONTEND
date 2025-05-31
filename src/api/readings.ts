import apiClient from './apiClient';
import type { Reading, ReadingFilter, ReadingStats, PaginatedResponse } from '@/types';

export const getReadings = async (filters: ReadingFilter = {}): Promise<PaginatedResponse<Reading>> => {
    try {
        const response = await apiClient.get('/readings', {
            params: {
                page: filters.page || 0,
                size: filters.size || 100,
                sensorId: filters.sensorId,
                nodeId: filters.nodeId,
                sort: filters.sort || 'timestamp,desc',
                _: Date.now()
            },
        });
        return {
            content: response.data.content?.map(convertReading) || [],
            totalElements: response.data.totalElements || 0,
            totalPages: response.data.totalPages || 0,
            page: response.data.page || 0,
            size: response.data.size || 0,
            last: response.data.last || true
        };
    } catch (error) {
        console.error('Error fetching readings:', error);
        return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            page: 0,
            size: 0,
            last: true
        };
    }
};

export const getAllSensorReadings = async (
  sensorId: number,
  sort: string = 'timestamp,asc'
): Promise<Reading[]> => {
    try {
        // First get total count
        const countResponse = await apiClient.get(`/readings/sensor/${sensorId}`, {
            params: {
                page: 0,
                size: 1,
                sort
            },
        });

        const totalElements = countResponse.data?.totalElements || 0;
        if (totalElements === 0) return [];

        // Then get all readings in one request
        const response = await apiClient.get(`/readings/sensor/${sensorId}`, {
            params: {
                page: 0,
                size: totalElements,
                sort
            },
        });

        return response.data?.content?.map(convertReading) || [];
    } catch (error) {
        console.error('Error fetching sensor readings:', error);
        return [];
    }
};

export const getAllNodeReadings = async (
  nodeId: number,
  sort: string = 'timestamp,asc'
): Promise<Reading[]> => {
    try {
        // First get total count
        const countResponse = await apiClient.get(`/readings/node/${nodeId}`, {
            params: {
                page: 0,
                size: 1,
                sort
            },
        });

        const totalElements = countResponse.data?.totalElements || 0;
        if (totalElements === 0) return [];

        // Then get all readings in one request
        const response = await apiClient.get(`/readings/node/${nodeId}`, {
            params: {
                page: 0,
                size: totalElements,
                sort
            },
        });

        return response.data?.content?.map(convertReading) || [];
    } catch (error) {
        console.error('Error fetching node readings:', error);
        return [];
    }
};

export const createReading = async (
  sensorId: number,
  value: number
): Promise<Reading> => {
    const response = await apiClient.post('/readings', {
        sensorId,
        value
    });
    return convertReading(response.data);
};

export const getReadingStats = async (
  sensorId?: number,
  nodeId?: number,
  hours?: number
): Promise<ReadingStats> => {
    const response = await apiClient.get('/readings/stats', {
        params: {
            sensorId,
            nodeId,
            hours,
            _: Date.now()
        },
    });
    return {
        average: response.data.average,
        min: response.data.min,
        max: response.data.max,
        count: response.data.count,
        firstReading: response.data.firstReading,
        lastReading: response.data.lastReading,
        trend: response.data.trend
    };
};

const convertReading = (reading: any): Reading => {
    return {
        readingId: reading.readingId || reading.id,
        sensorId: reading.sensor?.sensorId || reading.sensorId,
        nodeId: reading.sensor?.node?.nodeId || reading.nodeId,
        value: reading.value,
        timestamp: reading.timestamp,
        sensorType: reading.sensor?.type ? {
            name: reading.sensor.type.name,
            unit: reading.sensor.type.unit
        } : undefined
    };
};