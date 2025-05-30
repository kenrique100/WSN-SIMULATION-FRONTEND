import apiClient from './apiClient';
import type {
    ThresholdResponse,
    ThresholdCreateRequest,
    ThresholdUpdateRequest,
    PaginatedResponse
} from '@/types';

export const createThreshold = async (
  data: ThresholdCreateRequest
): Promise<ThresholdResponse> => {
    try {
        const response = await apiClient.post('/thresholds', data, {
            timeout: 10000
        });
        return response.data;
    } catch (error) {
        console.error('Error creating threshold:', error);
        throw error;
    }
};

export const getThresholds = async (
  page = 0,
  size = 20
): Promise<PaginatedResponse<ThresholdResponse>> => {
    try {
        const response = await apiClient.get('/thresholds', {
            params: { page, size },
            timeout: 10000
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching thresholds:', error);
        throw error;
    }
};

export const getThresholdForSensorType = async (
  sensorTypeId: number
): Promise<ThresholdResponse> => {
    try {
        const response = await apiClient.get(`/thresholds/sensor-type/${sensorTypeId}`, {
            timeout: 10000
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching threshold for sensor type:', error);
        throw error;
    }
};

export const updateThreshold = async (
  thresholdId: number,
  data: ThresholdUpdateRequest
): Promise<ThresholdResponse> => {
    try {
        const response = await apiClient.put(`/thresholds/${thresholdId}`, data, {
            timeout: 10000
        });
        return response.data;
    } catch (error) {
        console.error('Error updating threshold:', error);
        throw error;
    }
};