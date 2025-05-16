// src/components/readings/ReadingChart.tsx
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import { getSensorReadings, getNodeReadings } from '@/api/readings';
import { SENSOR_TYPES } from '@/types/constants';
import { useNotification } from '@/contexts/NotificationContext';
import React from 'react';
import type { PaginatedResponse, Reading } from '@/types';
import { useQuery } from '@tanstack/react-query';

interface ReadingChartProps {
  sensorId?: number;
  nodeId?: number;
  hours?: number;
}

interface ChartDataPoint {
  value: number;
  timestamp: string;
  [key: string]: string | number;
}

export default function ReadingChart({ sensorId, nodeId, hours = 24 }: ReadingChartProps) {
  const { showNotification } = useNotification();

  const queryKey = sensorId
    ? ['readings', 'sensor', sensorId, hours]
    : ['readings', 'node', nodeId, hours];

  const queryFn = sensorId
    ? () => getSensorReadings(sensorId, 0, 100)
    : () => getNodeReadings(nodeId!, 0, 100);

  const {
    data: readingsData,
    isLoading,
    isError,
    error,
  } = useQuery<PaginatedResponse<Reading>, Error>({ queryKey, queryFn });

  const readings = readingsData?.content || [];

  React.useEffect(() => {
    if (isError && error) {
      showNotification(`Error loading readings: ${error.message}`, 'error');
    }
  }, [isError, error, showNotification]);

  const chartData: ChartDataPoint[] = React.useMemo(() => {
    return readings.slice(0, 50).map((reading) => ({
      ...reading,
      timestamp: format(new Date(reading.timestamp), 'HH:mm'),
    }));
  }, [readings]);

  const sensorType = sensorId
    ? SENSOR_TYPES.find((t) => t.id === sensorId)
    : null;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error?.message || 'Failed to load readings'}
      </Alert>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        height: 420,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: 6,
          transform: 'scale(1.01)',
        },
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {sensorId ? `${sensorType?.name || 'Sensor'} Readings` : 'Node Readings'} (Last {hours} hours)
      </Typography>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis
            label={{
              value: sensorType?.unit || '',
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip
            formatter={(value: number) => [`${value} ${sensorType?.unit || ''}`, 'Value']}
            labelFormatter={(label: string) => `Time: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#1976d2"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            name={sensorType?.name || 'Value'}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}