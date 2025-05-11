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
    IconButton
} from '@mui/material';
import { getThresholds } from '@/api/thresholds';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { useNotification } from '@/contexts/NotificationContext';
import type { AlertThreshold } from '@/types';

export default function ThresholdList() {
    const { showNotification } = useNotification();

    const {
        data: thresholds,
        isLoading,
        error
    } = useQuery<AlertThreshold[], Error>({
        queryKey: ['thresholds'],
        queryFn: getThresholds
    });

    if (isLoading) return <Typography>Loading thresholds...</Typography>;

    if (error) {
        showNotification('Error loading thresholds', 'error');
        return <Typography color="error">Error loading thresholds</Typography>;
    }

    return (
      <Box>
          <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
            }}
          >
              <Typography variant="h5">Thresholds</Typography>
              <Button component={Link} to="/thresholds/new" variant="contained">
                  Add New Threshold
              </Button>
          </Box>

          <TableContainer component={Paper}>
              <Table>
                  <TableHead>
                      <TableRow>
                          <TableCell>Sensor Type</TableCell>
                          <TableCell>Min Value</TableCell>
                          <TableCell>Max Value</TableCell>
                          <TableCell>Notifications</TableCell>
                          <TableCell>Actions</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {(thresholds ?? []).map((threshold) => (
                        <TableRow key={threshold.id}>
                            <TableCell>{threshold.sensorType}</TableCell>
                            <TableCell>{threshold.minValue ?? '-'}</TableCell>
                            <TableCell>{threshold.maxValue ?? '-'}</TableCell>
                            <TableCell>
                                {threshold.notificationEnabled ? 'Enabled' : 'Disabled'}
                            </TableCell>
                            <TableCell>
                                <IconButton component={Link} to={`/thresholds/${threshold.id}`}>
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
