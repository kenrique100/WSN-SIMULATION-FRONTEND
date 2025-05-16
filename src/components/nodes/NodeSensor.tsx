import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import { getNodeSensors } from '@/api/nodes';
import { useParams } from 'react-router-dom';
import { formatDate } from '@/types/helpers';
import { Link } from 'react-router-dom';

export default function NodeSensors() {
    const { nodeId } = useParams<{ nodeId: string }>();

    const { data, isLoading, error } = useQuery({
        queryKey: ['nodeSensors', nodeId],
        queryFn: () => {
            if (!nodeId) throw new Error('Node ID is required');
            return getNodeSensors(parseInt(nodeId), {});
        },
        enabled: !!nodeId,
    });

    const sensors = data?.content ?? [];

    if (isLoading) {
        return (
          <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
          </Box>
        );
    }

    if (error) {
        return (
          <Alert severity="error" sx={{ mt: 2 }}>
              Error loading sensors: {error.message}
          </Alert>
        );
    }

    if (sensors.length === 0) {
        return (
          <Alert severity="info" sx={{ mt: 2 }}>
              No sensors found for this node
          </Alert>
        );
    }

    return (
      <Box sx={{ mt: 3 }}>
          <TableContainer component={Paper}>
              <Table size="small">
                  <TableHead>
                      <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Type ID</TableCell>
                          <TableCell>Min Value</TableCell>
                          <TableCell>Max Value</TableCell>
                          <TableCell>Calibration Date</TableCell>
                          <TableCell>Actions</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {sensors.map((sensor) => (
                        <TableRow key={sensor.sensorId}>
                            <TableCell>{sensor.sensorId}</TableCell>
                            <TableCell>{sensor.typeId}</TableCell>
                            <TableCell>{sensor.minValue ?? 'N/A'}</TableCell>
                            <TableCell>{sensor.maxValue ?? 'N/A'}</TableCell>
                            <TableCell>
                                {sensor.calibrationDate
                                  ? formatDate(new Date(sensor.calibrationDate))
                                  : 'N/A'}
                            </TableCell>
                            <TableCell>
                                <Link to={`/readings/${sensor.sensorId}`}>
                                    <Button size="small">View Readings</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </TableContainer>
      </Box>
    );
}