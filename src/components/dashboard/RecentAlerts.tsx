import { useQuery } from '@tanstack/react-query';
import { Box, Typography, List, ListItem, ListItemText, Chip, Button } from '@mui/material';
import { getRecentAlerts } from '@/api/alerts';
import { formatDate } from '@/types/helpers';
import WarningIcon from '@mui/icons-material/Warning';
import DangerousIcon from '@mui/icons-material/Dangerous';
import { Link } from 'react-router-dom';
import type { Alert } from '@/types'; // import Alert type explicitly

export default function RecentAlerts() {
  const { data: alerts = [], isLoading, error } = useQuery<Alert[]>({
    queryKey: ['recentAlerts'],
    queryFn: () => getRecentAlerts(5),
  });

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error loading recent alerts</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Recent Alerts</Typography>
        <Button component={Link} to="/alerts" size="small">
          View All
        </Button>
      </Box>
      <List sx={{ maxHeight: 300, overflow: 'auto' }}>
        {alerts.length > 0 ? (
          alerts.map((alert: Alert) => (
            <ListItem key={alert.alertId} divider>
              <ListItemText
                primary={alert.message}
                secondary={formatDate(new Date(alert.timestamp))}
                primaryTypographyProps={{
                  sx: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  },
                }}
              />
              {alert.alertLevel === 'danger' ? (
                <Chip icon={<DangerousIcon />} label="Critical" color="error" size="small" />
              ) : (
                <Chip icon={<WarningIcon />} label="Warning" color="warning" size="small" />
              )}
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ p: 2 }}>
            No recent alerts
          </Typography>
        )}
      </List>
    </Box>
  );
}
