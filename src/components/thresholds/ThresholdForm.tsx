import React, { useState } from 'react';
import { Box, Stack, TextField } from '@mui/material';
import { ALERT_LEVELS, SENSOR_TYPES } from '@/types/constants';
import { SelectChangeEvent } from '@mui/material';
import LabeledSelect from '@/components/layout/LabeledSelect';
import FormButtons from '@/components/layout/FormButtons';

interface ThresholdFormProps {
  onSubmit: (data: { sensorType: string; threshold: string; level: string }) => void;
  onCancel: () => void;
  initialData?: { sensorType: string; threshold: string; level: string }; // Optional
}

export default function ThresholdForm({ onSubmit, onCancel, initialData }: ThresholdFormProps) {
  const [formData, setFormData] = useState(initialData ?? {
    sensorType: '',
    threshold: '',
    level: 'warning',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <LabeledSelect
          label="Sensor Type"
          name="sensorType"
          value={formData.sensorType}
          options={SENSOR_TYPES.map(s => ({ value: s.name, label: s.name }))}
          onChange={handleSelectChange}
        />
        <TextField
          label="Threshold"
          name="threshold"
          type="number"
          value={formData.threshold}
          onChange={handleChange}
          fullWidth
        />
        <LabeledSelect
          label="Alert Level"
          name="level"
          value={formData.level}
          options={ALERT_LEVELS}
          onChange={handleSelectChange}
        />
        <FormButtons onCancel={onCancel} isEdit={!!initialData} />
      </Stack>
    </Box>
  );
}
