import apiClient from './apiClient';
import type { SensorNode, NodeSensor, NodeStats, PaginatedResponse } from '@/types';

export const getNodes = async (
  params: { page?: number; size?: number } = {}
): Promise<PaginatedResponse<SensorNode>> => {
  const response = await apiClient.get('/nodes', { params });
  return response.data;
};

export const getNodeStatusStats = async (): Promise<NodeStats> => {
  const response = await apiClient.get('/nodes/stats');
  return response.data;
};

export const getNodeById = async (id: number): Promise<SensorNode> => {
  const response = await apiClient.get(`/nodes/${id}`);
  return response.data;
};

export const getNodeSensors = async (
  nodeId: number,
  params: { page?: number; size?: number } = {}
): Promise<PaginatedResponse<NodeSensor>> => {
  const response = await apiClient.get(`/nodes/${nodeId}/sensors`, { params });
  return response.data;
};

export const createNode = async (data: {
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status?: 'active' | 'inactive' | 'maintenance';
}): Promise<SensorNode> => {
  const response = await apiClient.post('/nodes', data);
  return response.data;
};

export const updateNode = async (
  id: number,
  data: {
    name: string;
    location: string;
    latitude?: number;
    longitude?: number;
    status: 'active' | 'inactive' | 'maintenance';
  }
): Promise<SensorNode> => {
  const response = await apiClient.put(`/nodes/${id}`, data);
  return response.data;
};

export const deleteNode = async (id: number): Promise<void> => {
  await apiClient.delete(`/nodes/${id}`);
};