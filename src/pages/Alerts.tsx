import AlertList from '@/components/alerts/AlertList';
import PageHeader from '@/components/common/PageHeader';
import PageWrapper from '@/components/layout/PageWrapper';

export default function Alerts() {
  return (
    <PageWrapper>
      <PageHeader
        title="Alerts"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Alerts' }
        ]}
      />
      <AlertList />
    </PageWrapper>
  );
}