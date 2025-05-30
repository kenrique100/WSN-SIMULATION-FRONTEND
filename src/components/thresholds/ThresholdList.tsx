import { useQuery } from '@tanstack/react-query';
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
  Button,
  IconButton,
  CircularProgress,
  TableFooter,
  TablePagination,
  LinearProgress
} from '@mui/material';
import { getThresholds } from '@/api/thresholds';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { useNotification } from '@/contexts/NotificationContext';
import React, { useState, useMemo } from 'react';

interface ThresholdResponse {
  thresholdId: number;
  sensorTypeId: number;
  sensorTypeName: string;
  infoLevel: number;
  warningLevel: number;
  dangerLevel: number;
  updatedBy: number;
  updatedByRole?: string;
}

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  last: boolean;
}

export default function ThresholdList() {
  const { showNotification } = useNotification();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const {
    data: thresholdsData = { content: [], totalElements: 0 },
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery<PaginatedResponse<ThresholdResponse>>({
    queryKey: ['thresholds', page, size],
    queryFn: () => getThresholds(page, size),
    staleTime: 5000,
    retry: 2,
  });

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(() => {
    return thresholdsData.content || [];
  }, [thresholdsData]);

  if (isError) {
    showNotification(`Error loading thresholds: ${error?.message || 'Unknown error'}`, 'error');
    return (
      <Box sx={{ color: 'error.main', p: 2 }}>
        Failed to load thresholds. Please try again later.
      </Box>
    );
  }

  return (
    <Box position="relative">
      {isFetching && (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1
          }}
        />
      )}

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <Typography variant="h5">Thresholds</Typography>
        <Button
          component={Link}
          to="/thresholds/new"
          variant="contained"
          disabled={isLoading}
        >
          Add New Threshold
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          position: 'relative',
          minHeight: visibleRows.length === 0 ? 200 : undefined
        }}
      >
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            p={4}
            minHeight={200}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sensor Type</TableCell>
                  <TableCell align="right">Info Level</TableCell>
                  <TableCell align="right">Warning Level</TableCell>
                  <TableCell align="right">Danger Level</TableCell>
                  <TableCell>Updated By</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((threshold: ThresholdResponse) => (
                  <TableRow key={threshold.thresholdId}>
                    <TableCell>
                      {threshold.sensorTypeName || 'N/A'} (ID: {threshold.sensorTypeId})
                    </TableCell>
                    <TableCell align="right">
                      {threshold.infoLevel?.toFixed(2) || 'N/A'}
                    </TableCell>
                    <TableCell align="right">
                      {threshold.warningLevel?.toFixed(2) || 'N/A'}
                    </TableCell>
                    <TableCell align="right">
                      {threshold.dangerLevel?.toFixed(2) || 'N/A'}
                    </TableCell>
                    <TableCell>
                      User #{threshold.updatedBy} {threshold.updatedByRole ? `(${threshold.updatedByRole})` : ''}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        component={Link}
                        to={`/thresholds/${threshold.thresholdId}/edit`}
                        disabled={isFetching}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  count={thresholdsData.totalElements || 0}
                  rowsPerPage={size}
                  page={page}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleSizeChange}
                  disabled={isLoading || isFetching}
                />
              </TableRow>
            </TableFooter>
          </>
        )}
      </TableContainer>
    </Box>
  );
}