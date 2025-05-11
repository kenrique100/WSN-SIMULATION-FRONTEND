import { Grid, Card, CardContent, Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getNodes } from '@/api/nodes';
import NodeStatusChart from '@/components/dashboard/NodeStatusChart';
import AlertStatusChart from '@/components/dashboard/AlertStatusChart';
import RecentAlerts from '@/components/dashboard/RecentAlerts';
import NodeMap from '@/components/nodes/NodeMap';
import PageHeader from '@/components/common/PageHeader';

export default function Dashboard() {
    const { data: nodes } = useQuery({
        queryKey: ['nodes'],
        queryFn: getNodes
    });

    return (
      <Box sx={{ p: 3 }}>
          <PageHeader
            title="WSN Monitoring Dashboard"
            breadcrumbs={[
                { label: 'Dashboard', href: '/' }
            ]}
          />

          <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                  <Card>
                      <CardContent>
                          <Typography variant="h6" gutterBottom>
                              Node Status
                          </Typography>
                          <NodeStatusChart />
                      </CardContent>
                  </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                  <Card>
                      <CardContent>
                          <Typography variant="h6" gutterBottom>
                              Alert Status
                          </Typography>
                          <AlertStatusChart />
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
                          <RecentAlerts />
                      </CardContent>
                  </Card>
              </Grid>
          </Grid>
      </Box>
    );
}