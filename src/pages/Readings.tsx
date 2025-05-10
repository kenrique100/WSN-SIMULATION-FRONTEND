import { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import ReadingChart from '../components/readings/ReadingChart';
import ReadingStats from '../components/readings/ReadingStats';

export default function Readings() {
    const { sensorId, nodeId } = useParams();
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Sensor Readings
            </Typography>

            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Chart" />
                <Tab label="Statistics" />
            </Tabs>

            {tabValue === 0 && (
                <ReadingChart sensorId={sensorId ? parseInt(sensorId) : undefined}
                              nodeId={nodeId ? parseInt(nodeId) : undefined} />
            )}

            {tabValue === 1 && (
                <ReadingStats sensorId={sensorId ? parseInt(sensorId) : undefined}
                              nodeId={nodeId ? parseInt(nodeId) : undefined} />
            )}
        </Box>
    );
}