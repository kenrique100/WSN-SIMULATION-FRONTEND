import { Box } from '@mui/material';
import NetworkGraph from '../components/topology/NetworkGraph';
import PageHeader from '../components/common/PageHeader';

export default function Topology() {
    return (
        <Box>
            <PageHeader
                title="Network Topology"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/' },
                    { label: 'Topology' }
                ]}
            />
            <NetworkGraph />
        </Box>
    );
}