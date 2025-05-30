// src/pages/readings/index.tsx
import React, { useState } from 'react';
import { Tabs, Tab, Box, useTheme, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import ReadingChart from '@/components/readings/ReadingChart';
import ReadingStats from '@/components/readings/ReadingStats';
import ReadingsList from '@/components/readings/ReadingsList';
import PageHeader from '@/components/common/PageHeader';
import PageWrapper from '@/components/layout/PageWrapper';
import { Timeline, ShowChart, TableChart } from '@mui/icons-material';

const ReadingsPage: React.FC = () => {
  const { sensorId, nodeId } = useParams<{ sensorId?: string; nodeId?: string }>();
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getPageTitle = () => {
    if (sensorId) return `Sensor #${sensorId} Readings`;
    if (nodeId) return `Node #${nodeId} Readings`;
    return 'All Readings';
  };

  return (
    <PageWrapper>
      <PageHeader
        title={getPageTitle()}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Readings', href: '/readings' },
          ...(sensorId ? [{ label: `Sensor ${sensorId}` }] : []),
          ...(nodeId ? [{ label: `Node ${nodeId}` }] : []),
        ]}
      />

      <Paper
        sx={{
          mb: 3,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              height: 4,
              borderTopLeftRadius: theme.shape.borderRadius,
              borderTopRightRadius: theme.shape.borderRadius,
            },
          }}
        >
          <Tab
            label="List View"
            icon={<TableChart fontSize="small" />}
            iconPosition="start"
            sx={{
              py: 2,
              minHeight: 'auto',
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
            }}
          />
          <Tab
            label="Chart View"
            icon={<ShowChart fontSize="small" />}
            iconPosition="start"
            sx={{
              py: 2,
              minHeight: 'auto',
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
            }}
          />
          <Tab
            label="Statistics"
            icon={<Timeline fontSize="small" />}
            iconPosition="start"
            sx={{
              py: 2,
              minHeight: 'auto',
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
            }}
          />
        </Tabs>
      </Paper>

      <Box
        sx={{
          mt: 2,
          p: 3,
          backgroundColor: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
        }}
      >
        {tabValue === 0 && (
          <ReadingsList
            sensorId={sensorId ? parseInt(sensorId) : undefined}
            nodeId={nodeId ? parseInt(nodeId) : undefined}
          />
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
      </Box>
    </PageWrapper>
  );
};

export default ReadingsPage;