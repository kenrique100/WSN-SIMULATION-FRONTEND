/*
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { LoginRequest } from '@/types';

export default function Login() {
    const { isAuthenticated } = useAuth();
    const [formData, setFormData] = useState<LoginRequest>({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(formData.username, formData.password);
            navigate('/');
        } catch (err) {
            setError('Invalid username or password');
        }
    };
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

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
                  Login
              </Typography>
              {error && (
                <Typography color="error" align="center" gutterBottom>
                    {error}
                </Typography>
              )}
              <form onSubmit={handleSubmit}>
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
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{ mt: 2 }}
                  >
                      Login
                  </Button>
              </form>
          </Paper>
      </Box>
    );
}*/
