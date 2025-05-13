// src/api/mockTopology.ts
import type { NetworkTopology } from '@/types';

export const mockTopologyData: NetworkTopology[] = [
  {
    linkId: 1,
    sourceNodeId: 1,
    targetNodeId: 2,
    sourceNodeName: 'Node 1',
    targetNodeName: 'Node 2',
    signalStrength: 75,
    lastUpdated: new Date().toISOString(),
  },
  {
    linkId: 2,
    sourceNodeId: 1,
    targetNodeId: 3,
    sourceNodeName: 'Node 1',
    targetNodeName: 'Node 3',
    signalStrength: 60,
    lastUpdated: new Date().toISOString(),
  },
  {
    linkId: 3,
    sourceNodeId: 2,
    targetNodeId: 4,
    sourceNodeName: 'Node 2',
    targetNodeName: 'Node 4',
    signalStrength: 45,
    lastUpdated: new Date().toISOString(),
  },
];

export const getMockTopology = async (): Promise<NetworkTopology[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTopologyData), 500);
  });
};