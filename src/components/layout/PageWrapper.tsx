// src/components/layout/PageWrapper.tsx
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useAppStore } from '@/store';
import { useAuth } from '@/contexts/AuthContext';
import { IS_DEV } from '@/config';
import React from 'react';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen } = useAppStore();
  const { user } = useAuth();

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        marginTop: '-40px',
        marginLeft: (user || IS_DEV) && sidebarOpen && !isMobile ? '-230px' : 0,
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