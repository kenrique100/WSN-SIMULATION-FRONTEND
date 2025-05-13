// src/api/mockNodes.ts
import type { SensorNode, PaginatedResponse, NodeStats } from '@/types';

export const mockNodes: SensorNode[] = [
  {
    nodeId: 1,
    name: 'Demo Node 1',
    location: 'Building A',
    latitude: 40.7128,
    longitude: -74.0060,
    status: 'active',
    lastHeartbeat: new Date().toISOString()
  },
  {
    nodeId: 2,
    name: 'Demo Node 2',
    location: 'Building B',
    latitude: 34.0522,
    longitude: -118.2437,
    status: 'inactive',
    lastHeartbeat: new Date(Date.now() - 86400000).toISOString()
  },
  // Nodes around Cameroon
  {
    nodeId: 3,
    name: 'Yaoundé Node',
    location: 'Yaoundé, Cameroon',
    latitude: 3.8480,
    longitude: 11.5021,
    status: 'active',
    lastHeartbeat: new Date().toISOString()
  },
  {
    nodeId: 4,
    name: 'Douala Node',
    location: 'Douala, Cameroon',
    latitude: 4.0511,
    longitude: 9.7679,
    status: 'active',
    lastHeartbeat: new Date().toISOString()
  },
  {
    nodeId: 5,
    name: 'Garoua Node',
    location: 'Garoua, Cameroon',
    latitude: 9.2918,
    longitude: 13.3933,
    status: 'maintenance',
    lastHeartbeat: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
  },
  {
    nodeId: 6,
    name: 'Bamenda Node',
    location: 'Bamenda, Cameroon',
    latitude: 5.9631,
    longitude: 10.1591,
    status: 'inactive',
    lastHeartbeat: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  },
];

export const mockNodeStats: NodeStats = {
  total: mockNodes.length,
  active: mockNodes.filter(n => n.status === 'active').length,
  inactive: mockNodes.filter(n => n.status === 'inactive').length,
  maintenance: mockNodes.filter(n => n.status === 'maintenance').length
};

export const getMockNodes = async (
  params: { page?: number; size?: number } = {}
): Promise<PaginatedResponse<SensorNode>> => {
  const { page = 0, size = 10 } = params;
  const start = page * size;
  const end = start + size;
  const content = mockNodes.slice(start, end);

  return {
    content,
    totalElements: mockNodes.length,
    totalPages: Math.ceil(mockNodes.length / size),
    page,
    size
  };
};
