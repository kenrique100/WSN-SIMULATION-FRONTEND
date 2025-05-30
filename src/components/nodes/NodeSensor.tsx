// src/components/nodes/NodeSensors.tsx
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
    Alert,
    Typography
} from '@mui/material';
import { getNodeSensors } from '@/api/nodes';
import { useParams, Link } from 'react-router-dom';
import { formatDate } from '@/types/helpers';
import AddIcon from '@mui/icons-material/Add';

export default function NodeSensors() {
    const { nodeId } = useParams<{ nodeId: string }>();
    const numericNodeId = nodeId ? parseInt(nodeId, 10) : null;

    const {
        data,
        isLoading,
        error
    } = useQuery({
        queryKey: ['nodeSensors', numericNodeId],
        queryFn: () => {
            if (!numericNodeId) throw new Error('Node ID is required');
            return getNodeSensors(numericNodeId, {});
        },
        enabled: !!numericNodeId
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

    return (
      <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1">Sensors</Typography>
              <Button
                component={Link}
                to={`/nodes/${nodeId}/sensors/new`}
                variant="contained"
                startIcon={<AddIcon />}
              >
                  Add Sensor
              </Button>
          </Box>

          {sensors.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
                No sensors found for this node
            </Alert>
          ) : (
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Type</TableCell>
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
                                  <Link to={`/sensors/${sensor.sensorId}`}>
                                      <Button size="small">View Details</Button>
                                  </Link>
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