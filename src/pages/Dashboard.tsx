// src/pages/dashboard/index.tsx
import {
    Grid,
    Card,
    CardContent,
    Box,
    Typography,
    Alert as MuiAlert
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getNodes, getNodeStatusStats } from '@/api/nodes';
import { getAlertStats } from '@/api/alerts';
import NodeStatusChart from '@/components/dashboard/NodeStatusChart';
import AlertStatusChart from '@/components/dashboard/AlertStatusChart';
import RecentAlerts from '@/components/dashboard/RecentAlerts';
import NodeMap from '@/components/nodes/NodeMap';
import PageHeader from '@/components/common/PageHeader';
import Loading from '@/components/common/Loading';
import PageWrapper from '@/components/layout/PageWrapper';
import {
    AlertStats,
    NodeStats,
    PaginatedResponse,
    SensorNode,
    Alert as AlertType
} from '@/types';

// Mock data for fallback UI with Cameroon coordinates
const mockNodes: PaginatedResponse<SensorNode> = {
    content: [
        {
            nodeId: 1,
            name: 'Yaoundé Node',
            location: 'Central Region',
            latitude: 3.848,
            longitude: 11.5021,
            status: 'active',
            lastHeartbeat: new Date().toISOString()
        },
        {
            nodeId: 2,
            name: 'Douala Node',
            location: 'Littoral Region',
            latitude: 4.0511,
            longitude: 9.7679,
            status: 'inactive',
            lastHeartbeat: new Date(Date.now() - 86400000).toISOString()
        },
        {
            nodeId: 3,
            name: 'Bamenda Node',
            location: 'Northwest Region',
            latitude: 5.9597,
            longitude: 10.146,
            status: 'active',
            lastHeartbeat: new Date().toISOString()
        }
    ],
    totalElements: 3,
    totalPages: 1,
    page: 0,
    size: 10
};

const mockNodeStats: NodeStats = {
    total: 3,
    active: 2,
    inactive: 1,
    maintenance: 0
};

const mockAlertStats: AlertStats = {
    total: 5,
    critical: 2,
    warning: 2,
    info: 1,
    acknowledged: 1
};

const mockRecentAlerts: AlertType[] = [
    {
        alertId: 1,
        sensorId: 101,
        readingId: 1001,
        alertLevel: 'CRITICAL',
        message: 'Temperature threshold exceeded',
        timestamp: new Date().toISOString(),
        acknowledged: false
    },
    {
        alertId: 2,
        sensorId: 102,
        readingId: 1002,
        alertLevel: 'WARNING',
        message: 'Humidity fluctuation detected',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        acknowledged: true
    },
    {
        alertId: 3,
        sensorId: 103,
        readingId: 1003,
        alertLevel: 'INFO',
        message: 'Regular maintenance check',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        acknowledged: false
    }
];

export default function Dashboard() {
    const {
        data: nodesData,
        isLoading: nodesLoading,
        isError: nodesError
    } = useQuery<PaginatedResponse<SensorNode>>({
        queryKey: ['nodes'],
        queryFn: () => getNodes({ page: 0, size: 100 }),
        retry: 1,
        refetchOnWindowFocus: false
    });

    const {
        data: nodeStats,
        isLoading: statsLoading,
        isError: statsError
    } = useQuery<NodeStats, Error>({
        queryKey: ['nodeStats'],
        queryFn: getNodeStatusStats,
        retry: 1,
        refetchOnWindowFocus: false
    });

    const {
        data: alertStats,
        isLoading: alertStatsLoading,
        isError: alertStatsError
    } = useQuery<AlertStats, Error>({
        queryKey: ['alertStats'],
        queryFn: getAlertStats,
        retry: 1,
        refetchOnWindowFocus: false
    });

    const useMockData = nodesError || statsError || alertStatsError;
    const isLoading = nodesLoading || statsLoading || alertStatsLoading;

    if (isLoading) return <Loading />;

    return (
      <PageWrapper>
          <Box sx={{ p: 3 }}>
              <PageHeader
                title="WSN Monitoring Dashboard"
                breadcrumbs={[{ label: 'Dashboard', href: '/' }]}
              />

              {useMockData && (
                <MuiAlert severity="warning" sx={{ mb: 3 }}>
                    Could not connect to server. Displaying demo data.
                </MuiAlert>
              )}

              <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                      <Card>
                          <CardContent>
                              <Typography variant="h6" gutterBottom>
                                  Node Status
                              </Typography>
                              <NodeStatusChart
                                stats={useMockData ? mockNodeStats : nodeStats || undefined}
                              />
                          </CardContent>
                      </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                      <Card>
                          <CardContent>
                              <Typography variant="h6" gutterBottom>
                                  Alert Status
                              </Typography>
                              <AlertStatusChart
                                stats={useMockData ? mockAlertStats : alertStats || undefined}
                              />
                          </CardContent>
                      </Card>
                  </Grid>

                  <Grid item xs={12} md={8}>
                      <Card>
                          <CardContent>
                              <Typography variant="h6" gutterBottom>
                                  Network Map
                              </Typography>
                              <NodeMap
                                nodes={
                                    useMockData
                                      ? mockNodes.content
                                      : nodesData?.content || []
                                }
                              />
                          </CardContent>
                      </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                      <Card>
                          <CardContent>
                              <Typography variant="h6" gutterBottom>
                                  Recent Alerts
                              </Typography>
                              <RecentAlerts
                                mockAlerts={useMockData ? mockRecentAlerts : undefined}
                              />
                          </CardContent>
                      </Card>
                  </Grid>
              </Grid>
          </Box>
      </PageWrapper>
    );
}
