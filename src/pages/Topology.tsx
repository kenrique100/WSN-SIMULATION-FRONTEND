import { Box } from '@mui/material';
import NetworkGraph from '@/components/topology/NetworkGraph';
import PageHeader from '@/components/common/PageHeader';
import PageWrapper from '@/components/layout/PageWrapper';

export default function Topology() {
  return (
    <Box>
      <PageWrapper>
      <PageHeader
        title="Network Topology"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Topology' },
        ]}
      />
      <NetworkGraph />
      </PageWrapper>
    </Box>
  );
}
