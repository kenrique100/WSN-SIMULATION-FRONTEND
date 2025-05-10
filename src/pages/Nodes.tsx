import { Box, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import NodeList from '../components/nodes/NodeList';
import NodeMap from '../components/nodes/NodeMap';
import PageHeader from '../components/common/PageHeader';

export default function Nodes() {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Box>
            <PageHeader
                title="Nodes"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/' },
                    { label: 'Nodes' }
                ]}
            />

            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="List View" />
                <Tab label="Map View" />
            </Tabs>

            {tabValue === 0 && <NodeList />}
            {tabValue === 1 && <NodeMap />}
        </Box>
    );
}