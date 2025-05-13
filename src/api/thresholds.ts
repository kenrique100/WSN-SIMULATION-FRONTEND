// src/services/thresholdsService.ts
import apiClient from './apiClient';
import type { AlertThreshold, AlertThresholdUpdate } from '@/types';
import MOCK_THRESHOLDS from '@/api/mockThresholds';

const isBackendAvailable = async () => {
    try {
        await apiClient.get('/health');
        return true;
    } catch (error) {
        console.warn('Backend not available, using mock data');
        return false;
    }
};

const mockGetThresholds = async (): Promise<AlertThreshold[]> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(MOCK_THRESHOLDS), 500);
    });
};

const mockGetThresholdForSensorType = async (sensorTypeId: number): Promise<AlertThreshold> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const threshold =
              MOCK_THRESHOLDS.find(t => t.id === sensorTypeId) || {
                  id: sensorTypeId,
                  sensorType: 'Unknown',
                  minValue: 0,
                  maxValue: 100,
                  notificationEnabled: false,
              };
            resolve(threshold);
        }, 500);
    });
};

const mockUpdateThreshold = async (
  thresholdId: number,
  data: AlertThresholdUpdate
): Promise<AlertThreshold> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const existing = MOCK_THRESHOLDS.find(t => t.id === thresholdId);
            const updatedThreshold: AlertThreshold = {
                id: thresholdId,
                sensorType: existing?.sensorType || 'Unknown',
                minValue: data.minValue ?? existing?.minValue ?? 0,
                maxValue: data.maxValue ?? existing?.maxValue ?? 100,
                notificationEnabled: data.notificationEnabled ?? existing?.notificationEnabled ?? false,
            };
            resolve(updatedThreshold);
        }, 500);
    });
};

// --- API with fallback ---
export const getThresholds = async (): Promise<AlertThreshold[]> => {
    try {
        const isAvailable = await isBackendAvailable();
        if (isAvailable) {
            const response = await apiClient.get('/api/thresholds');
            return response.data.content;
        }
        return mockGetThresholds();
    } catch (error) {
        console.error('Error fetching thresholds, using mock data', error);
        return mockGetThresholds();
    }
};

export const getThresholdForSensorType = async (
  sensorTypeId: number
): Promise<AlertThreshold> => {
    try {
        const isAvailable = await isBackendAvailable();
        if (isAvailable) {
            const response = await apiClient.get(`/api/thresholds/sensor-type/${sensorTypeId}`);
            return response.data;
        }
        return mockGetThresholdForSensorType(sensorTypeId);
    } catch (error) {
        console.error('Error fetching threshold for sensor type, using mock data', error);
        return mockGetThresholdForSensorType(sensorTypeId);
    }
};

export const updateThreshold = async (
  thresholdId: number,
  data: AlertThresholdUpdate
): Promise<AlertThreshold> => {
    try {
        const isAvailable = await isBackendAvailable();
        if (isAvailable) {
            const response = await apiClient.put(`/api/thresholds/${thresholdId}`, data);
            return response.data;
        }
        return mockUpdateThreshold(thresholdId, data);
    } catch (error) {
        console.error('Error updating threshold, using mock data', error);
        return mockUpdateThreshold(thresholdId, data);
    }
};
