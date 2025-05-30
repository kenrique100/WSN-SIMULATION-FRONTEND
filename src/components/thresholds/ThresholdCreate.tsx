import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThresholdForm, { ThresholdFormValues } from './ThresholdForm';
import { createThreshold } from '@/api/thresholds';
import { useNotification } from '@/contexts/NotificationContext';
import { SubmitHandler } from 'react-hook-form';

export default function ThresholdCreate() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleSubmit: SubmitHandler<ThresholdFormValues> = async (data) => {
    try {
      await createThreshold({
        sensorTypeId: data.sensorTypeId,
        infoLevel: data.infoLevel || 0,
        warningLevel: data.warningLevel || 0,
        dangerLevel: data.dangerLevel || 0,
        updatedBy: data.updatedBy,
      });
      showNotification('Threshold created successfully', 'success');
      navigate('/thresholds');
    } catch {
      showNotification('Failed to create threshold', 'error');
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Create New Threshold
      </Typography>
      <ThresholdForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/thresholds')}
        isEdit={false}
      />
    </Box>
  );
}
