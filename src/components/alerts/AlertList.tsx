import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Box, Typography, TextField, IconButton,
    Tooltip, Button
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { getAlerts, acknowledgeAlert } from '@/api/alerts';
import { useAuth } from '@/contexts/AuthContext';
import type { Alert } from '@/types';
import { ALERT_LEVELS, ALERT_TYPES } from '@/types/constants';
import AlertTable from '@/components/alerts/AlertTable';

export default function AlertList() {
    const { user } = useAuth();
    const { data: alerts = [], isLoading, error, refetch } = useQuery({
        queryKey: ['alerts'],
        queryFn: getAlerts,
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [showAcknowledged, setShowAcknowledged] = useState(false);

    const handleAcknowledge = async (alertId: number) => {
        if (user?.userId) {
            await acknowledgeAlert(alertId, user.userId);
            await refetch();
        }
    };

    const filteredAlerts = alerts.filter((alert: Alert) => {
        const matchesSearch =
          alert.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ALERT_LEVELS.find(l => l.value === alert.alertLevel)?.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ALERT_TYPES.find(t => t.value === alert.type)?.label.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesAcknowledged = showAcknowledged || !alert.acknowledged;
        return matchesSearch && matchesAcknowledged;
    });

    if (isLoading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">Error loading alerts</Typography>;

    return (
      <Box sx={{ p: 3 }}>
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
                      {showAcknowledged ? 'Hide Acknowledged' : 'Show All'}
                  </Button>
                  <Tooltip title="Refresh">
                      <IconButton onClick={() => refetch()}>
                          <Refresh />
                      </IconButton>
                  </Tooltip>
              </Box>
          </Box>

          <AlertTable alerts={filteredAlerts} onAcknowledge={handleAcknowledge} />
      </Box>
    );
}
