import { Box, CircularProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import ThresholdForm, { ThresholdFormValues } from './ThresholdForm';
import { getThresholdForSensorType, updateThreshold } from '@/api/thresholds';
import { useQuery } from '@tanstack/react-query';
import { useNotification } from '@/contexts/NotificationContext';
import { SubmitHandler } from 'react-hook-form';

export default function ThresholdEdit() {
  const { thresholdId } = useParams<{ thresholdId: string }>();
  const { showNotification } = useNotification();

  const {
    data: threshold,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['threshold', thresholdId],
    queryFn: () => getThresholdForSensorType(Number(thresholdId)),
    enabled: !!thresholdId,
    staleTime: 10000,
  });

  const handleSubmit: SubmitHandler<ThresholdFormValues> = async (data) => {
    if (!thresholdId) return;

    try {
      await updateThreshold(Number(thresholdId), {
        warningLevel: data.warningLevel,
        dangerLevel: data.dangerLevel,
        updatedBy: data.updatedBy,
      });
      showNotification('Threshold updated successfully', 'success');
    } catch (error) {
      console.error('Update threshold error:', error);
      showNotification('Failed to update threshold', 'error');
    }
  };

  if (isLoading) return <CircularProgress />;
  if (isError) {
    return (
      <Box sx={{ color: 'error.main' }}>
        {error?.message || 'Failed to load threshold'}
      </Box>
    );
  }
  if (!threshold) {
    return <Box sx={{ color: 'error.main' }}>Threshold not found</Box>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Edit Threshold
      </Typography>
      <ThresholdForm
        onSubmit={handleSubmit}
        onCancel={() => window.history.back()}
        initialData={{
          sensorTypeId: threshold.sensorTypeId,
          infoLevel: threshold.infoLevel,
          warningLevel: threshold.warningLevel,
          dangerLevel: threshold.dangerLevel,
          updatedBy: threshold.updatedBy,
        }}
        isEdit
      />
    </Box>
  );
}