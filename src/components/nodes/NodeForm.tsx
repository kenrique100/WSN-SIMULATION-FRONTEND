// src/components/nodes/NodeForm.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Stack } from '@mui/material';
import type { SensorNode, NodeStatus } from '@/types';
import { NODE_STATUSES } from '@/types';
import { validateNodeForm } from '@/utils/validators';

interface NodeFormProps {
    onSubmit: (data: {
        name: string;
        location: string;
        latitude?: number;
        longitude?: number;
        status: NodeStatus;
    }) => void;
    onCancel: () => void;
    node?: SensorNode | null;
}

export default function NodeForm({ onSubmit, onCancel, node }: NodeFormProps) {
    const [name, setName] = useState(node?.name || '');
    const [location, setLocation] = useState(node?.location || '');
    const [latitude, setLatitude] = useState(node?.latitude?.toString() || '');
    const [longitude, setLongitude] = useState(node?.longitude?.toString() || '');
    const [status, setStatus] = useState<NodeStatus>(node?.status || 'active');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validation = validateNodeForm({ name, location });
        if (!validation.valid) {
            setErrors(validation.errors);
            return;
        }

        onSubmit({
            name,
            location,
            latitude: latitude ? parseFloat(latitude) : undefined,
            longitude: longitude ? parseFloat(longitude) : undefined,
            status
        });
    };

    return (
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={2}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                    setErrors(prev => ({ ...prev, name: '' }));
                }}
                error={!!errors.name}
                helperText={errors.name}
                required
                fullWidth
              />
              <TextField
                label="Location"
                value={location}
                onChange={(e) => {
                    setLocation(e.target.value);
                    setErrors(prev => ({ ...prev, location: '' }));
                }}
                error={!!errors.location}
                helperText={errors.location}
                required
                fullWidth
              />
              <TextField
                label="Latitude"
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                fullWidth
              />
              <TextField
                label="Longitude"
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                fullWidth
              />
              <TextField
                label="Status"
                select
                value={status}
                onChange={(e) => setStatus(e.target.value as NodeStatus)}
                fullWidth
                SelectProps={{ native: true }}
              >
                  {NODE_STATUSES.map((statusOption) => (
                    <option key={statusOption.value} value={statusOption.value}>
                        {statusOption.label}
                    </option>
                  ))}
              </TextField>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button onClick={onCancel}>Cancel</Button>
                  <Button type="submit" variant="contained">
                      {node ? 'Update' : 'Create'}
                  </Button>
              </Box>
          </Stack>
      </Box>
    );
}