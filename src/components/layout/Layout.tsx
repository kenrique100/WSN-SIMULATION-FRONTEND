import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, useMediaQuery } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAppStore } from '@/store';
import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useAuthStore } from '@/store/authStore';

export default function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const { user, isAuthenticated } = useAuthStore();
  const isDev = import.meta.env.MODE === 'development';

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile, setSidebarOpen]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <CssBaseline />
      <Navbar />

      <Box sx={{ display: 'flex', flexGrow: 1, width: '100%' }}>
        {(isAuthenticated || isDev) && <Sidebar />}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            ...(sidebarOpen && !isMobile && (isAuthenticated || isDev) && {
              ml: '240px',
            }),
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              px: { xs: 2, md: 3 },
              pt: { xs: '80px', md: '96px' },
              pb: 4,
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}