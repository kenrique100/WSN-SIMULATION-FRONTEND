import apiClient from './apiClient';
import type { Node, NodeFormData, Sensor, SensorNode } from '@/types';

export const getNodes = async (): Promise<SensorNode[]> => {
    const response = await apiClient.get('/nodes');
    const nodes: Node[] = response.data;

    return nodes.map((node): SensorNode => ({
        nodeId: parseInt(node.id), // Convert string to number
        name: node.name,
        location: node.location,
        status: node.status,
        lastHeartbeat: node.lastPing, // Mapping field from Node -> SensorNode
        latitude: undefined,          // If not returned by backend
        longitude: undefined
    }));
};

export const getNodeStatusStats = async (): Promise<{
    online: number;
    offline: number;
    warning: number;
}> => {
    const response = await apiClient.get('/nodes/stats');
    return response.data;
};

export const fetchNodeDetails = async (id: string): Promise<Node> => {
    const response = await apiClient.get(`/nodes/${id}`);
    return response.data;
};

export const createNode = async (data: NodeFormData): Promise<Node> => {
    const response = await apiClient.post('/nodes', data);
    return response.data;
};

export const updateNode = async (id: string, data: NodeFormData): Promise<Node> => {
    const response = await apiClient.put(`/nodes/${id}`, data);
    return response.data;
};

export const deleteNode = async (id: string): Promise<void> => {
    await apiClient.delete(`/nodes/${id}`);
};

export const fetchNodeSensors = async (nodeId: string): Promise<Sensor[]> => {
    const response = await apiClient.get(`/nodes/${nodeId}/sensors`);
    return response.data;
};