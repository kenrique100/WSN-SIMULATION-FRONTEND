// src/pages/nodes/index.tsx
import {
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Button,
  Paper,
  useTheme,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import React, { useState } from 'react';
import NodeList from '@/components/nodes/NodeList';
import NodeMap from '@/components/nodes/NodeMap';
import PageHeader from '@/components/common/PageHeader';
import { useQuery } from '@tanstack/react-query';
import { getNodes } from '@/api/nodes';
import RefreshIcon from '@mui/icons-material/Refresh';
import PageWrapper from '@/components/layout/PageWrapper';
import { TableChart, Map } from '@mui/icons-material';
import type { SensorNode } from '@/types';

export default function Nodes() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const {
    data: nodes = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching
  } = useQuery<SensorNode[]>({
    queryKey: ['nodes'],
    queryFn: () => getNodes().then(res => Array.isArray(res.content) ? res.content : []),
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
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
          {error instanceof Error ? error.message : 'Failed to load nodes'}
        </Alert>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Network Nodes"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Nodes' }
        ]}
        action={
          <Box display="flex" alignItems="center">
            <Chip
              label={`${nodes.length} Nodes`}
              color="primary"
              variant="outlined"
              sx={{ mr: 2 }}
            />
            <Tooltip title="Refresh data">
              <IconButton onClick={() => refetch()} disabled={isRefetching}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        }
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
            label="Map View"
            icon={<Map fontSize="small" />}
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
        {tabValue === 0 && <NodeList nodes={nodes} />}
        {tabValue === 1 && <NodeMap nodes={nodes} />}
      </Box>
    </PageWrapper>
  );
}