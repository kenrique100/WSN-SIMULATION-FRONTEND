import { useQuery } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getAlertStats } from '@/api/alerts';

const COLORS = ['#FF4C4C', '#FFA500', '#00BFFF', '#8BC34A'];

export default function AlertStatusChart() {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['alertStats'],
        queryFn: getAlertStats,
    });

    if (isLoading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">Error loading alert statistics</Typography>;
    }

    const chartData = [
        { name: 'Critical', value: stats?.critical || 0 },
        { name: 'Warning', value: stats?.warning || 0 },
        { name: 'Info', value: stats?.info || 0 },
        { name: 'Acknowledged', value: stats?.acknowledged || 0 },
    ];

    return (
      <Box sx={{ height: 300 }}>
          <Typography variant="h6" align="center" gutterBottom>
              Alert Status Distribution
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
              </PieChart>
          </ResponsiveContainer>
      </Box>
    );
}
