import { Outlet } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

export default function Layout() {
    const { user } = useAuth();

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Navbar />
            {user && <Sidebar />}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    marginTop: '64px',
                    marginLeft: user ? '240px' : 0,
                    transition: 'margin 0.3s ease'
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}