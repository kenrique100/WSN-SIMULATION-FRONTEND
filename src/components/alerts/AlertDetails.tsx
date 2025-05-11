import { Box, Typography, Paper, Chip, Divider, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAlertDetails } from '@/api/alerts';
import { formatDate } from '@/types/helpers';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AlertDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const alertId = Number(id); // Ensure it's a number
    const { data: alert, isLoading, error } = useQuery({
        queryKey: ['alert', alertId],
        queryFn: () => getAlertDetails(alertId),
        enabled: !isNaN(alertId), // Prevent query if id is not valid
    });

    if (isLoading) return <Typography>Loading...</Typography>;
    if (error || !alert) return <Typography color="error">Error loading alert</Typography>;

    return (
      <Box sx={{ p: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 2 }}
          >
              Back to Alerts
          </Button>

          <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h5">Alert Details</Typography>
                  <Chip
                    label={alert.alertLevel.toUpperCase()}
                    color={alert.alertLevel === 'danger' ? 'error' : 'warning'}
                  />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                  <DetailItem label="Node ID" value={alert.nodeId} />
                  <DetailItem label="Sensor ID" value={alert.sensorId} />
                  <DetailItem label="Type" value={alert.type} />
                <DetailItem label="Timestamp" value={formatDate(new Date(alert.timestamp))} />
                <DetailItem label="Acknowledged" value={alert.acknowledged ? 'Yes' : 'No'} />
                  {alert.acknowledged && (
                    <>
                        <DetailItem label="Acknowledged By" value={alert.acknowledgedBy?.toString()} />
                        <DetailItem label="Acknowledged At" value={formatDate(new Date(alert.acknowledgedAt!))} />
                    </>
                  )}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box>
                  <Typography variant="subtitle1" gutterBottom>Message</Typography>
                  <Typography>{alert.message || 'No message provided'}</Typography>
              </Box>
          </Paper>
      </Box>
    );
}

function DetailItem({ label, value }: { label: string; value?: string | number }) {
    return (
      <Box>
          <Typography variant="subtitle2" color="textSecondary">{label}</Typography>
          <Typography variant="body1">{value ?? '-'}</Typography>
      </Box>
    );
}
