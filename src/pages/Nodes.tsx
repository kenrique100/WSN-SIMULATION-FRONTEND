// src/pages/Nodes.tsx
import { Box, Tabs, Tab, CircularProgress, Alert } from '@mui/material';
import React, { useState } from 'react';
import NodeList from '@/components/nodes/NodeList';
import NodeMap from '@/components/nodes/NodeMap';
import PageHeader from '@/components/common/PageHeader';
import { useQuery } from '@tanstack/react-query';
import { getNodes } from '@/api/nodes';
import type { SensorNode } from '@/types';

export default function Nodes() {
  const [tabValue, setTabValue] = useState(0);

  const { data: nodes = [], isLoading, isError, error } = useQuery<SensorNode[], Error>({
    queryKey: ['nodes'],
    queryFn: () => getNodes(),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <PageHeader
        title="Nodes"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Nodes' }
        ]}
      />

      {isLoading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading nodes: {error?.message || 'Unknown error'}
        </Alert>
      )}

      {!isLoading && (
        <>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="List View" />
            <Tab label="Map View" />
          </Tabs>

          {tabValue === 0 && <NodeList nodes={nodes} />}
          {tabValue === 1 && <NodeMap nodes={nodes} />}
        </>
      )}
    </Box>
  );
}