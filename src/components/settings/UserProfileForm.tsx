import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Avatar,
  Divider,
  IconButton,
  Alert
} from '@mui/material';
import { CameraAlt } from '@mui/icons-material';
import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { updateProfile } from '@/api/auth';

export default function UserProfileForm() {
  const { user, setUser } = useAuthStore();
  const [editableUser, setEditableUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatarUrl: user?.avatarUrl || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditableUser({
            ...editableUser,
            avatarUrl: event.target.result as string
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedUser = await updateProfile({
        name: editableUser.name,
        email: editableUser.email,
        avatarUrl: editableUser.avatarUrl
      });
      setUser(updatedUser);
      setSuccess('Profile updated successfully');
      setError('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      setSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" fontWeight="600" gutterBottom>
        Profile Information
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Update your personal details and profile picture
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} mb={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={editableUser.avatarUrl}
              sx={{
                width: 120,
                height: 120,
                fontSize: 48,
                mb: 1
              }}
            >
              {user?.name?.charAt(0) || user?.username?.charAt(0)}
            </Avatar>
            <IconButton
              component="label"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 0,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'background.default' }
              }}
            >
              <CameraAlt fontSize="small" />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </IconButton>
          </Box>
          <Typography variant="caption" color="text.secondary">
            JPG, GIF or PNG. Max 2MB
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Full Name"
              value={editableUser.name}
              onChange={(e) => setEditableUser({
                ...editableUser,
                name: e.target.value
              })}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={editableUser.email}
              onChange={(e) => setEditableUser({
                ...editableUser,
                email: e.target.value
              })}
              variant="outlined"
              required
            />
          </Stack>
        </Box>
      </Stack>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          type="submit"
          disabled={isLoading ||
            (!editableUser.name && !editableUser.email && !editableUser.avatarUrl) ||
            (editableUser.name === user?.name &&
              editableUser.email === user?.email &&
              editableUser.avatarUrl === user?.avatarUrl)
          }
          sx={{ px: 4, py: 1.5 }}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  );
}