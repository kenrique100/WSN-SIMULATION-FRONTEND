import apiClient from './apiClient';
import type {
    SensorNode,
    NodeSensor,
    NodeStats,
    PaginatedResponse
} from '@/types';

// Properly typed API functions
export const getNodes = async (params: { page?: number; size?: number }): Promise<PaginatedResponse<SensorNode>> => {
    console.log('Fetching nodes with params:', params);
    const response = await apiClient.get('/api/nodes', { params });
    console.log('Fetched nodes:', response.data);
    return response.data;
};

export const getNodeStatusStats = async (): Promise<NodeStats> => {
    console.log('Fetching node status stats');
    const response = await apiClient.get('/api/nodes/stats');
    console.log('Fetched node status stats:', response.data);
    return response.data;
};

export const getNodeById = async (id: number): Promise<SensorNode> => {
    console.log(`Fetching node by ID: ${id}`);
    const response = await apiClient.get(`/api/nodes/${id}`);
    console.log('Fetched node:', response.data);
    return response.data;
};

export const getNodeSensors = async (
    nodeId: number,
    params: { page?: number; size?: number }
): Promise<PaginatedResponse<NodeSensor>> => {
    console.log(`Fetching sensors for node ${nodeId} with params:`, params);
    const response = await apiClient.get(`/api/nodes/${nodeId}/sensors`, { params });
    console.log(`Fetched sensors for node ${nodeId}:`, response.data);
    return response.data;
};

export const createNode = async (data: {
    name: string;
    location: string;
    latitude?: number;
    longitude?: number;
    status?: string;
}): Promise<SensorNode> => {
    console.log('Creating node with data:', data);
    const response = await apiClient.post('/api/nodes', data);
    console.log('Created node:', response.data);
    return response.data;
};

export const deleteNode = async (id: number): Promise<void> => {
    console.log(`Deleting node with ID: ${id}`);
    await apiClient.delete(`/api/nodes/${id}`);
    console.log(`Deleted node with ID: ${id}`);
};
