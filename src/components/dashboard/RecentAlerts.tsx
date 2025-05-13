import { Alert as MuiAlert, AlertTitle, List, ListItem, ListItemText } from '@mui/material';
import { Alert } from '@/types';
import { useWebSocket } from '@/contexts/WebSocketContext';

interface RecentAlertsProps {
  mockAlerts?: Alert[];
}

export default function RecentAlerts({ mockAlerts }: RecentAlertsProps) {
  const { alerts } = useWebSocket();

  // Use mock data if provided, otherwise use WebSocket data
  const displayAlerts = mockAlerts || (Array.isArray(alerts) ? alerts : []);

  return (
    <div>
      <MuiAlert severity="info">
        <AlertTitle>Recent Alerts</AlertTitle>
        {displayAlerts.length === 0 ? (
          <p>No recent alerts</p>
        ) : (
          <List dense>
            {displayAlerts.slice(0, 5).map((alert) => (
              <ListItem key={alert.alertId || alert.timestamp}>
                <ListItemText
                  primary={alert.message || 'Alert'}
                  secondary={new Date(alert.timestamp).toLocaleString()}
                  secondaryTypographyProps={{ color: alert.acknowledged ? 'text.secondary' : 'error.main' }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </MuiAlert>
    </div>
  );
}