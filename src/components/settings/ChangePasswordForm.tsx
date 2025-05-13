import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  Divider
} from '@mui/material';
import React, { useState } from 'react';

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Validation and submission logic
    } catch (err) {
      setError('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" fontWeight="600" gutterBottom>
        Password & Security
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Change your password and manage security settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Stack spacing={3} maxWidth={600}>
        <TextField
          fullWidth
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          variant="outlined"
        />

        <TextField
          fullWidth
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          variant="outlined"
          helperText="Minimum 8 characters with at least one number and special character"
        />

        <TextField
          fullWidth
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          variant="outlined"
        />
      </Stack>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Last changed: 3 months ago
        </Typography>
        <Button
          variant="contained"
          type="submit"
          disabled={isLoading}
          sx={{ px: 4, py: 1.5 }}
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </Button>
      </Box>
    </Box>
  );
}