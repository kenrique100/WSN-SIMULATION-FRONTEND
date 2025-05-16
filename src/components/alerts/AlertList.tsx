import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  IconButton,
  TablePagination
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useQuery } from '@tanstack/react-query';
import { getAlerts } from '@/api/alerts';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState } from 'react';

export default function AlertList() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    data: alertsData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['alerts', page, rowsPerPage],
    queryFn: () => getAlerts(undefined, page, rowsPerPage),
    enabled: isAuthenticated,
    retry: false
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!isAuthenticated) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography>Please login to view alerts</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={2}>
        <Typography color="error">
          {error?.message || 'Failed to load alerts'}
        </Typography>
        <IconButton onClick={() => refetch()}>
          <RefreshIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Message</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alertsData?.content.map((alert) => (
              <TableRow key={alert.alertId}>
                <TableCell>{alert.message}</TableCell>
                <TableCell>
                  {new Date(alert.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={alert.acknowledged ? 'Acknowledged' : 'Pending'}
                    color={alert.acknowledged ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={alert.alertLevel}
                    color={
                      alert.alertLevel === 'CRITICAL' ? 'error' :
                        alert.alertLevel === 'WARNING' ? 'warning' : 'info'
                    }
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={alertsData?.totalElements || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}