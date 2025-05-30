import {
  Avatar,
  Box,
  Container,
  Paper,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import UserProfileForm from '@/components/settings/UserProfileForm';
import ChangePasswordForm from '@/components/settings/ChangePasswordForm';
import PreferencesForm from '@/components/settings/PreferencesForm';
import PageWrapper from '@/components/layout/PageWrapper';
import { useAuthStore } from '@/store/authStore';

export default function Settings() {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuthStore();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <PageWrapper>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="600" gutterBottom>
            Account Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your profile and security settings
          </Typography>
        </Box>

        <Paper
          sx={{
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              minHeight: '70vh'
            }}
          >
            {/* Sidebar Navigation */}
            <Box
              sx={{
                width: { md: 280 },
                bgcolor: 'background.paper',
                borderRight: { md: '1px solid rgba(0,0,0,0.08)' },
                p: 3
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar
                  src={user?.avatarUrl}
                  sx={{
                    width: 56,
                    height: 56,
                    fontSize: 24,
                    mr: 2,
                    bgcolor: 'primary.main'
                  }}
                >
                  {user?.name?.charAt(0) || user?.username?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography fontWeight="600">
                    {user?.name || user?.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.role}
                  </Typography>
                </Box>
              </Box>

              <Tabs
                orientation="vertical"
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  '& .MuiTabs-indicator': {
                    left: 0,
                    right: 'auto',
                    width: 3,
                    borderRadius: 3
                  }
                }}
              >
                <Tab
                  label="Profile"
                  sx={{
                    alignItems: 'flex-start',
                    fontSize: 15,
                    fontWeight: 500,
                    p: '12px 16px'
                  }}
                />
                <Tab
                  label="Security"
                  sx={{
                    alignItems: 'flex-start',
                    fontSize: 15,
                    fontWeight: 500,
                    p: '12px 16px'
                  }}
                />
                <Tab
                  label="Preferences"
                  sx={{
                    alignItems: 'flex-start',
                    fontSize: 15,
                    fontWeight: 500,
                    p: '12px 16px'
                  }}
                />
              </Tabs>
            </Box>

            {/* Main Content */}
            <Box
              sx={{
                flex: 1,
                p: { xs: 3, md: 5 },
                bgcolor: 'background.default'
              }}
            >
              {activeTab === 0 && <UserProfileForm />}
              {activeTab === 1 && <ChangePasswordForm />}
              {activeTab === 2 && <PreferencesForm />}
            </Box>
          </Box>
        </Paper>
      </Container>
    </PageWrapper>
  );
}