import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useQuery } from '@tanstack/react-query';
import { getAlerts, acknowledgeAlert } from '@/api/alerts';
import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import AlertTable from '@/components/alerts/AlertTable';

type AcknowledgedFilter = 'all' | 'acknowledged' | 'unacknowledged';

export default function AlertList() {
  const { isAuthenticated, user } = useAuthStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [acknowledgedFilter, setAcknowledgedFilter] = useState<AcknowledgedFilter>('all');

  const {
    data: alertsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['alerts', page, rowsPerPage, acknowledgedFilter],
    queryFn: () => {
      const filter =
        acknowledgedFilter === 'all'
          ? undefined
          : acknowledgedFilter === 'acknowledged' || false;
      return getAlerts(filter, page, rowsPerPage);
    },
    enabled: isAuthenticated,
    retry: false,
  });

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleAcknowledgeFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: AcknowledgedFilter | null
  ) => {
    if (newValue !== null) {
      setAcknowledgedFilter(newValue);
      setPage(0);
    }
  };

  const handleAcknowledgeAlert = async (alertId: number) => {
    if (!user?.userId) return;
    try {
      await acknowledgeAlert(alertId, user.userId);
      await refetch();
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography>Please login to view alerts</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={2}>
        <Typography color="error">
          {error?.message || 'Failed to load alerts'}
        </Typography>
        <IconButton onClick={() => refetch()}>
          <RefreshIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <ToggleButtonGroup
          value={acknowledgedFilter}
          exclusive
          onChange={handleAcknowledgeFilterChange}
          aria-label="acknowledged filter"
        >
          <ToggleButton value="all" aria-label="all alerts">
            All
          </ToggleButton>
          <ToggleButton value="unacknowledged" aria-label="unacknowledged alerts">
            Unacknowledged
          </ToggleButton>
          <ToggleButton value="acknowledged" aria-label="acknowledged alerts">
            Acknowledged
          </ToggleButton>
        </ToggleButtonGroup>

        <IconButton onClick={() => refetch()} aria-label="refresh">
          <RefreshIcon />
        </IconButton>
      </Stack>

      <AlertTable
        alerts={alertsData?.content || []}
        onAcknowledge={handleAcknowledgeAlert}
        totalElements={alertsData?.totalElements || 0}
        page={page}
        size={rowsPerPage}
        onPageChange={handleChangePage}
        isLoading={isLoading}
        error={isError ? error : null}
      />
    </Box>
  );
}
