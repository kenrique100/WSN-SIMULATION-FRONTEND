// src/components/nodes/NodeList.tsx
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Tooltip, TextField,
    Button, Dialog, DialogTitle, DialogContent, Alert
} from '@mui/material';
import { Add, Edit, Delete, Refresh } from '@mui/icons-material';
import { createNode, deleteNode } from '@/api/nodes';
import NodeForm from './NodeForm';
import type { SensorNode } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { NODE_STATUSES } from '@/types';
import { getStatusColor } from '@/types/helpers';

interface NodeListProps {
    nodes: SensorNode[];
}

export default function NodeList({ nodes }: NodeListProps) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [editNode, setEditNode] = useState<SensorNode | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleCreate = async (data: {
        name: string;
        location: string;
        latitude?: number;
        longitude?: number;
        status?: string;
    }) => {
        try {
            await createNode(data);
            await queryClient.invalidateQueries({ queryKey: ['nodes'] });
            setOpen(false);
        } catch (error) {
            console.error('Error creating node:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteNode(id);
            await queryClient.invalidateQueries({ queryKey: ['nodes'] });
        } catch (error) {
            console.error('Error deleting node:', error);
        }
    };

    const filteredNodes = nodes.filter(node =>
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5">Sensor Nodes</Typography>
              <Box>
                  <TextField
                    size="small"
                    placeholder="Search nodes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mr: 2 }}
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
                        sx={{ ml: 1 }}
                      >
                          <Refresh />
                      </IconButton>
                  </Tooltip>
              </Box>
          </Box>

          {filteredNodes.length === 0 ? (
            <Alert severity="info">No nodes found</Alert>
          ) : (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Last Heartbeat</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredNodes.map((node) => (
                          <TableRow key={node.nodeId}>
                              <TableCell>{node.nodeId}</TableCell>
                              <TableCell>{node.name}</TableCell>
                              <TableCell>{node.location}</TableCell>
                              <TableCell>
                                  <Box
                                    sx={{
                                        display: 'inline-block',
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        bgcolor: getStatusColor(node.status),
                                        mr: 1
                                    }}
                                  />
                                  {NODE_STATUSES.find(s => s.value === node.status)?.label || node.status}
                              </TableCell>
                              <TableCell>
                                  {node.lastHeartbeat
                                    ? new Date(node.lastHeartbeat).toLocaleString()
                                    : 'Never'}
                              </TableCell>
                              <TableCell>
                                  <Tooltip title="Edit">
                                      <IconButton onClick={() => {
                                          setEditNode(node);
                                          setOpen(true);
                                      }}>
                                          <Edit fontSize="small" />
                                      </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                      <IconButton onClick={() => handleDelete(node.nodeId)}>
                                          <Delete fontSize="small" color="error" />
                                      </IconButton>
                                  </Tooltip>
                              </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
          )}

          <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
              <DialogTitle>{editNode ? 'Edit Node' : 'Create New Node'}</DialogTitle>
              <DialogContent>
                  <NodeForm
                    onSubmit={handleCreate}
                    node={editNode}
                    onCancel={() => setOpen(false)}
                  />
              </DialogContent>
          </Dialog>
      </Box>
    );
}