import { Tabs, Tab } from '@mui/material';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ReadingChart from '@/components/readings/ReadingChart';
import ReadingStats from '@/components/readings/ReadingStats';
import ReadingsList from '@/components/readings/ReadingsList';
import PageHeader from '@/components/common/PageHeader';
import PageWrapper from '@/components/layout/PageWrapper';

export default function Readings() {
  const { sensorId, nodeId } = useParams();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <PageWrapper>
      <PageHeader
        title={sensorId ? 'Sensor Readings' : 'Node Readings'}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Readings' },
        ]}
      />

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="List View" />
        <Tab label="Chart View" />
        <Tab label="Statistics" />
      </Tabs>

      {tabValue === 0 && (
        <ReadingsList />
      )}

      {tabValue === 1 && (
        <ReadingChart
          sensorId={sensorId ? parseInt(sensorId) : undefined}
          nodeId={nodeId ? parseInt(nodeId) : undefined}
        />
      )}

      {tabValue === 2 && (
        <ReadingStats
          sensorId={sensorId ? parseInt(sensorId) : undefined}
          nodeId={nodeId ? parseInt(nodeId) : undefined}
        />
      )}
    </PageWrapper>
  );
}