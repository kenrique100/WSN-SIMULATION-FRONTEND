import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { Role, UserResponse } from '@/types';
import { createUser, getAllUsers, activateUser, deactivateUser } from '@/api/auth';

interface User extends UserResponse {
  enabled: boolean;
}

const UserManagementPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: Role.VIEWER
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const usersData = await getAllUsers();
      // Map the UserResponse to User type with enabled field
      const mappedUsers = usersData.map(user => ({
        ...user,
        enabled: user.enabled ?? true // Default to true if undefined
      }));
      setUsers(mappedUsers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      if (errorMessage.includes('Unauthorized')) {
        await logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === Role.ADMIN) {
      void fetchUsers(); // Explicitly void the promise
    }
  }, [user]);

  const handleCreateUser = async () => {
    setIsLoading(true);
    try {
      const createdUser = await createUser(newUser);
      setOpenCreateDialog(false);
      setSnackbarMessage(`User ${createdUser.username} created successfully`);
      setSnackbarOpen(true);
      await fetchUsers();
      setNewUser({
        username: '',
        email: '',
        password: '',
        role: Role.VIEWER
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateUser = async (userId: number) => {
    try {
      await activateUser(userId);
      setSnackbarMessage('User activated successfully');
      setSnackbarOpen(true);
      await fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to activate user';
      setError(errorMessage);
    }
  };

  const handleDeactivateUser = async (userId: number) => {
    try {
      await deactivateUser(userId);
      setSnackbarMessage('User deactivated successfully');
      setSnackbarOpen(true);
      await fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deactivate user';
      setError(errorMessage);
    }
  };

  if (user?.role !== Role.ADMIN) {
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
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenCreateDialog(true)}
        sx={{ mb: 3 }}
        disabled={isLoading}
      >
        Create New User
      </Button>

      {isLoading && users.length === 0 ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
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
                        onClick={() => void handleDeactivateUser(user.userId)}
                        disabled={isLoading}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => void handleActivateUser(user.userId)}
                        disabled={isLoading}
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
      )}

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
            disabled={isLoading}
            required
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            disabled={isLoading}
            required
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            disabled={isLoading}
            required
          />
          <FormControl fullWidth margin="dense" required>
            <InputLabel>Role</InputLabel>
            <Select
              value={newUser.role}
              label="Role"
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}
              disabled={isLoading}
            >
              <MenuItem value={Role.ADMIN}>Admin</MenuItem>
              <MenuItem value={Role.OPERATOR}>Operator</MenuItem>
              <MenuItem value={Role.VIEWER}>Viewer</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={() => void handleCreateUser()}
            color="primary"
            disabled={isLoading || !newUser.username || !newUser.email || !newUser.password}
          >
            {isLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default UserManagementPage;