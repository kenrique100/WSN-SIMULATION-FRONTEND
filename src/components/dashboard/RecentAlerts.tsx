import { useQuery } from '@tanstack/react-query';
import { Box, Typography, List, ListItem, ListItemText, Chip, Button } from '@mui/material';
import { getRecentAlerts } from '../../api/alerts';
import { formatDate } from '../../utils/helpers';
import WarningIcon from '@mui/icons-material/Warning';
import DangerousIcon from '@mui/icons-material/Dangerous';
import { Link } from 'react-router-dom';

export default function RecentAlerts() {
    const { data: alerts, isLoading, error } = useQuery(
        ['recentAlerts'],
        () => getRecentAlerts(5)
    );

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
                {alerts?.map((alert) => (
                    <ListItem key={alert.alertId} divider>
                        <ListItemText
                            primary={alert.message}
                            secondary={formatDate(alert.timestamp)}
                            primaryTypographyProps={{
                                sx: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }
                            }}
                        />
                        {alert.alertLevel === 'danger' ? (
                            <Chip icon={<DangerousIcon />} label="Critical" color="error" size="small" />
                        ) : (
                            <Chip icon={<WarningIcon />} label="Warning" color="warning" size="small" />
                        )}
                    </ListItem>
                ))}
                {alerts?.length === 0 && (
                    <Typography variant="body2" color="textSecondary" sx={{ p: 2 }}>
                        No recent alerts
                    </Typography>
                )}
            </List>
        </Box>
    );
}