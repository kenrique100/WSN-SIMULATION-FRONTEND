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
  Tooltip,
  Pagination
} from '@mui/material';
import React, { useState } from 'react';
import NodeList from '@/components/nodes/NodeList';
import NodeMap from '@/components/nodes/NodeMap';
import PageHeader from '@/components/common/PageHeader';
import { useQuery } from '@tanstack/react-query';
import { getNodes, getNodeStatusStats } from '@/api/nodes';
import RefreshIcon from '@mui/icons-material/Refresh';
import PageWrapper from '@/components/layout/PageWrapper';
import { TableChart, Map } from '@mui/icons-material';

export default function Nodes() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const {
    data: nodesData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['nodes', page, size],
    queryFn: () => getNodes({ page, size, sort: 'lastModified,desc' }),
  });

  const { data: stats } = useQuery({
    queryKey: ['nodeStats'],
    queryFn: getNodeStatusStats,
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1); // MUI Pagination is 1-based, API is 0-based
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
            {stats && (
              <Chip
                label={`${stats.totalNodes} Nodes (${stats.activeNodes} active)`}
                color="primary"
                variant="outlined"
                sx={{ mr: 2 }}
              />
            )}
            <Tooltip title="Refresh data">
              <IconButton onClick={() => refetch()} disabled={isRefetching}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />

      <Paper sx={{ mb: 3, borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[1] }}>
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

      <Box sx={{ mt: 2 }}>
        {tabValue === 0 && nodesData && (
          <>
            <NodeList nodes={nodesData.content} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={nodesData.totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        )}
        {tabValue === 1 && nodesData && <NodeMap nodes={nodesData.content} />}
      </Box>
    </PageWrapper>
  );
}