import React, { useState } from 'react';
import {
    Box, TextField, Button, Stack, FormControl, InputLabel,
    Select, MenuItem, FormHelperText, SelectChangeEvent
} from '@mui/material';
import type { SensorNode, NodeFormData } from '@/types';
import { NODE_STATUSES, type NodeStatus } from '@/types/constants';

interface NodeFormProps {
    onSubmit: (data: NodeFormData) => void;
    onCancel: () => void;
    node?: SensorNode | null;
}

export default function NodeForm({ onSubmit, onCancel, node }: NodeFormProps) {
    const [formData, setFormData] = useState<NodeFormData>({
        name: node?.name || '',
        location: node?.location || '',
        latitude: node?.latitude,
        longitude: node?.longitude,
        status: (node?.status as NodeStatus) || 'active' // FIX: Cast ensures it's of correct type
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'latitude' || name === 'longitude'
              ? parseFloat(value) || undefined
              : value
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const value = e.target.value as NodeStatus;
        setFormData(prev => ({
            ...prev,
            status: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={2}>
              <TextField
                required
                fullWidth
                label="Name"
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
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Longitude"
                name="longitude"
                type="number"
                value={formData.longitude ?? ''}
                onChange={handleChange}
              />
              <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleSelectChange}
                  >
                      {NODE_STATUSES.map(status => (
                        <MenuItem key={status.value} value={status.value}>
                            {status.label}
                        </MenuItem>
                      ))}
                  </Select>
                  <FormHelperText>Select node status</FormHelperText>
              </FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                  <Button variant="outlined" onClick={onCancel}>
                      Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                      {node ? 'Update' : 'Create'}
                  </Button>
              </Box>
          </Stack>
      </Box>
    );
}
