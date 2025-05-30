// src/components/readings/ReadingStats.tsx
import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Stack,
  Divider,
  Typography,
  Alert,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getReadingStats } from '@/api/readings';
import {
  AccessTime,
  TrendingUp,
  TrendingDown,
  Straighten,
  CalendarToday,
} from '@mui/icons-material';
import Loading from '@/components/common/Loading';
import { useNotification } from '@/contexts/NotificationContext';
import type { ReadingStats } from '@/types';

interface ReadingStatsProps {
  sensorId?: number;
  nodeId?: number;
  hours?: number;
}

const ReadingStats: React.FC<ReadingStatsProps> = ({ sensorId, nodeId, hours = 24 }) => {
  const { showNotification } = useNotification();

  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useQuery<ReadingStats, Error>({
    queryKey: ['readingStats', sensorId, nodeId, hours],
    queryFn: () => getReadingStats(sensorId, nodeId, hours),
  });

  React.useEffect(() => {
    if (isError && error) {
      showNotification(`Error loading statistics: ${error.message}`, 'error');
    }
  }, [isError, error, showNotification]);

  if (isLoading) return <Loading />;
  if (isError) return <Alert severity="error">{error?.message || 'Error loading statistics'}</Alert>;

  const StatItem = ({
                      icon,
                      title,
                      value,
                    }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
  }) => (
    <Paper
      elevation={1}
      sx={{
        p: 2.5,
        borderRadius: 3,
        height: '100%',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 6,
          transform: 'scale(1.02)',
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ color: 'primary.main', fontSize: 28 }}>{icon}</Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Reading Statistics (Last {hours} hours)
      </Typography>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatItem icon={<Straighten />} title="Average Value" value={stats?.average?.toFixed(2) || 'N/A'} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatItem icon={<TrendingUp />} title="Maximum Value" value={stats?.max?.toFixed(2) || 'N/A'} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatItem icon={<TrendingDown />} title="Minimum Value" value={stats?.min?.toFixed(2) || 'N/A'} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatItem icon={<AccessTime />} title="Total Readings" value={stats?.count || 0} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <StatItem
            icon={<CalendarToday />}
            title="First Reading"
            value={stats?.firstReading ? new Date(stats.firstReading).toLocaleString() : 'N/A'}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatItem
            icon={<CalendarToday />}
            title="Last Reading"
            value={stats?.lastReading ? new Date(stats.lastReading).toLocaleString() : 'N/A'}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 3,
          transition: 'box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: 6,
          },
        }}
      >
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Trend Analysis
        </Typography>
        <Typography variant="body1">
          {stats?.trend === 'up' && 'Values are trending upward over the period'}
          {stats?.trend === 'down' && 'Values are trending downward over the period'}
          {stats?.trend === 'stable' && 'Values are relatively stable over the period'}
          {!stats?.trend && 'No trend data available'}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ReadingStats;