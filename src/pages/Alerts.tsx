import { Box } from '@mui/material';
import AlertList from '../components/alerts/AlertList';
import PageHeader from '../components/common/PageHeader';

export default function Alerts() {
    return (
        <Box>
            <PageHeader
                title="Alerts"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/' },
                    { label: 'Alerts' }
                ]}
            />
            <AlertList />
        </Box>
    );
}