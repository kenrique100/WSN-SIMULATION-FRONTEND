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
  useTheme,
  Pagination
} from '@mui/material';
import { Role, UserResponse } from '@/types';
import {
  createUser,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  updateUser
} from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import PageWrapper from '@/components/layout/PageWrapper';
import PageHeader from '@/components/common/PageHeader';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UserEditDialog from '@/components/settings/UserEditDialog';

const UserManagementPage: React.FC = () => {
  const theme = useTheme();
  const { user, hasRole } = useAuthStore();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    role: Role.VIEWER
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const users = await getAllUsers(page, size);
      setUsers(users);
      setTotalPages(Math.ceil(users.length / size) || 1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasRole(Role.ADMIN)) {
      const loadUsers = async () => {
        try {
          await fetchUsers();
        } catch (error) {
          console.error('Failed to fetch users:', error);
        }
      };
      loadUsers();
    }
  }, [page, size, user, hasRole]);

  const handleCreateUser = async () => {
    setIsLoading(true);
    try {
      await createUser(newUser);
      setOpenCreateDialog(false);
      setSnackbarMessage(`User ${newUser.username} created successfully`);
      setSnackbarOpen(true);
      await fetchUsers();
      setNewUser({
        username: '',
        email: '',
        password: '',
        name: '',
        role: Role.VIEWER
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (userId: number, active: boolean) => {
    try {
      await updateUserStatus(userId, active);
      setSnackbarMessage(`User ${active ? 'activated' : 'deactivated'} successfully`);
      setSnackbarOpen(true);
      await fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user status';
      setError(errorMessage);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      setSnackbarMessage('User deleted successfully');
      setSnackbarOpen(true);
      await fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
    }
  };

  const handleEditUser = (user: UserResponse) => {
    setSelectedUser(user);
    setOpenEditDialog(true);
  };

  const handleSaveUser = async (updatedUser: UserResponse) => {
    try {
      await updateUser(updatedUser.userId, {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatarUrl
      });
      setSnackbarMessage('User updated successfully');
      setSnackbarOpen(true);
      setOpenEditDialog(false);
      await fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
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
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                    <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
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
                      <TableCell>{user.name}</TableCell>
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
                        <Box display="flex" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditUser(user)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color={user.enabled ? 'error' : 'success'}
                            onClick={() => handleStatusChange(user.userId, !user.enabled)}
                          >
                            {user.enabled ? (
                              <DeleteIcon fontSize="small" />
                            ) : (
                              <RefreshIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={(_, newPage) => setPage(newPage - 1)}
                color="primary"
              />
            </Box>
          </>
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
            label="Name"
            type="text"
            fullWidth
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            disabled={isLoading}
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
            onClick={handleCreateUser}
            color="primary"
            variant="contained"
            disabled={
              isLoading ||
              !newUser.username ||
              !newUser.email ||
              !newUser.password
            }
          >
            {isLoading ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>

      {selectedUser && (
        <UserEditDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          user={selectedUser}
          onSave={handleSaveUser}
        />
      )}

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