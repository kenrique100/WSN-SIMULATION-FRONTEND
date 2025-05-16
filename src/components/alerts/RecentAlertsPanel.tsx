import {
    Alert as MuiAlert,
    AlertTitle,
    List,
    ListItem,
    ListItemText,
    Chip,
    Typography,
    Box,
    IconButton,
    CircularProgress
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getRecentAlerts } from '@/api/alerts';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import type { Alert } from '@/types';
import { useWebSocket } from '@/contexts/WebSocketContext';

const getAlertColor = (level: 'INFO' | 'WARNING' | 'CRITICAL') => {
    switch (level) {
        case 'CRITICAL': return 'error';
        case 'WARNING': return 'warning';
        default: return 'info';
    }
};

interface RecentAlertsPanelProps {
    maxItems?: number;
}

export default function RecentAlertsPanel({ maxItems = 5 }: RecentAlertsPanelProps) {
    const { isAuthenticated } = useAuth();
    const { alerts: wsAlerts } = useWebSocket();

    const {
        data: alerts,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery<Alert[]>({
        queryKey: ['recentAlerts', maxItems],
        queryFn: () => getRecentAlerts(maxItems),
        enabled: isAuthenticated,
        retry: false
    });

    useEffect(() => {
        if (wsAlerts.length > 0) {
            refetch().catch(console.error);
        }
    }, [wsAlerts, refetch]);

    if (!isAuthenticated) {
        return (
          <Box p={2}>
              <Typography variant="body2">Please login to view recent alerts</Typography>
          </Box>
        );
    }

    if (isLoading) {
        return (
          <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress size={24} />
          </Box>
        );
    }

    if (isError) {
        return (
          <Box p={2}>
              <Typography color="error" variant="body2">
                  {error?.message || 'Failed to load recent alerts'}
              </Typography>
          </Box>
        );
    }

    return (
      <Box>
          <MuiAlert
            severity="info"
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
          >
              <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
                  <AlertTitle>Recent Alerts</AlertTitle>
                  <IconButton size="small" onClick={() => refetch()}>
                      <RefreshIcon fontSize="small" />
                  </IconButton>
              </Box>

              {alerts?.length === 0 ? (
                <Typography variant="body2">No recent alerts</Typography>
              ) : (
                <List dense>
                    {alerts?.map((alert) => (
                      <ListItem key={alert.alertId} sx={{ py: 0.5 }}>
                          <ListItemText
                            primary={alert.message || 'Alert'}
                            secondary={new Date(alert.timestamp).toLocaleString()}
                            secondaryTypographyProps={{
                                color: alert.acknowledged ? 'text.secondary' : 'error.main',
                                variant: 'caption',
                            }}
                          />
                          <Chip
                            label={alert.alertLevel}
                            size="small"
                            color={getAlertColor(alert.alertLevel)}
                            sx={{ ml: 1 }}
                          />
                      </ListItem>
                    ))}
                </List>
              )}
          </MuiAlert>
      </Box>
    );
}