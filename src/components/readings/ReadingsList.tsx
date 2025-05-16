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
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getReadings, createReading } from '@/api/readings';
import { useState } from 'react';
import { formatDate } from '@/types/helpers';

export default function ReadingsList() {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    page: 0,
    size: 10,
    sensorId: undefined as number | undefined,
    nodeId: undefined as number | undefined,
  });

  const [newReading, setNewReading] = useState({
    sensorId: '',
    value: '',
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['readings', filters],
    queryFn: () => getReadings(filters),
  });

  const handleCreateReading = async () => {
    if (!newReading.sensorId || !newReading.value) return;

    try {
      await createReading(
        parseInt(newReading.sensorId),
        parseFloat(newReading.value)
      );
      setNewReading({ sensorId: '', value: '' });
      await queryClient.invalidateQueries({ queryKey: ['readings'] }); // ✅ FIXED HERE
    } catch (err) {
      console.error('Error creating reading:', err);
    }
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
        All Readings
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Sensor ID"
          size="small"
          value={filters.sensorId || ''}
          onChange={(e) =>
            setFilters({
              ...filters,
              sensorId: parseInt(e.target.value) || undefined,
            })
          }
          type="number"
        />
        <TextField
          label="Node ID"
          size="small"
          value={filters.nodeId || ''}
          onChange={(e) =>
            setFilters({
              ...filters,
              nodeId: parseInt(e.target.value) || undefined,
            })
          }
          type="number"
        />
      </Box>

      <Box sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Create New Reading
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Sensor ID"
            size="small"
            value={newReading.sensorId}
            onChange={(e) =>
              setNewReading({ ...newReading, sensorId: e.target.value })
            }
            type="number"
          />
          <TextField
            label="Value"
            size="small"
            value={newReading.value}
            onChange={(e) =>
              setNewReading({ ...newReading, value: e.target.value })
            }
            type="number"
          />
          <Button
            variant="contained"
            onClick={handleCreateReading}
            disabled={!newReading.sensorId || !newReading.value}
          >
            Add Reading
          </Button>
        </Box>
      </Box>

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
            {data?.content.map((reading) => (
              <TableRow key={reading.readingId}>
                <TableCell>{reading.readingId}</TableCell>
                <TableCell>{reading.sensorId}</TableCell>
                <TableCell>{reading.value}</TableCell>
                <TableCell>{formatDate(new Date(reading.timestamp))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
