import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Tooltip, TextField,
    Button, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Add, Edit, Delete, Refresh } from '@mui/icons-material';
import { getNodes, createNode, deleteNode } from '../../api/nodes';
import NodeForm from './NodeForm';
import type { SensorNode, NodeCreateRequest } from '../../types';

export default function NodeList() {
    const { data: nodes, isLoading, error, refetch } = useQuery(['nodes'], getNodes);
    const [open, setOpen] = useState(false);
    const [editNode, setEditNode] = useState<SensorNode | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleCreate = async (data: NodeCreateRequest) => {
        await createNode(data);
        refetch();
        setOpen(false);
    };

    const handleDelete = async (id: number) => {
        await deleteNode(id);
        refetch();
    };

    const filteredNodes = nodes?.filter(node =>
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (isLoading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">Error loading nodes</Typography>;

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
                        <IconButton onClick={() => refetch()} sx={{ ml: 1 }}>
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

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
                                <TableCell>{node.status}</TableCell>
                                <TableCell>
                                    {node.lastHeartbeat ? new Date(node.lastHeartbeat).toLocaleString() : 'Never'}
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