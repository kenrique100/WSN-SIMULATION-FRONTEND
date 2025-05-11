import { Box, Tabs, Tab } from '@mui/material';
import React, { useState } from 'react';
import NodeList from '../components/nodes/NodeList';
import NodeMap from '../components/nodes/NodeMap';
import PageHeader from '@/components/common/PageHeader';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { getNodes } from '@/api/nodes'; // Import getNodes
import type { SensorNode } from '@/types'; // Assuming getNodes returns SensorNode[]

export default function Nodes() {
  const [tabValue, setTabValue] = useState(0);
  const { data: nodes, isLoading, error } = useQuery<SensorNode[]>({ // Specify the type of data
    queryKey: ['nodes'],
    queryFn: getNodes,
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading) return <Box>Loading nodes...</Box>;
  if (error instanceof Error) return <Box color="error">Error loading nodes: {error.message}</Box>;

  return (
    <Box>
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

      {tabValue === 0 && <NodeList />}
      {tabValue === 1 && <NodeMap nodes={nodes || []} />}
    </Box>
  );
}