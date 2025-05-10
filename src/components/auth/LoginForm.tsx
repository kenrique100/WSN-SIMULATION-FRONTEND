import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Box, TextField, Button, Typography, Link } from '@mui/material';
import { LoginRequest } from '../../types';

export default function LoginForm() {
    const [formData, setFormData] = useState<LoginRequest>({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(formData);
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
            />
            {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                </Typography>
            )}
            <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
            >
                Login
            </Button>
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                Don't have an account?{' '}
                <Link href="/register" underline="hover">
                    Register
                </Link>
            </Typography>
        </Box>
    );
}