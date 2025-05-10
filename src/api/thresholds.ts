import apiClient from './index';
import type { AlertThreshold, AlertThresholdUpdate } from '../types';

export const getThresholds = async (): Promise<AlertThreshold[]> => {
    const response = await apiClient.get('/thresholds');
    return response.data;
};

export const getThresholdForSensorType = async (sensorTypeId: number): Promise<AlertThreshold> => {
    const response = await apiClient.get(`/thresholds/sensor-type/${sensorTypeId}`);
    return response.data;
};

export const updateThreshold = async (
    thresholdId: number,
    data: AlertThresholdUpdate
): Promise<AlertThreshold> => {
    const response = await apiClient.put(`/thresholds/${thresholdId}`, data);
    return response.data;
};