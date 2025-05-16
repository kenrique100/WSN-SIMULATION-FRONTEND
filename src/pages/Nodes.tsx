import {
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import React, { useState } from 'react';
import NodeList from '@/components/nodes/NodeList';
import NodeMap from '@/components/nodes/NodeMap';
import PageHeader from '@/components/common/PageHeader';
import { useQuery } from '@tanstack/react-query';
import { getNodes } from '@/api/nodes';
import RefreshIcon from '@mui/icons-material/Refresh';
import PageWrapper from '@/components/layout/PageWrapper';

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
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </PageWrapper>
    );
  }

  if (isError) {
    return (
      <PageWrapper>
        <PageHeader
          title="Nodes"
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Nodes' }
          ]}
        />
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          Retry
        </Button>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Nodes"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Nodes' }
        ]}
      />

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="List View" />
        <Tab label="Map View" />
      </Tabs>

      {tabValue === 0 && <NodeList nodes={data || []} />}
      {tabValue === 1 && <NodeMap nodes={data || []} />}
    </PageWrapper>
  );
}