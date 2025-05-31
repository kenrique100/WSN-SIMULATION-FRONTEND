// components/readings/ReadingsList.tsx
import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  Button,
  TableFooter,
  TablePagination,
} from '@mui/material';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getReadings, createReading } from '@/api/readings';
import { formatDate } from '@/types/helpers';
import { useNotification } from '@/contexts/NotificationContext';
import type { Reading, PaginatedResponse } from '@/types';

const ReadingsList: React.FC<{ sensorId?: number }> = ({ sensorId }) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [newReading, setNewReading] = useState({
    sensorId: sensorId?.toString() || '',
    value: '',
  });

  const queryKey = ['readings', { page, size: rowsPerPage, sensorId }];

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<PaginatedResponse<Reading>, Error>({
    queryKey,
    queryFn: () => getReadings({ page, size: rowsPerPage, sensorId }),
  });

  React.useEffect(() => {
    if (isError && error) {
      showNotification(`Error loading readings: ${error.message}`, 'error');
    }
  }, [isError, error, showNotification]);

  const createReadingMutation = useMutation({
    mutationFn: ({ sensorId, value }: { sensorId: number; value: number }) =>
      createReading(sensorId, value),
    onSuccess: async () => {
      showNotification('Reading created successfully', 'success');
      await queryClient.invalidateQueries({ queryKey: ['readings'] });
    },
    onError: (err: Error) => {
      showNotification(`Error creating reading: ${err.message}`, 'error');
    },
  });

  const handleCreateReading = async () => {
    if (!newReading.sensorId || !newReading.value) return;
    await createReadingMutation.mutateAsync({
      sensorId: parseInt(newReading.sensorId),
      value: parseFloat(newReading.value),
    });
    setNewReading((prev) => ({ ...prev, value: '' }));
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error instanceof Error ? error.message : 'Failed to load readings'}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {sensorId ? `Sensor #${sensorId} Readings` : 'All Readings'}
      </Typography>

      <Box sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Create New Reading
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Sensor ID"
            size="small"
            value={newReading.sensorId}
            onChange={(e) => setNewReading({ ...newReading, sensorId: e.target.value })}
            type="number"
            disabled={!!sensorId}
          />
          <TextField
            label="Value"
            size="small"
            value={newReading.value}
            onChange={(e) => setNewReading({ ...newReading, value: e.target.value })}
            type="number"
          />
          <Button
            variant="contained"
            onClick={handleCreateReading}
            disabled={!newReading.sensorId || !newReading.value || createReadingMutation.isPending}
          >
            {createReadingMutation.isPending ? <CircularProgress size={24} /> : 'Add Reading'}
          </Button>
        </Box>
      </Box>

      {data?.content.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          No readings found
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Sensor ID</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.content.map((reading: Reading) => (
                <TableRow key={reading.readingId}>
                  <TableCell>{reading.readingId}</TableCell>
                  <TableCell>{reading.sensorId}</TableCell>
                  <TableCell>{reading.value} {reading.sensorType?.unit || ''}</TableCell>
                  <TableCell>{formatDate(new Date(reading.timestamp))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  count={data?.totalElements || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ReadingsList;