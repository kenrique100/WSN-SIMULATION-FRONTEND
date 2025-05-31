import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Stack,
    Chip,
    Link
} from '@mui/material';
import { Add, Edit, Delete, Refresh } from '@mui/icons-material';
import { createNode, updateNode, deleteNode } from '@/api/nodes';
import NodeForm from './NodeForm';
import type { SensorNode, NodeStatus } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { NODE_STATUSES } from '@/types';
import { getStatusColor } from '@/types/helpers';
import { Link as RouterLink } from 'react-router-dom';

interface NodeListProps {
    nodes: SensorNode[];
}

export default function NodeList({ nodes = [] }: NodeListProps) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [editNode, setEditNode] = useState<SensorNode | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | NodeStatus>('all');

    const handleCreate = async (data: {
        name: string;
        location: string;
        latitude?: number;
        longitude?: number;
        status: NodeStatus;
    }) => {
        try {
            await createNode(data);
            await queryClient.invalidateQueries({ queryKey: ['nodes'] });
            setOpen(false);
        } catch (error) {
            console.error('Error creating node:', error);
            throw error;
        }
    };

    const handleUpdate = async (data: {
        name: string;
        location: string;
        latitude?: number;
        longitude?: number;
        status: NodeStatus;
    }) => {
        if (!editNode) return;
        try {
            await updateNode(editNode.nodeId, data);
            await queryClient.invalidateQueries({ queryKey: ['nodes'] });
            setOpen(false);
        } catch (error) {
            console.error('Error updating node:', error);
            throw error;
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteNode(id);
            await queryClient.invalidateQueries({ queryKey: ['nodes'] });
        } catch (error) {
            console.error('Error deleting node:', error);
            throw error;
        }
    };

    const filteredNodes = nodes.filter(node => {
        const matchesSearch =
          node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === 'all' ||
          node.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
      <Box sx={{ p: 3 }}>
          <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
          }}>
              <Typography variant="h5">Sensor Nodes</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Search nodes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: 250 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                        setEditNode(null);
                        setOpen(true);
                    }}
                  >
                      Add Node
                  </Button>
                  <Tooltip title="Refresh">
                      <IconButton
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['nodes'] })}
                      >
                          <Refresh />
                      </IconButton>
                  </Tooltip>
              </Box>
          </Box>

          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              <Chip
                label="All"
                clickable
                variant={statusFilter === 'all' ? 'filled' : 'outlined'}
                color="primary"
                onClick={() => setStatusFilter('all')}
              />
              {NODE_STATUSES.map((status) => (
                <Chip
                  key={status.value}
                  label={status.label}
                  clickable
                  variant={statusFilter === status.value ? 'filled' : 'outlined'}
                  color="primary"
                  onClick={() => setStatusFilter(status.value)}
                />
              ))}
          </Stack>

          <TableContainer component={Paper} elevation={2}>
              <Table>
                  <TableHead sx={{ backgroundColor: 'action.hover' }}>
                      <TableRow>
                          <TableCell><strong>Name</strong></TableCell>
                          <TableCell><strong>Location</strong></TableCell>
                          <TableCell><strong>Status</strong></TableCell>
                          <TableCell><strong>Last Heartbeat</strong></TableCell>
                          <TableCell align="center"><strong>Actions</strong></TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {filteredNodes.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                No nodes found
                            </TableCell>
                        </TableRow>
                      ) : (
                        filteredNodes.map((node) => (
                          <TableRow key={node.nodeId} hover>
                              <TableCell>
                                  <Link
                                    component={RouterLink}
                                    to={`/nodes/${node.nodeId}`}
                                    sx={{ textDecoration: 'none', color: 'inherit' }}
                                  >
                                      {node.name}
                                  </Link>
                              </TableCell>
                              <TableCell>{node.location}</TableCell>
                              <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Box
                                        sx={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            bgcolor: getStatusColor(node.status),
                                            mr: 1.5
                                        }}
                                      />
                                      {NODE_STATUSES.find(s => s.value === node.status)?.label || node.status}
                                  </Box>
                              </TableCell>
                              <TableCell>
                                  {node.lastHeartbeat ? new Date(node.lastHeartbeat).toLocaleString() : 'Never'}
                              </TableCell>
                              <TableCell align="center">
                                  <Tooltip title="Edit">
                                      <IconButton
                                        onClick={() => {
                                            setEditNode(node);
                                            setOpen(true);
                                        }}
                                        size="small"
                                        sx={{ mr: 1 }}
                                      >
                                          <Edit fontSize="small" />
                                      </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                      <IconButton
                                        onClick={async () => {
                                            if (confirm('Are you sure you want to delete this node?')) {
                                                await handleDelete(node.nodeId);
                                            }
                                        }}
                                        size="small"
                                      >
                                          <Delete fontSize="small" color="error" />
                                      </IconButton>
                                  </Tooltip>
                              </TableCell>
                          </TableRow>
                        ))
                      )}
                  </TableBody>
              </Table>
          </TableContainer>

          <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
              <DialogTitle>{editNode ? 'Edit Node' : 'Create New Node'}</DialogTitle>
              <DialogContent>
                  <NodeForm
                    onSubmit={editNode ? handleUpdate : handleCreate}
                    node={editNode}
                    onCancel={() => setOpen(false)}
                  />
              </DialogContent>
          </Dialog>
      </Box>
    );
}