import ThresholdList from '@/components/thresholds/ThresholdList';
import PageHeader from '@/components/common/PageHeader';
import PageWrapper from '@/components/layout/PageWrapper';

export default function Thresholds() {
  return (
    <PageWrapper>
      <PageHeader
        title="Thresholds"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Thresholds' }
        ]}
      />
      <ThresholdList />
    </PageWrapper>
  );
}