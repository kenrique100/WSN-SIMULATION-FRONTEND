import { Box, Typography, Paper, Chip, Divider, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAlertById } from '@/api/alerts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AlertLevel } from '@/types';
import Loading from '@/components/common/Loading';
import { formatDate } from '@/types/helpers';
import ErrorAlert from '@/components/common/ErrorAlert';

const getAlertLabel = (level: AlertLevel): string => {
    switch (level) {
        case 'CRITICAL': return 'Critical';
        case 'WARNING': return 'Warning';
        default: return 'Info';
    }
};

const getAlertColor = (level: AlertLevel): 'error' | 'warning' | 'info' => {
    switch (level) {
        case 'CRITICAL': return 'error';
        case 'WARNING': return 'warning';
        default: return 'info';
    }
};

interface DetailItemProps {
    label: string;
    value?: string | number;
}

const DetailItem = ({ label, value }: DetailItemProps) => (
  <Box>
      <Typography variant="subtitle2" color="textSecondary">{label}</Typography>
      <Typography variant="body1">{value ?? '-'}</Typography>
  </Box>
);

export default function AlertDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const alertId = Number(id);

    const { data: alert, isLoading, isError, error } = useQuery({
        queryKey: ['alert', alertId],
        queryFn: () => getAlertById(alertId),
    });

    if (isLoading) return <Loading />;
    if (isError) return <ErrorAlert message={error.message} />;
    if (!alert) return <ErrorAlert message="Alert not found" />;

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
                    label={getAlertLabel(alert.alertLevel)}
                    color={getAlertColor(alert.alertLevel)}
                  />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                  <DetailItem label="Alert ID" value={alert.alertId} />
                  <DetailItem label="Sensor ID" value={alert.sensorId} />
                  <DetailItem label="Reading ID" value={alert.readingId} />
                  <DetailItem label="Timestamp" value={formatDate(new Date(alert.timestamp))} />
                  <DetailItem label="Acknowledged" value={alert.acknowledged ? 'Yes' : 'No'} />
                  {alert.acknowledged && (
                    <>
                        <DetailItem label="Acknowledged By" value={alert.acknowledgedBy?.toString() || 'Unknown'} />
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