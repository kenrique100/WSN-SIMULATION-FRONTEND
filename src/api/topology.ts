import apiClient from './index';
import type { NetworkTopology } from '../types';

export const getNetworkTopology = async (): Promise<NetworkTopology[]> => {
    const response = await apiClient.get('/topology');
    return response.data;
};

export const createNetworkLink = async (
    data: Omit<NetworkTopology, 'linkId' | 'lastUpdated'>
): Promise<NetworkTopology> => {
    const response = await apiClient.post('/topology', data);
    return response.data;
};