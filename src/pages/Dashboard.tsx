import {
    Grid,
    Card,
    CardContent,
    Box,
    Typography,
    Alert as MuiAlert,
    CircularProgress,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getNodes, getNodeStatusStats } from '@/api/nodes';
import { getAlertStats } from '@/api/alerts';
import NodeStatusChart from '@/components/dashboard/NodeStatusChart';
import AlertStatusChart from '@/components/dashboard/AlertStatusChart';
import NodeMap from '@/components/nodes/NodeMap';
import PageHeader from '@/components/common/PageHeader';
import PageWrapper from '@/components/layout/PageWrapper';
import type { PaginatedResponse, SensorNode, NodeStats, AlertStats } from '@/types';
import RecentAlertsPanel from '@/components/alerts/RecentAlertsPanel';
import { useCallback, useMemo } from 'react';
import type { AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const logout = useAuthStore(state => state.logout);
    const navigate = useNavigate(); // Add this line

    const handleUnauthorized = useCallback(async () => {
        await logout();
        navigate('/login');
    }, [logout, navigate]);

    const {
        data: nodesData,
        isLoading: nodesLoading,
        isError: nodesError,
        error: nodesErrorData,
    } = useQuery<PaginatedResponse<SensorNode>, AxiosError>({
        queryKey: ['nodes'],
        queryFn: () => getNodes({ page: 0, size: 100 }),
        enabled: isAuthenticated,
        retry: (failureCount, error) => {
            if (error.response?.status === 401) {
                void handleUnauthorized(); // explicitly void if not awaiting
                return false;
            }
            return failureCount < 3;
        },
    });

    const {
        data: nodeStats,
        isLoading: statsLoading,
        isError: statsError,
        error: statsErrorData,
    } = useQuery<NodeStats, AxiosError>({
        queryKey: ['nodeStats'],
        queryFn: getNodeStatusStats,
        enabled: isAuthenticated,
        retry: (failureCount, error) => {
            if (error.response?.status === 401) {
                void handleUnauthorized();
                return false;
            }
            return failureCount < 3;
        },
    });

    const {
        data: alertStats,
        isLoading: alertStatsLoading,
        isError: alertStatsError,
        error: alertStatsErrorData,
    } = useQuery<AlertStats, AxiosError>({
        queryKey: ['alertStats'],
        queryFn: getAlertStats,
        enabled: isAuthenticated,
        retry: (failureCount, error) => {
            if (error.response?.status === 401) {
                void handleUnauthorized();
                return false;
            }
            return failureCount < 3;
        },
    });

    const isLoading = useMemo(
      () => nodesLoading || statsLoading || alertStatsLoading,
      [nodesLoading, statsLoading, alertStatsLoading]
    );

    const isError = useMemo(
      () => nodesError || statsError || alertStatsError,
      [nodesError, statsError, alertStatsError]
    );

    if (!isAuthenticated) {
        return (
          <PageWrapper>
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                  <Typography>Please login to view dashboard</Typography>
              </Box>
          </PageWrapper>
        );
    }

    if (isLoading) {
        return (
          <PageWrapper>
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                  <CircularProgress />
              </Box>
          </PageWrapper>
        );
    }

    return (
      <PageWrapper>
          <Box sx={{ p: 3 }}>
              <PageHeader title="WSN Monitoring Dashboard" breadcrumbs={[{ label: 'Dashboard', href: '/' }]} />

              {isError && (
                <MuiAlert severity="error" sx={{ mb: 3 }}>
                    {nodesErrorData?.message ||
                      statsErrorData?.message ||
                      alertStatsErrorData?.message ||
                      'Failed to load dashboard data'}
                </MuiAlert>
              )}

              <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                      <Card>
                          <CardContent>
                              <Typography variant="h6" gutterBottom>
                                  Node Status
                              </Typography>
                              {statsError ? (
                                <Box height={300} display="flex" alignItems="center" justifyContent="center">
                                    <Typography color="error">Failed to load node status</Typography>
                                </Box>
                              ) : (
                                <NodeStatusChart stats={nodeStats} />
                              )}
                          </CardContent>
                      </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                      <Card>
                          <CardContent>
                              <Typography variant="h6" gutterBottom>
                                  Alert Status
                              </Typography>
                              {alertStatsError ? (
                                <Box height={300} display="flex" alignItems="center" justifyContent="center">
                                    <Typography color="error">Failed to load alert stats</Typography>
                                </Box>
                              ) : (
                                <AlertStatusChart stats={alertStats} />
                              )}
                          </CardContent>
                      </Card>
                  </Grid>

                  <Grid item xs={12} md={8}>
                      <Card>
                          <CardContent>
                              <Typography variant="h6" gutterBottom>
                                  Network Map
                              </Typography>
                              {nodesError ? (
                                <Box height={400} display="flex" alignItems="center" justifyContent="center">
                                    <Typography color="error">Failed to load node map</Typography>
                                </Box>
                              ) : (
                                <NodeMap nodes={nodesData?.content || []} />
                              )}
                          </CardContent>
                      </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                      <Card>
                          <CardContent>
                              <Typography variant="h6" gutterBottom>
                                  Recent Alerts
                              </Typography>
                              <RecentAlertsPanel />
                          </CardContent>
                      </Card>
                  </Grid>
              </Grid>
          </Box>
      </PageWrapper>
    );
}
