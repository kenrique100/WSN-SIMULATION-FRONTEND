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
    Typography,
    IconButton,
    Tooltip
} from '@mui/material';
import { getNodeSensors } from '@/api/nodes';
import { useParams, Link } from 'react-router-dom';
import { formatDate } from '@/types/helpers';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function NodeSensors() {
    const { nodeId } = useParams<{ nodeId: string }>();
    const numericNodeId = nodeId ? parseInt(nodeId, 10) : null;

    const {
        data: sensorsData,
        isLoading,
        error,
        refetch,
        isRefetching
    } = useQuery({
        queryKey: ['nodeSensors', numericNodeId],
        queryFn: () => {
            if (!numericNodeId) throw new Error('Node ID is required');
            return getNodeSensors(numericNodeId, {});
        },
        enabled: !!numericNodeId
    });

    const sensors = sensorsData?.content ?? [];

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
              Error loading sensors: {error instanceof Error ? error.message : 'Unknown error'}
          </Alert>
        );
    }

    return (
      <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Attached Sensors</Typography>
              <Box>
                  <Tooltip title="Refresh sensors">
                      <IconButton
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        sx={{ mr: 1 }}
                      >
                          <RefreshIcon />
                      </IconButton>
                  </Tooltip>
                  <Button
                    component={Link}
                    to={`/nodes/${nodeId}/sensors/new`}
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="small"
                  >
                      Add Sensor
                  </Button>
              </Box>
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
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Type</strong></TableCell>
                            <TableCell><strong>Min Value</strong></TableCell>
                            <TableCell><strong>Max Value</strong></TableCell>
                            <TableCell><strong>Calibration Date</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sensors.map((sensor) => (
                          <TableRow key={sensor.sensorId} hover>
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
                                  <Button
                                    component={Link}
                                    to={`/sensors/${sensor.sensorId}`}
                                    size="small"
                                    variant="outlined"
                                  >
                                      Details
                                  </Button>
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