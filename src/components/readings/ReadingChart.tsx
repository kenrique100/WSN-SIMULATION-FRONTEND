import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Paper,
  useTheme,
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
import { format, parseISO } from 'date-fns';
import { getAllSensorReadings, getAllNodeReadings } from '@/api/readings';
import { useNotification } from '@/contexts/NotificationContext';
import { useQuery } from '@tanstack/react-query';
import type { Reading } from '@/types';

interface ReadingChartProps {
  sensorId?: number;
  nodeId?: number;
}

interface ChartDataPoint {
  value: number;
  timestamp: string;
  rawTimestamp: string;
  [key: string]: string | number;
}

const ReadingChart: React.FC<ReadingChartProps> = ({ sensorId, nodeId }) => {
  const theme = useTheme();
  const { showNotification } = useNotification();

  const queryKey = React.useMemo(
    () => (sensorId ? ['readings', 'sensor', sensorId] : ['readings', 'node', nodeId]),
    [sensorId, nodeId]
  );

  const fetchReadings = async (): Promise<Reading[]> => {
    try {
      const readings = sensorId
        ? await getAllSensorReadings(sensorId)
        : nodeId
          ? await getAllNodeReadings(nodeId)
          : [];

      if (readings.length === 0) {
        showNotification(
          `No readings found for ${sensorId ? 'sensor' : 'node'} ${sensorId ?? nodeId}`,
          'info'
        );
      }

      return readings;
    } catch (error) {
      console.error('Error fetching readings:', error);
      throw error;
    }
  };

  const {
    data: readings = [],
    isLoading,
    isError,
    error,
  } = useQuery<Reading[], Error>({
    queryKey,
    queryFn: fetchReadings,
  });

  React.useEffect(() => {
    if (isError && error) {
      showNotification(`Error loading readings: ${error.message}`, 'error');
    }
  }, [isError, error, showNotification]);

  const chartData: ChartDataPoint[] = React.useMemo(() => {
    return readings.map((reading) => ({
      value: reading.value,
      timestamp: format(parseISO(reading.timestamp), 'MMM d, HH:mm'),
      rawTimestamp: reading.timestamp,
    }));
  }, [readings]);

  const unit = readings?.[0]?.sensorType?.unit || '';

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

  if (readings.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        No readings available for {sensorId ? `sensor #${sensorId}` : `node #${nodeId}`}.
      </Alert>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: 500 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {sensorId ? `Sensor #${sensorId} Readings` : `Node #${nodeId} Readings`} (All Time)
      </Typography>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis
            dataKey="timestamp"
            tick={{ fontSize: 12 }}
            label={{ value: 'Time', position: 'insideBottomRight', offset: -5 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            label={{
              value: unit,
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle' },
            }}
          />
          <Tooltip
            formatter={(value: number) => [`${value} ${unit}`, 'Value']}
            labelFormatter={(label: string) => `Time: ${label}`}
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              borderColor: theme.palette.divider,
              borderRadius: theme.shape.borderRadius,
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke={theme.palette.primary.main}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
            name="Value"
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default ReadingChart;
