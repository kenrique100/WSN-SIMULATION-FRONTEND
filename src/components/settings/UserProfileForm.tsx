import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Stack, Alert } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { validatePassword } from '@/utils/validators'; // Adjusted import

export default function UserProfile() {
  const { user, token } = useAuth();  // Removed unused logout
  const [editableUser, setEditableUser] = useState({
    name: user?.name ?? '',  // Use nullish coalescing to ensure fallback value
    email: user?.email ?? '',  // Same here for email
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEditableUser({
        name: user.name ?? '',  // Safely handle undefined
        email: user.email ?? '',  // Safely handle undefined
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (editableUser.password && !validatePassword(editableUser.password)) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (editableUser.password !== editableUser.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user?.userId,
          name: editableUser.name,
          email: editableUser.email,
          password: editableUser.password
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Profile update failed');
      }

      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profile update failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500 }}>
      <Typography variant="h6" gutterBottom>
        User Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Stack spacing={2}>
        <TextField
          required
          fullWidth
          label="Name"
          value={editableUser.name}
          onChange={(e) => setEditableUser({ ...editableUser, name: e.target.value })}
        />

        <TextField
          required
          fullWidth
          label="Email"
          type="email"
          value={editableUser.email}
          onChange={(e) => setEditableUser({ ...editableUser, email: e.target.value })}
          helperText="Please enter a valid email address"
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          value={editableUser.password}
          onChange={(e) => setEditableUser({ ...editableUser, password: e.target.value })}
          helperText="Leave empty if you don't want to change the password"
        />

        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          value={editableUser.confirmPassword}
          onChange={(e) => setEditableUser({ ...editableUser, confirmPassword: e.target.value })}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </Button>
      </Stack>
    </Box>
  );
}
