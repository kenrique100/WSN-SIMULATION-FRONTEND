import {
    Grid,
    Card,
    CardContent,
    Box,
    Typography,
    CircularProgress,
    Backdrop,
    Fade
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getNodes, getNodeStatusStats } from '@/api/nodes';
import { getAlertStats } from '@/api/alerts';
import NodeStatusChart from '@/components/dashboard/NodeStatusChart';
import AlertStatusChart from '@/components/dashboard/AlertStatusChart';
import NodeMap from '@/components/nodes/NodeMap';
import PageHeader from '@/components/common/PageHeader';
import PageWrapper from '@/components/layout/PageWrapper';
import RecentAlertsPanel from '@/components/alerts/RecentAlertsPanel';
import { useAuthStore } from '@/store/authStore';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
    PaginatedResponse,
    SensorNode,
    NodeStats,
    AlertStats
} from '@/types';
import type { AxiosError } from 'axios';

type ExpandedCard = 'nodes' | 'alerts' | 'map' | 'recentAlerts' | null;

export default function Dashboard() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const logout = useAuthStore(state => state.logout);
    const navigate = useNavigate();

    const [expanded, setExpanded] = useState<ExpandedCard>(null);

    const handleUnauthorized = useCallback(async () => {
        await logout();
        navigate('/login');
    }, [logout, navigate]);

    const { data: nodesData, isLoading: nodesLoading, isError: nodesError, error: nodesErrorData } = useQuery<PaginatedResponse<SensorNode>, AxiosError>({
        queryKey: ['nodes'],
        queryFn: () => getNodes({ page: 0, size: 100 }),
        enabled: isAuthenticated,
        retry: (failureCount, error) => {
            if (error.response?.status === 401) {
                void handleUnauthorized();
                return false;
            }
            return failureCount < 3;
        },
    });

    const { data: nodeStats, isLoading: statsLoading, isError: statsError, error: statsErrorData } = useQuery<NodeStats, AxiosError>({
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

    const { data: alertStats, isLoading: alertStatsLoading, isError: alertStatsError, error: alertStatsErrorData } = useQuery<AlertStats, AxiosError>({
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

    const isLoading = useMemo(() => nodesLoading || statsLoading || alertStatsLoading, [nodesLoading, statsLoading, alertStatsLoading]);
    const isError = useMemo(() => nodesError || statsError || alertStatsError, [nodesError, statsError, alertStatsError]);

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

    const renderExpandedContent = () => {
        if (!expanded) return null;

        const renderContent = () => {
            switch (expanded) {
                case 'nodes':
                    return <NodeStatusChart stats={nodeStats} />;
                case 'alerts':
                    return <AlertStatusChart stats={alertStats} />;
                case 'map':
                    return <NodeMap nodes={nodesData?.content || []} />;
                case 'recentAlerts':
                    return <RecentAlertsPanel />;
                default:
                    return null;
            }
        };

        return (
          <Fade in={!!expanded}>
              <Box
                sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1301,
                    width: '90%',
                    height: '90%',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 6,
                    overflow: 'auto',
                    p: 4
                }}
              >
                  <Typography variant="h5" gutterBottom>
                      {expanded === 'nodes' && 'Node Status'}
                      {expanded === 'alerts' && 'Alert Status'}
                      {expanded === 'map' && 'Network Map'}
                      {expanded === 'recentAlerts' && 'Recent Alerts'}
                  </Typography>
                  {renderContent()}
              </Box>
          </Fade>
        );
    };

    return (
      <PageWrapper>
          <Box sx={{ p: 3 }}>
              <PageHeader title="WSN Monitoring Dashboard" breadcrumbs={[{ label: 'Dashboard', href: '/' }]} />

              {isError && (
                <Typography color="error" sx={{ mb: 3 }}>
                    {nodesErrorData?.message || statsErrorData?.message || alertStatsErrorData?.message || 'Failed to load dashboard data'}
                </Typography>
              )}

              <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                      <Card onClick={() => setExpanded('nodes')} sx={{ cursor: 'pointer', transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'scale(1.02)' } }}>
                          <CardContent>
                              <Typography variant="h6" gutterBottom>Node Status</Typography>
                              {statsError ? (
                                <Typography color="error">Failed to load node status</Typography>
                              ) : (
                                <NodeStatusChart stats={nodeStats} />
                              )}
                          </CardContent>
                      </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                      <Card onClick={() => setExpanded('alerts')} sx={{ cursor: 'pointer', transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'scale(1.02)' } }}>
                          <CardContent>
                              <Typography variant="h6" gutterBottom>Alert Status</Typography>
                              {alertStatsError ? (
                                <Typography color="error">Failed to load alert stats</Typography>
                              ) : (
                                <AlertStatusChart stats={alertStats} />
                              )}
                          </CardContent>
                      </Card>
                  </Grid>

                  <Grid item xs={12} md={8}>
                      <Card onClick={() => setExpanded('map')} sx={{ cursor: 'pointer', transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'scale(1.02)' } }}>
                          <CardContent>
                              <Typography variant="h6" gutterBottom>Network Map</Typography>
                              {nodesError ? (
                                <Typography color="error">Failed to load node map</Typography>
                              ) : (
                                <NodeMap nodes={nodesData?.content || []} />
                              )}
                          </CardContent>
                      </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                      <Card onClick={() => setExpanded('recentAlerts')} sx={{ cursor: 'pointer', transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'scale(1.02)' } }}>
                          <CardContent>
                              <Typography variant="h6" gutterBottom>Recent Alerts</Typography>
                              <RecentAlertsPanel />
                          </CardContent>
                      </Card>
                  </Grid>
              </Grid>
          </Box>

          <Backdrop
            open={!!expanded}
            onClick={() => setExpanded(null)}
            sx={{
                zIndex: 1300,
                backdropFilter: 'blur(8px)',
                backgroundColor: 'rgba(0,0,0,0.3)'
            }}
          >
              {renderExpandedContent()}
          </Backdrop>
      </PageWrapper>
    );
}
