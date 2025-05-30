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
  const { isAuthenticated } = useAuthStore();

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

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {isAuthenticated && <Sidebar />}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            ...(sidebarOpen && !isMobile && isAuthenticated && {
              ml: '240px',
              width: 'calc(100% - 240px)',
            }),
            p: { xs: 2, md: 3 },
            pt: { xs: '80px', md: '96px' },
          }}
        >
          <Outlet />
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}