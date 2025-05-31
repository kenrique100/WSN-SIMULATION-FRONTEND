import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Avatar,
  IconButton
} from '@mui/material';
import { Role, UserResponse } from '@/types';
import { CameraAlt } from '@mui/icons-material';

interface UserEditDialogProps {
  open: boolean;
  onClose: () => void;
  user: UserResponse;
  onSave: (user: UserResponse) => void;
}

const UserEditDialog: React.FC<UserEditDialogProps> = ({
                                                         open,
                                                         onClose,
                                                         user: initialUser,
                                                         onSave
                                                       }) => {
  const [user, setUser] = useState<UserResponse>(initialUser);
  const [avatar, setAvatar] = useState(initialUser.avatarUrl || '');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
          setUser({ ...user, avatarUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    onSave(user);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" mb={3} mt={2}>
          <Box position="relative">
            <Avatar
              src={avatar}
              sx={{ width: 80, height: 80, fontSize: 32 }}
            >
              {user.name?.charAt(0) || user.username?.charAt(0)}
            </Avatar>
            <IconButton
              component="label"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'background.paper'
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
        </Box>

        <TextField
          margin="normal"
          label="Username"
          fullWidth
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          disabled
        />

        <TextField
          margin="normal"
          label="Name"
          fullWidth
          value={user.name || ''}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />

        <TextField
          margin="normal"
          label="Email"
          type="email"
          fullWidth
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            value={user.role}
            label="Role"
            onChange={(e) => setUser({ ...user, role: e.target.value as Role })}
          >
            <MenuItem value={Role.ADMIN}>
              <Chip label="Admin" color="primary" size="small" />
            </MenuItem>
            <MenuItem value={Role.OPERATOR}>
              <Chip label="Operator" color="secondary" size="small" />
            </MenuItem>
            <MenuItem value={Role.VIEWER}>
              <Chip label="Viewer" size="small" />
            </MenuItem>
          </Select>
        </FormControl>

        <Box mt={2}>
          <Chip
            label={user.enabled ? 'Active' : 'Inactive'}
            color={user.enabled ? 'success' : 'error'}
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserEditDialog;