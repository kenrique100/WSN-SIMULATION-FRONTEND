import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AlertStats } from '@/types';

const COLORS = ['#FF4C4C', '#FFA500', '#00BFFF', '#8BC34A'];

interface AlertStatusChartProps {
  stats?: AlertStats;
}

export default function AlertStatusChart({ stats }: AlertStatusChartProps) {
  if (!stats) {
    return (
      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>No data available</Typography>
      </Box>
    );
  }

  const chartData = [
    { name: 'Critical', value: stats.critical },
    { name: 'Warning', value: stats.warning },
    { name: 'Info', value: stats.info },
    { name: 'Acknowledged', value: stats.acknowledged },
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