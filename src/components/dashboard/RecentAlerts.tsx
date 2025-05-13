// src/components/dashboard/RecentAlerts.tsx
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
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getRecentAlerts } from '@/api/alerts';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { mockAlerts } from '@/api/mockAlerts';
import { useEffect } from 'react';
import { Alert } from '@/types';

const getAlertColor = (level: 'INFO' | 'WARNING' | 'CRITICAL') => {
  switch (level) {
    case 'CRITICAL':
      return 'error';
    case 'WARNING':
      return 'warning';
    default:
      return 'info';
  }
};

export default function RecentAlerts({ mockAlerts: overrideMock }: { mockAlerts?: Alert[] }) {
  const {
    data: alerts,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['recentAlerts'],
    queryFn: () => getRecentAlerts(5),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { alerts: wsAlerts } = useWebSocket();

  useEffect(() => {
    if (wsAlerts.length > 0) {
      void refetch();
    }
  }, [wsAlerts, refetch]);

  const fallbackAlerts = overrideMock ?? mockAlerts;
  const displayAlerts: Alert[] = isError ? fallbackAlerts : alerts ?? [];

  return (
    <Box>
      <MuiAlert
        severity={isError ? 'warning' : 'info'}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
      >
        <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
          <AlertTitle>
            Recent Alerts
            {isError && <Chip label="Demo" size="small" sx={{ ml: 1 }} />}
          </AlertTitle>
          <IconButton size="small" onClick={() => void refetch()}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>

        {displayAlerts.length === 0 ? (
          <Typography>No recent alerts</Typography>
        ) : (
          <List dense>
            {displayAlerts.map((alert) => (
              <ListItem key={alert.alertId ?? alert.timestamp} sx={{ py: 0.5 }}>
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
