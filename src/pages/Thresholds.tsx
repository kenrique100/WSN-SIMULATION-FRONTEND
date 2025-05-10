import { Box } from '@mui/material';
import ThresholdList from '../components/thresholds/ThresholdList';
import PageHeader from '../components/common/PageHeader';

export default function Thresholds() {
    return (
        <Box>
            <PageHeader
                title="Thresholds"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/' },
                    { label: 'Thresholds' }
                ]}
            />
            <ThresholdList />
        </Box>
    );
}