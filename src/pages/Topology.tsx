import NetworkGraph from '@/components/topology/NetworkGraph';
import PageHeader from '@/components/common/PageHeader';
import PageWrapper from '@/components/layout/PageWrapper';

export default function TopologyPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Network Topology"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Network Topology' },
        ]}
      />
      <NetworkGraph />
    </PageWrapper>
  );
}