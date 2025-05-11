import { useQuery } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { getNodeStatusStats } from '@/api/nodes';

export default function NodeStatusChart() {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['nodeStatusStats'],
        queryFn: getNodeStatusStats,
    });

    if (isLoading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">Error loading node statistics</Typography>;

    const chartData = [
        { name: 'Online', value: stats?.online || 0 },
        { name: 'Offline', value: stats?.offline || 0 },
        { name: 'Warning', value: stats?.warning || 0 },
    ];

    return (
      <Box sx={{ height: 300 }}>
          <Typography variant="h6" align="center" gutterBottom>
              Node Status Distribution
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
              <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Node Count" />
              </BarChart>
          </ResponsiveContainer>
      </Box>
    );
}
