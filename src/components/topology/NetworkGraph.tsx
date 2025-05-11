import { useQuery } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
import { getNetworkTopology } from '@/api/topology';
import ForceGraph2D from 'react-force-graph-2d';
import type { NetworkTopology } from '@/types';

interface GraphNode {
  id: number;
  name: string;
}

interface GraphLink {
  source: number;
  target: number;
  signalStrength: number;
}

export default function NetworkGraph() {
  const {
    data: topology,
    isLoading,
    error,
  } = useQuery<NetworkTopology[], Error>({
    queryKey: ['networkTopology'],
    queryFn: getNetworkTopology,
  });

  if (isLoading) return <Typography>Loading network topology...</Typography>;
  if (error) return <Typography color="error">Error loading network topology</Typography>;

  const links: GraphLink[] = topology?.map((link) => ({
    source: link.sourceNodeId,
    target: link.targetNodeId,
    signalStrength: link.signalStrength,
  })) ?? [];

  const nodeMap = new Map<number, GraphNode>();
  links.forEach((link) => {
    nodeMap.set(link.source, { id: link.source, name: `Node ${link.source}` });
    nodeMap.set(link.target, { id: link.target, name: `Node ${link.target}` });
  });
  const nodes = Array.from(nodeMap.values());

  return (
    <Box sx={{ height: '600px' }}>
      <Typography variant="h5" gutterBottom>
        Network Topology
      </Typography>
      <ForceGraph2D
        graphData={{ nodes, links }}
        nodeLabel="name"
        linkWidth={(link: GraphLink) => link.signalStrength / 50}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkColor={() => 'rgba(0,0,0,0.2)'}
        nodeColor={() => '#3f51b5'}
      />
    </Box>
  );
}
