import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Chip,
    IconButton,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getRecentAlerts } from '@/api/alerts';
import RefreshIcon from '@mui/icons-material/Refresh';
import Loading from '@/components/common/Loading';
import ErrorAlert from '@/components/common/ErrorAlert';
import { useEffect } from 'react';
import { AlertLevel } from '@/types';
import { formatDate } from '@/types/helpers';
import { useWebSocket } from '@/contexts/WebSocketContext';

const getAlertColor = (level: AlertLevel): 'error' | 'warning' | 'info' => {
    switch (level) {
        case 'CRITICAL':
            return 'error';
        case 'WARNING':
            return 'warning';
        default:
            return 'info';
    }
};

export default function RecentAlertsPanel() {
    const {
        data: alerts,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ['recentAlerts'],
        queryFn: () => getRecentAlerts(5),
        staleTime: 1000 * 60, // 1 minute
    });

    const { alerts: wsAlerts } = useWebSocket();

    // Update on new WebSocket alerts
    useEffect(() => {
        if (wsAlerts.length > 0) {
            void refetch(); // explicitly ignoring the promise
        }
    }, [wsAlerts, refetch]);

    if (isLoading) return <Loading />;

    if (isError) {
        return (
            <ErrorAlert
                message={(error as Error).message}
                retryable
                onRetry={() => {
                    void refetch(); // ignore returned promise explicitly
                }}
            />
        );
    }

    return (
        <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Recent Alerts</Typography>
                <IconButton
                    onClick={() => {
                        void refetch(); // ignore returned promise explicitly
                    }}
                    size="small"
                >
                    <RefreshIcon fontSize="small" />
                </IconButton>
            </Box>
            <List dense>
                {alerts?.map((alert) => (
                    <ListItem key={alert.alertId} sx={{ py: 1 }}>
                        <ListItemText
                            primary={alert.message || 'No message'}
                            secondary={formatDate(new Date(alert.timestamp))}
                            sx={{ mr: 2 }}
                        />
                        <Chip
                            label={alert.alertLevel}
                            color={getAlertColor(alert.alertLevel)}
                            size="small"
                        />
                    </ListItem>
                ))}
                {alerts?.length === 0 && (
                    <ListItem>
                        <ListItemText primary="No recent alerts" />
                    </ListItem>
                )}
            </List>
        </Box>
    );
}
