import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getThresholdForSensorType, updateThreshold } from '../../api/thresholds';
import { useNotification } from '../../contexts/NotificationContext';

export default function ThresholdForm() {
    const { sensorTypeId } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        minValue: '',
        maxValue: '',
        notificationEnabled: true
    });

    useEffect(() => {
        if (sensorTypeId) {
            getThresholdForSensorType(Number(sensorTypeId))
                .then((threshold) => {
                    setFormData({
                        minValue: threshold.minValue?.toString() || '',
                        maxValue: threshold.maxValue?.toString() || '',
                        notificationEnabled: threshold.notificationEnabled
                    });
                });
        }
    }, [sensorTypeId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateThreshold(Number(sensorTypeId), {
                minValue: formData.minValue ? Number(formData.minValue) : null,
                maxValue: formData.maxValue ? Number(formData.maxValue) : null,
                notificationEnabled: formData.notificationEnabled
            });
            showNotification('Threshold updated successfully', 'success');
            navigate('/thresholds');
        } catch (error) {
            showNotification('Failed to update threshold', 'error');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                {sensorTypeId ? 'Edit Threshold' : 'Create New Threshold'}
            </Typography>

            <TextField
                label="Minimum Value"
                type="number"
                fullWidth
                margin="normal"
                value={formData.minValue}
                onChange={(e) => setFormData({ ...formData, minValue: e.target.value })}
            />

            <TextField
                label="Maximum Value"
                type="number"
                fullWidth
                margin="normal"
                value={formData.maxValue}
                onChange={(e) => setFormData({ ...formData, maxValue: e.target.value })}
            />

            <FormControl fullWidth margin="normal">
                <InputLabel>Notification</InputLabel>
                <Select
                    value={formData.notificationEnabled}
                    onChange={(e) => setFormData({ ...formData, notificationEnabled: e.target.value as boolean })}
                    label="Notification"
                >
                    <MenuItem value={true}>Enabled</MenuItem>
                    <MenuItem value={false}>Disabled</MenuItem>
                </Select>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                <Button variant="outlined" onClick={() => navigate('/thresholds')}>
                    Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                    Save
                </Button>
            </Box>
        </Box>
    );
}