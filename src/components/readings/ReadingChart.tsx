import { useQuery } from '@tanstack/react-query';
import { Box, Typography, CircularProgress } from '@mui/material';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getReadings } from '../../api/readings';
import { format } from 'date-fns';

interface ReadingChartProps {
    sensorId?: number;
    nodeId?: number;
    hours?: number;
}

export default function ReadingChart({ sensorId, nodeId, hours = 24 }: ReadingChartProps) {
    const queryKey = sensorId ?
        ['readings', sensorId, hours] :
        ['nodeReadings', nodeId, hours];

    const queryFn = sensorId ?
        () => getReadings(sensorId, hours) :
        () => getNodeReadings(nodeId!, hours);

    const { data: readings, isLoading, error } = useQuery(
        queryKey,
        queryFn
    );

    const chartData = readings?.map(reading => ({
        ...reading,
        timestamp: format(new Date(reading.timestamp), 'HH:mm')
    })) || [];

    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Typography color="error" sx={{ p: 2 }}>
            Error loading readings
        </Typography>
    );

    return (
        <Box sx={{ height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                {sensorId ? 'Sensor Readings' : 'Node Readings'} (Last {hours} hours)
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
}