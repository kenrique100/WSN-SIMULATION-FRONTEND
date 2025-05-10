import { Grid, Typography, Card, CardContent, Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getNodes } from '../api/nodes';
import { getAlerts } from '../api/alerts';
import NodeStatusChart from '../components/dashboard/NodeStatusChart';
import AlertStatusChart from '../components/dashboard/AlertStatusChart';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import NodeMap from '../components/dashboard/NodeMap';

export default function Dashboard() {
    const { data: nodes } = useQuery(['nodes'], getNodes);
    const { data: alerts } = useQuery(['alerts'], getAlerts);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                WSN Monitoring Dashboard
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Node Status
                            </Typography>
                            <NodeStatusChart nodes={nodes || []} />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Alert Status
                            </Typography>
                            <AlertStatusChart alerts={alerts || []} />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Network Map
                            </Typography>
                            <NodeMap nodes={nodes || []} />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Recent Alerts
                            </Typography>
                            <RecentAlerts alerts={alerts || []} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}