import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Avatar,
  Divider,
  IconButton
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { CameraAlt } from '@mui/icons-material';
import React, { useState } from 'react';

interface User {
  name?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
  username?: string;
}

export default function UserProfileForm() {
  const { user } = useAuth() as { user: User };
  const [editableUser, setEditableUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });
  const [avatar, setAvatar] = useState(user?.avatarUrl || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Submit logic here
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

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} mb={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={avatar}
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
              onChange={(e) => setEditableUser({...editableUser, name: e.target.value})}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={editableUser.email}
              onChange={(e) => setEditableUser({...editableUser, email: e.target.value})}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={3}
              value={editableUser.bio}
              onChange={(e) => setEditableUser({...editableUser, bio: e.target.value})}
              variant="outlined"
              placeholder="Tell us about yourself..."
            />
          </Stack>
        </Box>
      </Stack>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          type="submit"
          disabled={isLoading}
          sx={{ px: 4, py: 1.5 }}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  );
}