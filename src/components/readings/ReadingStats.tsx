import { Box, Grid, Paper, Stack, Divider, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getReadings, getNodeReadings } from '@/api/readings';
import { formatDate } from '@/types/helpers';
import {
  AccessTime,
  TrendingUp,
  TrendingDown,
  Straighten,
  CalendarToday,
} from '@mui/icons-material';
import Loading from '@/components/common/Loading';
import React from 'react';

interface ReadingStatsProps {
  sensorId?: number;
  nodeId?: number;
  hours?: number;
}

interface StatsData {
  average: number;
  min: number;
  max: number;
  count: number;
  firstReading: string;
  lastReading: string;
  trend: 'up' | 'down' | 'stable';
}

export default function ReadingStats({ sensorId, nodeId, hours = 24 }: ReadingStatsProps) {
  const queryKey = sensorId
    ? ['readings', sensorId, hours]
    : ['nodeReadings', nodeId, hours];

  const queryFn = sensorId
    ? () =>
      getReadings({
        sensorId: sensorId,
        limit: undefined,
        endTime: undefined,
        startTime: undefined,
      })
    : () => getNodeReadings(nodeId!, hours);

  const { data: readings, isLoading, error } = useQuery({
    queryKey,
    queryFn,
  });

  if (isLoading) return <Loading />;
  if (error) return <Box sx={{ color: 'error.main' }}>Error loading statistics</Box>;
  if (!readings || readings.length === 0) {
    return <Box>No readings available for the selected period</Box>;
  }

  const calculateStats = (): StatsData => {
    const values = readings.map((r) => r.value);
    const timestamps = readings.map((r) => new Date(r.timestamp).getTime());

    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (values.length > 1) {
      const first = values[0];
      const last = values[values.length - 1];
      const diff = last - first;

      if (diff > 0.1) trend = 'up';
      else if (diff < -0.1) trend = 'down';
    }

    return {
      average: parseFloat(average.toFixed(2)),
      min: parseFloat(min.toFixed(2)),
      max: parseFloat(max.toFixed(2)),
      count: values.length,
      firstReading: formatDate(new Date(Math.min(...timestamps))),
      lastReading: formatDate(new Date(Math.max(...timestamps))),
      trend,
    };
  };

  const stats = calculateStats();

  const StatItem = ({
                      icon,
                      title,
                      value,
                    }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
  }) => (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ color: 'primary.main' }}>{icon}</Box>
        <Box>
          <Typography component="span" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            {title}
          </Typography>
          <Typography component="div" sx={{ fontSize: '1.25rem', fontWeight: 500 }}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Reading Statistics (Last {hours} hours)
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatItem icon={<Straighten />} title="Average Value" value={stats.average} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatItem icon={<TrendingUp />} title="Maximum Value" value={stats.max} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatItem icon={<TrendingDown />} title="Minimum Value" value={stats.min} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatItem icon={<AccessTime />} title="Total Readings" value={stats.count} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StatItem icon={<CalendarToday />} title="First Reading" value={stats.firstReading} />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatItem icon={<CalendarToday />} title="Last Reading" value={stats.lastReading} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Paper sx={{ p: 2 }}>
        <Typography component="span" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          Trend Analysis
        </Typography>
        <Typography>
          {stats.trend === 'up' && 'Values are trending upward over the period'}
          {stats.trend === 'down' && 'Values are trending downward over the period'}
          {stats.trend === 'stable' && 'Values are relatively stable over the period'}
        </Typography>
      </Paper>
    </Box>
  );
}