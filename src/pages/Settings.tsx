import { Box, Tabs, Tab, Paper } from '@mui/material';
import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import UserProfileForm from '../components/settings/UserProfileForm';
import ChangePasswordForm from '../components/settings/ChangePasswordForm';

export default function Settings() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <PageHeader
        title="Settings"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Settings' }
        ]}
      />

      <Paper sx={{ p: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Profile" />
          <Tab label="Change Password" />
        </Tabs>

        {tabValue === 0 && <UserProfileForm />}
        {tabValue === 1 && <ChangePasswordForm />}
      </Paper>
    </Box>
  );
}