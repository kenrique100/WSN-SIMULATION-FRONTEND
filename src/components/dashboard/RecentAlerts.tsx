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
  CircularProgress,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getRecentAlerts } from '@/api/alerts';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useCallback, useEffect } from 'react';
import type { Alert } from '@/types';
import { useNotification } from '@/contexts/NotificationContext';

interface RecentAlertsProps {
  maxItems?: number;
}

export default function RecentAlerts({ maxItems = 5 }: RecentAlertsProps) {
  const { alerts: wsAlerts } = useWebSocket();
  const { showNotification } = useNotification();

  const { data: alerts, isLoading, isError, error, refetch } = useQuery<Alert[]>({
    queryKey: ['recentAlerts', maxItems],
    queryFn: () => getRecentAlerts(maxItems),
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: useCallback((data: Alert[]) => {
      return data.slice(0, maxItems);
    }, [maxItems]),
  });

  useEffect(() => {
    if (wsAlerts.length > 0) {
      refetch();
      showNotification('New alert received', 'info');
    }
  }, [wsAlerts, refetch, showNotification]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (isError) {
    return (
      <MuiAlert severity="error">
        {error?.message || 'Failed to load recent alerts'}
        <IconButton size="small" onClick={() => refetch()}>
          <RefreshIcon fontSize="small" />
        </IconButton>
      </MuiAlert>
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
          <Typography>No recent alerts</Typography>
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
                  color={
                    alert.alertLevel === 'CRITICAL' ? 'error' :
                      alert.alertLevel === 'WARNING' ? 'warning' : 'info'
                  }
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