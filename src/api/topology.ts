import apiClient from './apiClient';
import type { CreateTopologyRequest, NetworkTopology } from '@/types';

export const getNetworkTopology = async (): Promise<NetworkTopology[]> => {
    const response = await apiClient.get('/topology');
    return response.data;
};

export const createNetworkLink = async (
  request: CreateTopologyRequest
): Promise<NetworkTopology> => {
    const response = await apiClient.post('/topology', request);
    return response.data;
};