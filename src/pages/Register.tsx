import { Box, Paper, Typography } from '@mui/material';
import RegisterForm from '../components/auth/RegisterForm';

export default function Register() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                bgcolor: 'background.default'
            }}
        >
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Register
                </Typography>
                <RegisterForm />
            </Paper>
        </Box>
    );
}