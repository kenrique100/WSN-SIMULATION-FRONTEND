import {
    Box,
    TextField,
    Button,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid
} from '@mui/material';
import React, { useState } from 'react';
import type { SensorNode } from '@/types';
import { NODE_STATUSES, type NodeStatus } from '@/types';

interface NodeFormProps {
    onSubmit: (data: {
        name: string;
        location: string;
        latitude?: number;
        longitude?: number;
        status: NodeStatus;
    }) => Promise<void>;
    onCancel: () => void;
    node?: SensorNode | null;
}

export default function NodeForm({ onSubmit, onCancel, node }: NodeFormProps) {
    const [formData, setFormData] = useState({
        name: node?.name || '',
        location: node?.location || '',
        latitude: node?.latitude || undefined,
        longitude: node?.longitude || undefined,
        status: node?.status || 'active'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit({
                ...formData,
                status: formData.status as NodeStatus
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value === '' ? undefined : parseFloat(value)
        }));
    };

    const handleStatusChange = (e: { target: { value: unknown } }) => {
        setFormData(prev => ({
            ...prev,
            status: e.target.value as NodeStatus
        }));
    };

    return (
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={3}>
              <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                      <TextField
                        required
                        fullWidth
                        label="Node Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                  </Grid>
                  <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                          <InputLabel>Status</InputLabel>
                          <Select
                            required
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleStatusChange}
                          >
                              {NODE_STATUSES.map((status) => (
                                <MenuItem key={status.value} value={status.value}>
                                    {status.label}
                                </MenuItem>
                              ))}
                          </Select>
                      </FormControl>
                  </Grid>
              </Grid>

              <TextField
                required
                fullWidth
                label="Location Description"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />

              <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Latitude"
                        name="latitude"
                        type="number"
                        value={formData.latitude ?? ''}
                        onChange={handleNumberChange}
                        inputProps={{
                            step: "0.000001",
                            min: "-90",
                            max: "90"
                        }}
                      />
                  </Grid>
                  <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Longitude"
                        name="longitude"
                        type="number"
                        value={formData.longitude ?? ''}
                        onChange={handleNumberChange}
                        inputProps={{
                            step: "0.000001",
                            min: "-180",
                            max: "180"
                        }}
                      />
                  </Grid>
              </Grid>

              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button
                    onClick={onCancel}
                    disabled={isSubmitting}
                    variant="outlined"
                  >
                      Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                      {isSubmitting ? 'Saving...' : 'Save Node'}
                  </Button>
              </Stack>
          </Stack>
      </Box>
    );
}