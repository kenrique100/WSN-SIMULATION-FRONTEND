import axios from 'axios';
import { Reading, ReadingFilter } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchReadings = async (filters: ReadingFilter): Promise<Reading[]> => {
    const response = await axios.get(`${API_URL}/readings`, { params: filters });
    return response.data;
};

export const fetchLatestReadings = async (nodeId?: string): Promise<Reading[]> => {
    const response = await axios.get(`${API_URL}/readings/latest`, {
        params: { nodeId }
    });
    return response.data;
};

export const fetchReadingStats = async (): Promise<any> => {
    const response = await axios.get(`${API_URL}/readings/stats`);
    return response.data;
};