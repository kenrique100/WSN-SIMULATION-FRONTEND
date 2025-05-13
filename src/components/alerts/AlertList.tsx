import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Box, Typography, TextField, IconButton,
    Tooltip, Button, CircularProgress, Alert as MuiAlert,
    Paper
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { getAlerts, acknowledgeAlert } from '@/api/alerts';
import AlertTable from '@/components/alerts/AlertTable';
import { useAuth } from '@/contexts/AuthContext';

export default function AlertList() {
    const { user } = useAuth();
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAcknowledged, setShowAcknowledged] = useState(false);

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching
    } = useQuery({
        queryKey: ['alerts', page, size, showAcknowledged],
        queryFn: () => getAlerts(showAcknowledged ? undefined : false, page, size),
        retry: 1,
    });

    const handleAcknowledge = async (alertId: number) => {
        if (user?.userId) {
            try {
                await acknowledgeAlert(alertId, user.userId);
                await refetch();
            } catch (error) {
                console.error('Failed to acknowledge alert:', error);
            }
        }
    };

    const filteredAlerts = data?.content?.filter(alert =>
      alert.message?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (isLoading) {
        return (
          <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
          </Box>
        );
    }

    if (isError && !data) {
        return (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
              <MuiAlert severity="error" sx={{ mb: 2 }}>
                  {error.message}
              </MuiAlert>
              <Typography variant="h6" gutterBottom>
                  Offline Mode
              </Typography>
              <Typography sx={{ mb: 2 }}>
                  Unable to connect to the server. Displaying limited functionality.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={() => refetch()}
                disabled={isRefetching}
              >
                  Retry Connection
              </Button>
          </Paper>
        );
    }

    return (
      <Box sx={{ p: 3 }}>
          {isError && (
            <MuiAlert severity="warning" sx={{ mb: 2 }}>
                Connection issues detected. Some data may be outdated.
            </MuiAlert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5">Alerts</Typography>
              <Box>
                  <TextField
                    size="small"
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mr: 2 }}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => setShowAcknowledged(!showAcknowledged)}
                    sx={{ mr: 2 }}
                  >
                      {showAcknowledged ? 'Hide Acknowledged' : 'Show Only Pending'}
                  </Button>
                  <Tooltip title="Refresh">
                      <IconButton onClick={() => refetch()} disabled={isRefetching}>
                          <Refresh />
                      </IconButton>
                  </Tooltip>
              </Box>
          </Box>

          <AlertTable
            alerts={filteredAlerts}
            onAcknowledge={handleAcknowledge}
            totalElements={data?.totalElements || 0}
            page={page}
            size={size}
            onPageChange={setPage}
          />
      </Box>
    );
}