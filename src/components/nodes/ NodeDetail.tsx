import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getNodeById } from '@/api/nodes';
import PageWrapper from '@/components/layout/PageWrapper';
import PageHeader from '@/components/common/PageHeader';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import NodeSensors from './NodeSensor';

export default function NodeDetail() {
  const { nodeId } = useParams<{ nodeId: string }>();
  const numericNodeId = nodeId ? parseInt(nodeId, 10) : null;

  const {
    data: node,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['node', numericNodeId],
    queryFn: () => {
      if (!numericNodeId) throw new Error('Node ID is required');
      return getNodeById(numericNodeId);
    },
    enabled: !!numericNodeId
  });

  if (isLoading) {
    return (
      <PageWrapper>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      </PageWrapper>
    );
  }

  if (isError || !node) {
    return (
      <PageWrapper>
        <PageHeader
          title="Node Details"
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Nodes', href: '/nodes' },
            { label: 'Details' }
          ]}
          action={
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => refetch()}
              disabled={isRefetching}
              sx={{ ml: 2 }}
            >
              Retry
            </Button>
          }
        />
        <Alert severity="error" sx={{ mb: 3 }}>
          {error instanceof Error ? error.message : 'Failed to load node details'}
        </Alert>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader
        title={`Node: ${node.name}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Nodes', href: '/nodes' },
          { label: node.name }
        ]}
        action={
          <Box display="flex" alignItems="center">
            <Button
              component={Link}
              to={`/nodes/${node.nodeId}/edit`}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Edit Node
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              Refresh
            </Button>
          </Box>
        }
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Node Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="subtitle2">Location</Typography>
                  <Typography>{node.location}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PowerSettingsNewIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="subtitle2">Status</Typography>
                  <Typography>{node.status}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PublicIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="subtitle2">Coordinates</Typography>
                  <Typography>
                    {node.latitude && node.longitude
                      ? `${node.latitude.toFixed(6)}, ${node.longitude.toFixed(6)}`
                      : 'Not specified'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="subtitle2">Last Heartbeat</Typography>
                  <Typography>
                    {node.lastHeartbeat
                      ? new Date(node.lastHeartbeat).toLocaleString()
                      : 'Never'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Node Sensors
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <NodeSensors />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageWrapper>
  );
}