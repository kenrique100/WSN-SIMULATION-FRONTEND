import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  TextField,
  Chip,
  Stack,
} from '@mui/material';
import { getThresholds } from '@/api/thresholds';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { useNotification } from '@/contexts/NotificationContext';
import type { AlertThreshold } from '@/types';
import { useState, useMemo } from 'react';

export default function ThresholdList() {
  const { showNotification } = useNotification();

  const {
    data: thresholds = [],
    isLoading,
    isError,
    error,
  } = useQuery<AlertThreshold[], Error>({
    queryKey: ['thresholds'],
    queryFn: getThresholds,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const [sensorTypeFilter, setSensorTypeFilter] = useState('');
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'enabled' | 'disabled'>('all');

  const filteredThresholds = useMemo(() => {
    return thresholds.filter((threshold) => {
      const matchesSensor =
        threshold.sensorType.toLowerCase().includes(sensorTypeFilter.toLowerCase());
      const matchesNotification =
        notificationFilter === 'all' ||
        (notificationFilter === 'enabled' && threshold.notificationEnabled) ||
        (notificationFilter === 'disabled' && !threshold.notificationEnabled);
      return matchesSensor && matchesNotification;
    });
  }, [thresholds, sensorTypeFilter, notificationFilter]);

  if (isError) {
    showNotification(`Error loading thresholds: ${error?.message || 'Unknown error'}`, 'error');
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h5">Thresholds</Typography>
        <Button
          component={Link}
          to="/thresholds/new"
          variant="contained"
          color="primary"
        >
          Add New Threshold
        </Button>
      </Box>

      <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
        <TextField
          label="Filter by Sensor Type"
          variant="outlined"
          size="small"
          value={sensorTypeFilter}
          onChange={(e) => setSensorTypeFilter(e.target.value)}
        />
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label="All"
            clickable
            color={notificationFilter === 'all' ? 'primary' : 'default'}
            onClick={() => setNotificationFilter('all')}
          />
          <Chip
            label="Enabled"
            clickable
            color={notificationFilter === 'enabled' ? 'primary' : 'default'}
            onClick={() => setNotificationFilter('enabled')}
          />
          <Chip
            label="Disabled"
            clickable
            color={notificationFilter === 'disabled' ? 'primary' : 'default'}
            onClick={() => setNotificationFilter('disabled')}
          />
        </Stack>
      </Stack>

      {filteredThresholds.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          No thresholds match the current filters.
        </Alert>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table aria-label="thresholds table">
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Sensor Type</strong></TableCell>
                <TableCell align="right"><strong>Min Value</strong></TableCell>
                <TableCell align="right"><strong>Max Value</strong></TableCell>
                <TableCell><strong>Notifications</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredThresholds.map((threshold) => (
                <TableRow key={threshold.id} hover>
                  <TableCell>{threshold.sensorType}</TableCell>
                  <TableCell align="right">
                    {threshold.minValue?.toLocaleString() ?? '-'}
                  </TableCell>
                  <TableCell align="right">
                    {threshold.maxValue?.toLocaleString() ?? '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={threshold.notificationEnabled ? 'Enabled' : 'Disabled'}
                      color={threshold.notificationEnabled ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      component={Link}
                      to={`/thresholds/${threshold.id}`}
                      aria-label="edit"
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
