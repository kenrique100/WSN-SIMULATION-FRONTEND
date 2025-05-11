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
} from '@mui/material';
import { fetchNodeSensors } from '@/api/nodes';
import { useParams } from 'react-router-dom';
import { formatDate } from '@/types/helpers';
import { Link } from 'react-router-dom';
import { Sensor as ApiSensor } from '@/types'; // Assuming your API response type for Sensor is here

interface Sensor {
    sensorId: number;
    type: string;
    unit: string;
    lastReading?: {
        value: number;
        timestamp: string;
    };
}

export function NodeSensors() {
    const { nodeId } = useParams<{ nodeId?: string }>();

    const { data, isLoading, error } = useQuery({
        queryKey: ['nodeSensors', nodeId],
        queryFn: async () => {
            if (!nodeId) {
                return Promise.reject('Node ID is missing');
            }
            const apiResponse = await fetchNodeSensors(nodeId);
            // Map the API response type to your local Sensor interface
            return apiResponse.map((sensor: ApiSensor) => ({
                sensorId: parseInt(sensor.id, 10), // Assuming the API returns sensor ID as a string
                type: sensor.type,
                unit: sensor.unit,
                lastReading: sensor.lastReading
                  ? {
                      value: sensor.lastReading.value,
                      timestamp: sensor.lastReading.timestamp,
                  }
                  : undefined,
            }));
        },
        enabled: !!nodeId,
    });

    const sensors = data as Sensor[] | undefined;

    if (isLoading) return <Typography>Loading sensors...</Typography>;
    if (error instanceof Error) return <Typography color="error">Error loading sensors: {error.message}</Typography>;
    if (!sensors) return <Typography>No sensors found for this node.</Typography>;

    return (
      <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
              Sensors
          </Typography>
          <TableContainer component={Paper}>
              <Table size="small">
                  <TableHead>
                      <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Unit</TableCell>
                          <TableCell>Last Reading</TableCell>
                          <TableCell>Last Updated</TableCell>
                          <TableCell>Actions</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {sensors.map((sensor) => (
                        <TableRow key={sensor.sensorId}>
                            <TableCell>{sensor.sensorId}</TableCell>
                            <TableCell>{sensor.type}</TableCell>
                            <TableCell>{sensor.unit}</TableCell>
                            <TableCell>
                                {sensor.lastReading ? `${sensor.lastReading.value} ${sensor.unit}` : 'N/A'}
                            </TableCell>
                            <TableCell>
                                {sensor.lastReading ? formatDate(new Date(sensor.lastReading.timestamp)) : 'N/A'}
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