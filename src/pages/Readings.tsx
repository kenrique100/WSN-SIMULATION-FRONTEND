import { Box, Tabs, Tab } from '@mui/material';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ReadingChart from '@/components/readings/ReadingChart';
import ReadingStats from '@/components/readings/ReadingStats';
import PageHeader from '@/components/common/PageHeader';

export default function Readings() {
  const { sensorId, nodeId } = useParams();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <PageHeader
        title={sensorId ? 'Sensor Readings' : 'Node Readings'}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Readings' },
        ]}
      />

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Chart View" />
        <Tab label="Statistics" />
      </Tabs>

      {tabValue === 0 && (
        <ReadingChart
          sensorId={sensorId ? parseInt(sensorId) : undefined}
          nodeId={nodeId ? parseInt(nodeId) : undefined}
        />
      )}

      {tabValue === 1 && (
        <ReadingStats
          sensorId={sensorId ? parseInt(sensorId) : undefined}
          nodeId={nodeId ? parseInt(nodeId) : undefined}
        />
      )}
    </Box>
  );
}