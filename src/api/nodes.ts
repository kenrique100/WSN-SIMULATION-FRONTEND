// src/api/nodes.ts
import apiClient from './apiClient';
import { getMockNodes, mockNodeStats } from './mockNodes';
import type {
    SensorNode,
    NodeSensor,
    NodeStats,
    PaginatedResponse
} from '@/types';

// Fetch paginated list of nodes
export const getNodes = async (
  params: { page?: number; size?: number } = {}
): Promise<PaginatedResponse<SensorNode>> => {
    try {
        console.log('Fetching nodes with params:', params);
        const response = await apiClient.get('/api/nodes', { params });
        console.log('Fetched nodes:', response.data);
        return response.data;
    } catch (error) {
        console.warn('Using mock nodes data due to error:', error);
        return getMockNodes(params);
    }
};

// Fetch node status statistics
export const getNodeStatusStats = async (): Promise<NodeStats> => {
    try {
        console.log('Fetching node status stats');
        const response = await apiClient.get('/api/nodes/stats');
        console.log('Fetched node status stats:', response.data);
        return response.data;
    } catch (error) {
        console.warn('Using mock node stats due to error:', error);
        return mockNodeStats;
    }
};

// Fetch a node by its ID
export const getNodeById = async (id: number): Promise<SensorNode> => {
    try {
        console.log(`Fetching node by ID: ${id}`);
        const response = await apiClient.get(`/api/nodes/${id}`);
        console.log('Fetched node:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch node ${id}:`, error);
        throw error;
    }
};

// Fetch sensors for a specific node
export const getNodeSensors = async (
  nodeId: number,
  params: { page?: number; size?: number }
): Promise<PaginatedResponse<NodeSensor>> => {
    try {
        console.log(`Fetching sensors for node ${nodeId} with params:`, params);
        const response = await apiClient.get(`/api/nodes/${nodeId}/sensors`, { params });
        console.log(`Fetched sensors for node ${nodeId}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch sensors for node ${nodeId}:`, error);
        throw error;
    }
};

// Create a new node
export const createNode = async (data: {
    name: string;
    location: string;
    latitude?: number;
    longitude?: number;
    status?: string;
}): Promise<SensorNode> => {
    try {
        console.log('Creating node with data:', data);
        const response = await apiClient.post('/api/nodes', data);
        console.log('Created node:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to create node:', error);
        throw error;
    }
};

// Delete a node by ID
export const deleteNode = async (id: number): Promise<void> => {
    try {
        console.log(`Deleting node with ID: ${id}`);
        await apiClient.delete(`/api/nodes/${id}`);
        console.log(`Deleted node with ID: ${id}`);
    } catch (error) {
        console.error(`Failed to delete node ${id}:`, error);
        throw error;
    }
};
