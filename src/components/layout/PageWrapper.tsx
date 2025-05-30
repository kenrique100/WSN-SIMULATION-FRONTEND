import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useAppStore } from '@/store';
import React from 'react';
import { useAuthStore } from '@/store/authStore';

interface PageWrapperProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export default function PageWrapper({ children, fullWidth = false }: PageWrapperProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen } = useAppStore();
  const { isAuthenticated } = useAuthStore();

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        pt: { xs: '80px', md: '96px' },
        marginLeft: isAuthenticated && sidebarOpen && !isMobile ? '240px' : 0,
        transition: theme.transitions.create(['margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        maxWidth: fullWidth ? 'none' : '1600px',
        mx: fullWidth ? 0 : 'auto',
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      {children}
    </Box>
  );
}