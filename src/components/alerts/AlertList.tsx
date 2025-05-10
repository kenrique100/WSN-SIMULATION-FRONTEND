import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Tooltip, TextField,
    Chip, Button, Badge
} from '@mui/material';
import { Refresh, Warning, Dangerous } from '@mui/icons-material';
import { getAlerts, acknowledgeAlert } from '../../api/alerts';
import { useAuth } from '../../contexts/AuthContext';

export default function AlertList() {
    const { user } = useAuth();
    const { data: alerts, isLoading, error, refetch } = useQuery(['alerts'], getAlerts);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAcknowledged, setShowAcknowledged] = useState(false);

    const handleAcknowledge = async (alertId: number) => {
        if (user?.userId) {
            await acknowledgeAlert(alertId, user.userId);
            refetch();
        }
    };

    const filteredAlerts = alerts?.filter(alert =>
        (alert.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (alert.alertLevel.toLowerCase().includes(searchTerm.toLowerCase()))
                .filter(alert => showAcknowledged || !alert.acknowledged)
        ) || []);

    if (isLoading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">Error loading alerts</Typography>;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">Alerts</Typography>
                <Box>
                    <TextField
                        size="small"
                        placeholder="Search alerts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ mr: 2 }}
                    />
                    <Button
                        variant="outlined"
                        onClick={() => setShowAcknowledged(!showAcknowledged)}
                        sx={{ mr: 2 }}
                    >
                        {showAcknowledged ? 'Hide Acknowledged' : 'Show All'}
                    </Button>
                    <Tooltip title="Refresh">
                        <IconButton onClick={() => refetch()}>
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Level</TableCell>
                            <TableCell>Message</TableCell>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAlerts.map((alert) => (
                            <TableRow key={alert.alertId}>
                                <TableCell>
                                    {alert.alertLevel === 'danger' ? (
                                        <Chip icon={<Dangerous />} label="Danger" color="error" />
                                    ) : (
                                        <Chip icon={<Warning />} label="Warning" color="warning" />
                                    )}
                                </TableCell>
                                <TableCell>{alert.message}</TableCell>
                                <TableCell>
                                    {new Date(alert.timestamp).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    {alert.acknowledged ? (
                                        <Chip label="Acknowledged" color="success" />
                                    ) : (
                                        <Chip label="Pending" color="default" />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {!alert.acknowledged && (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleAcknowledge(alert.alertId)}
                                        >
                                            Acknowledge
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}