import apiClient from './apiClient';
import type { ThresholdResponse, ThresholdUpdateRequest, PaginatedResponse } from '@/types';

export const getThresholds = async (
  page = 0,
  size = 20
): Promise<PaginatedResponse<ThresholdResponse>> => {
    const response = await apiClient.get('/thresholds', {
        params: { page, size }
    });
    return response.data;
};

export const getThresholdForSensorType = async (
  sensorTypeId: number
): Promise<ThresholdResponse> => {
    const response = await apiClient.get(`/thresholds/sensor-type/${sensorTypeId}`);
    return response.data;
};

export const updateThreshold = async (
  thresholdId: number,
  data: ThresholdUpdateRequest
): Promise<ThresholdResponse> => {
    const response = await apiClient.put(`/thresholds/${thresholdId}`, data);
    return response.data;
};