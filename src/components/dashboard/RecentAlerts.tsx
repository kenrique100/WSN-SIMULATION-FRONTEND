// src/components/dashboard/RecentAlerts.tsx
import {
  Alert as MuiAlert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Chip,
  Typography
} from '@mui/material';
import { Alert } from '@/types';
import { useWebSocket } from '@/contexts/WebSocketContext';

interface RecentAlertsProps {
  mockAlerts?: Alert[];
}

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

export default function RecentAlerts({ mockAlerts }: RecentAlertsProps) {
  const { alerts: wsAlerts, isConnected } = useWebSocket();
  const displayAlerts =
    mockAlerts || (Array.isArray(wsAlerts) ? wsAlerts.slice(0, 5) : []);

  return (
    <div>
      <MuiAlert severity="info">
        <AlertTitle>
          Recent Alerts
          {!isConnected && mockAlerts && (
            <Chip label="Demo" size="small" sx={{ ml: 1 }} />
          )}
        </AlertTitle>

        {displayAlerts.length === 0 ? (
          <Typography>No recent alerts</Typography>
        ) : (
          <List dense>
            {displayAlerts.map((alert) => (
              <ListItem key={alert.alertId || alert.timestamp} sx={{ py: 0.5 }}>
                <ListItemText
                  primary={alert.message || 'Alert'}
                  secondary={new Date(alert.timestamp).toLocaleString()}
                  secondaryTypographyProps={{
                    color: alert.acknowledged ? 'text.secondary' : 'error.main',
                    variant: 'caption'
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
    </div>
  );
}
