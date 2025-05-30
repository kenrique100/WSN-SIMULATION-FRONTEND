import {
  Avatar,
  Box,
  Container,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme
} from '@mui/material';
import React, { useState } from 'react';
import UserProfileForm from '@/components/settings/UserProfileForm';
import ChangePasswordForm from '@/components/settings/ChangePasswordForm';
import PreferencesForm from '@/components/settings/PreferencesForm';
import PageWrapper from '@/components/layout/PageWrapper';
import { useAuthStore } from '@/store/authStore';
import { Person, Lock, Settings as SettingsIcon } from '@mui/icons-material';

export default function Settings() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuthStore();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <PageWrapper>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Account Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your profile and security preferences
          </Typography>
        </Box>

        <Paper
          sx={{
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[1],
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
                borderRight: { md: `1px solid ${theme.palette.divider}` },
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
                  <Typography fontWeight={600}>
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
                TabIndicatorProps={{
                  sx: {
                    left: 0,
                    width: 3,
                    borderRadius: theme.shape.borderRadius,
                    backgroundColor: theme.palette.primary.main
                  }
                }}
                sx={{
                  alignItems: 'flex-start'
                }}
              >
                {[
                  { label: 'Profile', icon: <Person fontSize="small" /> },
                  { label: 'Security', icon: <Lock fontSize="small" /> },
                  { label: 'Preferences', icon: <SettingsIcon fontSize="small" /> }
                ].map((tab, index) => (
                  <Tab
                    key={tab.label}
                    label={tab.label}
                    icon={tab.icon}
                    iconPosition="start"
                    sx={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      alignItems: 'center',
                      fontSize: 15,
                      fontWeight: 500,
                      px: 2,
                      py: 1.5,
                      minHeight: 'auto',
                      '&.Mui-selected': {
                        color: theme.palette.primary.main
                      }
                    }}
                  />
                ))}
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
