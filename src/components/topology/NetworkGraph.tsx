import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack
} from '@mui/material';
import { getNetworkTopology, createNetworkLink } from '@/api/topology';
import type { CreateTopologyRequest, NetworkTopology } from '@/types';
import ForceGraph2D from 'react-force-graph-2d';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import React, { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';

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
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const [openDialog, setOpenDialog] = useState(false);
  const [newLink, setNewLink] = useState<CreateTopologyRequest>({
    sourceNodeId: 0,
    targetNodeId: 0,
    signalStrength: 0
  });

  const {
    data: topology,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching
  } = useQuery<NetworkTopology[], Error>({
    queryKey: ['networkTopology'],
    queryFn: getNetworkTopology,
    refetchInterval: 30000
  });

  const mutation = useMutation<NetworkTopology, Error, CreateTopologyRequest>({
    mutationFn: createNetworkLink,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['networkTopology'] });
      showNotification('Network link created successfully', 'success');
      setOpenDialog(false);
    },
    onError: (error: Error) => {
      showNotification(`Failed to create link: ${error.message}`, 'error');
    }
  });

  const handleCreateLink = () => {
    mutation.mutate(newLink);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLink(prev => ({
      ...prev,
      [name]: name === 'signalStrength' ? parseFloat(value) : parseInt(value)
    }));
  };

  // Prepare graph data
  const links: GraphLink[] = (topology || []).map(link => ({
    source: link.sourceNodeId,
    target: link.targetNodeId,
    signalStrength: link.signalStrength,
    color: getLinkColor(link.signalStrength),
  }));

  const nodeMap = new Map<number, GraphNode>();
  links.forEach(link => {
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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.message || 'Failed to load network topology'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          Retry
        </Button>
      </Paper>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Network Link
        </Button>
      </Box>

      <Box sx={{
        height: '600px',
        border: '1px solid #eee',
        borderRadius: 1,
        position: 'relative'
      }}>
        {topology && topology.length > 0 ? (
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
          <Paper elevation={3} sx={{
            p: 3,
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Typography variant="h6" gutterBottom>
              No Network Topology Data
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              The network appears to be empty. Add your first link to get started.
            </Typography>
          </Paper>
        )}
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Network Link</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              name="sourceNodeId"
              label="Source Node ID"
              type="number"
              fullWidth
              value={newLink.sourceNodeId}
              onChange={handleInputChange}
              inputProps={{ min: 0 }}
            />
            <TextField
              name="targetNodeId"
              label="Target Node ID"
              type="number"
              fullWidth
              value={newLink.targetNodeId}
              onChange={handleInputChange}
              inputProps={{ min: 0 }}
            />
            <TextField
              name="signalStrength"
              label="Signal Strength"
              type="number"
              fullWidth
              value={newLink.signalStrength}
              onChange={handleInputChange}
              inputProps={{ step: "0.1", min: 0, max: 100 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateLink}
            disabled={mutation.isPending}
            variant="contained"
          >
            {mutation.isPending ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function getLinkColor(signalStrength: number): string {
  if (signalStrength > 80) return '#4caf50';
  if (signalStrength > 50) return '#ff9800';
  return '#f44336';
}
