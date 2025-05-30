import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useAppStore } from '@/store';
import React from 'react';
import { useAuthStore } from '@/store/authStore';

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen } = useAppStore();
  const { isAuthenticated } = useAuthStore();

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        marginTop: '-40px',
        marginLeft: (isAuthenticated || import.meta.env.DEV) && sidebarOpen && !isMobile ? '230px' : 0,
        transition: theme.transitions.create(['margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      {children}
    </Box>
  );
}