import { useQuery } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
import { getNetworkTopology } from '../../api/topology';
import ForceGraph2D from 'react-force-graph-2d';

export default function NetworkGraph() {
    const { data: topology, isLoading, error } = useQuery(
        ['networkTopology'],
        getNetworkTopology
    );

    if (isLoading) return <Typography>Loading network topology...</Typography>;
    if (error) return <Typography color="error">Error loading network topology</Typography>;

    // Transform data for force graph
    const nodes = Array.from(new Set(
        topology?.flatMap(link => [
            { id: link.sourceNodeId, name: `Node ${link.sourceNodeId}` },
            { id: link.targetNodeId, name: `Node ${link.targetNodeId}` }
        ]) || []
    )).filter((node, index, self) =>
        index === self.findIndex(n => n.id === node.id)
    );

    const links = topology?.map(link => ({
        source: link.sourceNodeId,
        target: link.targetNodeId,
        signalStrength: link.signalStrength
    })) || [];

    return (
        <Box sx={{ height: '600px' }}>
            <Typography variant="h5" gutterBottom>
                Network Topology
            </Typography>
            <ForceGraph2D
                graphData={{ nodes, links }}
                nodeLabel="name"
                linkWidth={link => link.signalStrength / 50}
                linkDirectionalArrowLength={3.5}
                linkDirectionalArrowRelPos={1}
                linkColor={() => 'rgba(0,0,0,0.2)'}
                nodeColor={() => '#3f51b5'}
            />
        </Box>
    );
}