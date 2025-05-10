import { useQuery } from '@tanstack/react-query';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { fetchNodeSensors } from '../../api/nodes';
import { useParams } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';
import { Link } from 'react-router-dom';

export default function NodeSensors() {
    const { nodeId } = useParams();
    const { data: sensors, isLoading, error } = useQuery(
        ['nodeSensors', nodeId],
        () => fetchNodeSensors(nodeId!)
    );

    if (isLoading) return <Typography>Loading sensors...</Typography>;
    if (error) return <Typography color="error">Error loading sensors</Typography>;

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
                        {sensors?.map((sensor) => (
                            <TableRow key={sensor.sensorId}>
                                <TableCell>{sensor.sensorId}</TableCell>
                                <TableCell>{sensor.type}</TableCell>
                                <TableCell>{sensor.unit}</TableCell>
                                <TableCell>
                                    {sensor.lastReading ? `${sensor.lastReading.value} ${sensor.unit}` : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    {sensor.lastReading ? formatDate(sensor.lastReading.timestamp) : 'N/A'}
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