import {
  Box, Tabs, Tab, CircularProgress, Alert, Paper, Button, Typography
} from '@mui/material'; // ⬅️ Added Typography here
import React, { useState } from 'react';
import NodeList from '@/components/nodes/NodeList';
import NodeMap from '@/components/nodes/NodeMap';
import PageHeader from '@/components/common/PageHeader';
import { useQuery } from '@tanstack/react-query';
import { getNodes } from '@/api/nodes';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function Nodes() {
  const [tabValue, setTabValue] = useState(0);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['nodes'],
    queryFn: () => getNodes().then(res => res.content),
    staleTime: 1000 * 60 * 5
  });

  const nodes = data || [];
  const usingMockData = isError && nodes.length > 0;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError && nodes.length === 0) {
    return (
      <Box>
        <PageHeader
          title="Nodes"
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Nodes' }
          ]}
        />
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
          <Typography variant="h6" gutterBottom>
            Offline Mode
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Unable to connect to the server. Displaying limited functionality.
          </Typography>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            Retry Connection
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Nodes"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Nodes' }
        ]}
      />

      {usingMockData && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Connection issues detected. Showing demo data.
        </Alert>
      )}

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="List View" />
        <Tab label="Map View" />
      </Tabs>

      {tabValue === 0 && <NodeList nodes={nodes} />}
      {tabValue === 1 && <NodeMap nodes={nodes} />}
    </Box>
  );
}
