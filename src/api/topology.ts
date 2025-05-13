import apiClient from './apiClient';
import { getMockTopology } from './mockTopology';
import type { NetworkTopology } from '@/types';

export const getNetworkTopology = async (): Promise<NetworkTopology[]> => {
    try {
        const response = await apiClient.get('/topology');
        return response.data;
    } catch (error) {
        console.warn('Using mock topology data due to error:', error);
        return getMockTopology();
    }
};

export const createNetworkLink = async (
  data: Omit<NetworkTopology, 'linkId' | 'lastUpdated'>
): Promise<NetworkTopology> => {
    const response = await apiClient.post('/topology', data);
    return response.data;
};