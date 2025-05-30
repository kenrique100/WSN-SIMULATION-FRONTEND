import React, { useState, useEffect } from 'react';
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
  Snackbar,
  Chip,
  IconButton,
  useTheme
} from '@mui/material';
import { Role, UserResponse } from '@/types';
import { createUser, getAllUsers, activateUser, deactivateUser } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import PageWrapper from '@/components/layout/PageWrapper';
import PageHeader from '@/components/common/PageHeader';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

interface User extends UserResponse {
  enabled: boolean;
}

const UserManagementPage: React.FC = () => {
  const theme = useTheme();
  const { user, logout, hasRole } = useAuthStore();
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
      const mappedUsers = usersData.map(user => ({
        ...user,
        enabled: user.enabled ?? true
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
    if (hasRole(Role.ADMIN)) {
      void fetchUsers();
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

  if (!hasRole(Role.ADMIN)) {
    return (
      <PageWrapper>
        <Alert severity="error" sx={{ m: 3 }}>
          You don't have permission to access this page.
        </Alert>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader
        title="User Management"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Users' }
        ]}
        action={
          <>
            <IconButton onClick={() => fetchUsers()} sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateDialog(true)}
            >
              New User
            </Button>
          </>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper
        sx={{
          p: 3,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {isLoading && users.length === 0 ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                  <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.userId}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={
                          user.role === Role.ADMIN
                            ? 'primary'
                            : user.role === Role.OPERATOR
                              ? 'secondary'
                              : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.enabled ? 'Active' : 'Inactive'}
                        color={user.enabled ? 'success' : 'error'}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {user.enabled ? (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => void handleDeactivateUser(user.userId)}
                          disabled={isLoading}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          color="success"
                          size="small"
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
      </Paper>

      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Username"
            type="text"
            fullWidth
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            disabled={isLoading}
            required
          />
          <TextField
            margin="normal"
            label="Email"
            type="email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            disabled={isLoading}
            required
          />
          <TextField
            margin="normal"
            label="Password"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            disabled={isLoading}
            required
          />
          <FormControl fullWidth margin="normal" required>
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
            variant="contained"
            disabled={isLoading || !newUser.username || !newUser.email || !newUser.password}
          >
            {isLoading ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageWrapper>
  );
};

export default UserManagementPage;