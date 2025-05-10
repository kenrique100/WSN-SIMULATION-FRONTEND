import axios from 'axios';
import { Node, NodeFormData, Sensor } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchNodes = async (): Promise<Node[]> => {
    const response = await axios.get(`${API_URL}/nodes`);
    return response.data;
};

export const fetchNodeDetails = async (id: string): Promise<Node> => {
    const response = await axios.get(`${API_URL}/nodes/${id}`);
    return response.data;
};

export const createNode = async (data: NodeFormData): Promise<Node> => {
    const response = await axios.post(`${API_URL}/nodes`, data);
    return response.data;
};

export const updateNode = async (id: string, data: NodeFormData): Promise<Node> => {
    const response = await axios.put(`${API_URL}/nodes/${id}`, data);
    return response.data;
};

export const deleteNode = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/nodes/${id}`);
};

export const fetchNodeSensors = async (nodeId: string): Promise<Sensor[]> => {
    const response = await axios.get(`${API_URL}/nodes/${nodeId}/sensors`);
    return response.data;
};