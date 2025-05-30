// src/pages/Thresholds.tsx

import { Paper, useTheme } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import ThresholdList from '@/components/thresholds/ThresholdList';
import PageHeader from '@/components/common/PageHeader';
import PageWrapper from '@/components/layout/PageWrapper';

export default function Thresholds() {
  const theme = useTheme();
  const location = useLocation();

  const isChildRouteActive = () => {
    return location.pathname.includes('/new') || location.pathname.includes('/edit');
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Threshold Configuration"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Thresholds' }
        ]}
      />

      <Paper
        sx={{
          p: 3,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Outlet />
        {!isChildRouteActive() && <ThresholdList />}
      </Paper>
    </PageWrapper>
  );
}
