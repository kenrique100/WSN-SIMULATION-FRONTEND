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
import { NodeStats } from '@/types';

interface NodeStatusChartProps {
    stats?: NodeStats;
}

export default function NodeStatusChart({ stats }: NodeStatusChartProps) {
    if (!stats) {
        return (
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography>No data available</Typography>
          </Box>
        );
    }

    const chartData = [
        { name: 'Active', value: stats.active },
        { name: 'Inactive', value: stats.inactive },
        { name: 'Maintenance', value: stats.maintenance || 0 },
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
                  <Bar
                    dataKey="value"
                    fill="#8884d8"
                    name="Node Count"
                    radius={[4, 4, 0, 0]}
                  />
              </BarChart>
          </ResponsiveContainer>
      </Box>
    );
}