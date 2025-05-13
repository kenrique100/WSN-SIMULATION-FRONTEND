import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { User, Role } from '@/types';

const UserManagementPage: React.FC = () => {
  const { user, token, createUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: Role.VIEWER
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      const fetchData = async () => {
        await fetchUsers();
      };
      fetchData();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const handleCreateUser = async () => {
    try {
      await createUser(newUser);
      setOpenCreateDialog(false);
      await fetchUsers();
      setNewUser({
        username: '',
        email: '',
        password: '',
        role: Role.VIEWER
      });
    } catch (err) {
      setError('Failed to create user');
    }
  };

  const handleActivateUser = async (userId: number) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}/activate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchUsers();
    } catch (err) {
      setError('Failed to activate user');
    }
  };

  const handleDeactivateUser = async (userId: number) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}/deactivate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchUsers();
    } catch (err) {
      setError('Failed to deactivate user');
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          You don't have permission to access this page.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenCreateDialog(true)}
        sx={{ mb: 3 }}
      >
        Create New User
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.enabled ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  {user.enabled ? (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDeactivateUser(user.userId)}
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleActivateUser(user.userId)}
                    >
                      Activate
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={newUser.role}
              label="Role"
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}
            >
              <MenuItem value={Role.ADMIN}>Admin</MenuItem>
              <MenuItem value={Role.OPERATOR}>Operator</MenuItem>
              <MenuItem value={Role.VIEWER}>Viewer</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} color="primary">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagementPage;