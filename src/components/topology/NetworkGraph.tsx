// src/components/topology/NetworkGraph.tsx
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Paper
} from '@mui/material';
import { getNetworkTopology } from '@/api/topology';
import ForceGraph2D from 'react-force-graph-2d';
import type { NetworkTopology } from '@/types';
import RefreshIcon from '@mui/icons-material/Refresh';

interface GraphNode {
  id: number;
  name: string;
  val?: number;
}

interface GraphLink {
  source: number;
  target: number;
  signalStrength: number;
  color?: string;
}

export default function NetworkGraph() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching
  } = useQuery<NetworkTopology[], Error>({
    queryKey: ['networkTopology'],
    queryFn: getNetworkTopology,
    refetchInterval: 30000,
    retry: 1,
  });

  const renderFallbackUI = () => (
    <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Network Visualization Unavailable
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {error?.message || 'Unable to load network topology data'}
      </Typography>
      <Box sx={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Displaying simplified network representation
          </Typography>
          <Box
            component="img"
            src="/network-fallback.svg" // Create this simple SVG illustration
            alt="Network diagram"
            sx={{ width: '100%', maxWidth: '400px', opacity: 0.7 }}
          />
        </Box>
      </Box>
      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={() => refetch()}
        disabled={isRefetching}
        sx={{ mt: 2 }}
      >
        Retry Connection
      </Button>
    </Paper>
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError && !data) {
    return renderFallbackUI();
  }

  // Prepare graph data
  const links: GraphLink[] = (data || []).map((link) => ({
    source: link.sourceNodeId,
    target: link.targetNodeId,
    signalStrength: link.signalStrength,
    color: getLinkColor(link.signalStrength),
  }));

  const nodeMap = new Map<number, GraphNode>();
  links.forEach((link) => {
    nodeMap.set(link.source, {
      id: link.source,
      name: `Node ${link.source}`,
      val: 5
    });
    nodeMap.set(link.target, {
      id: link.target,
      name: `Node ${link.target}`,
      val: 5
    });
  });

  const nodes = Array.from(nodeMap.values());

  return (
    <Box sx={{ position: 'relative' }}>
      {isError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Couldn't connect to real-time data. Showing cached information.
        </Alert>
      )}

      <Box sx={{
        height: '600px',
        border: '1px solid #eee',
        borderRadius: 1,
        position: 'relative'
      }}>
        {data && data.length > 0 ? (
          <ForceGraph2D
            graphData={{ nodes, links }}
            nodeLabel="name"
            nodeAutoColorBy="id"
            linkWidth={link => (link as GraphLink).signalStrength / 20}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            linkColor={link => (link as GraphLink).color || '#999'}
          />
        ) : (
          renderFallbackUI()
        )}
      </Box>
    </Box>
  );
}

function getLinkColor(signalStrength: number): string {
  if (signalStrength > 80) return '#4caf50';
  if (signalStrength > 50) return '#ff9800';
  return '#f44336';
}