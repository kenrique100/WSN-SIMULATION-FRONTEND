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
  CircularProgress
} from '@mui/material';
import { getThresholds } from '@/api/thresholds';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { useNotification } from '@/contexts/NotificationContext';
import { useState } from 'react';

export default function ThresholdList() {
  const { showNotification } = useNotification();
  const [page] = useState(0);
  const [size] = useState(10);

  const {
    data: thresholdsData,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['thresholds', page, size],
    queryFn: () => getThresholds(page, size),
  });

  const thresholds = thresholdsData?.content || [];

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Thresholds</Typography>
        <Button component={Link} to="/thresholds/new" variant="contained">
          Add New Threshold
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sensor Type ID</TableCell>
              <TableCell align="right">Warning Level</TableCell>
              <TableCell align="right">Danger Level</TableCell>
              <TableCell>Updated By</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {thresholds.map((threshold) => (
              <TableRow key={threshold.thresholdId}>
                <TableCell>{threshold.sensorTypeId}</TableCell>
                <TableCell align="right">{threshold.warningLevel}</TableCell>
                <TableCell align="right">{threshold.dangerLevel}</TableCell>
                <TableCell>User #{threshold.updatedBy}</TableCell>
                <TableCell align="center">
                  <IconButton
                    component={Link}
                    to={`/thresholds/${threshold.thresholdId}/edit`}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}