// src/components/nodes/NodeForm.tsx
import {
    Box,
    TextField,
    Button,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem
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
              <TextField
                required
                fullWidth
                label="Node Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

              <TextField
                required
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                label="Latitude"
                name="latitude"
                type="number"
                value={formData.latitude ?? ''}
                onChange={handleNumberChange}
                inputProps={{ step: "0.000001" }}
              />

              <TextField
                fullWidth
                label="Longitude"
                name="longitude"
                type="number"
                value={formData.longitude ?? ''}
                onChange={handleNumberChange}
                inputProps={{ step: "0.000001" }}
              />

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

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button onClick={onCancel} disabled={isSubmitting}>
                      Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                      {isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
              </Stack>
          </Stack>
      </Box>
    );
}