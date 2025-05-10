import { useState } from 'react';
import {
    Box, TextField, Button, Stack, FormControl, InputLabel,
    Select, MenuItem, FormHelperText
} from '@mui/material';
import type { SensorNode, NodeCreateRequest } from '../../types';

interface NodeFormProps {
    onSubmit: (data: NodeCreateRequest) => void;
    onCancel: () => void;
    node?: SensorNode | null;
}

export default function NodeForm({ onSubmit, onCancel, node }: NodeFormProps) {
    const [formData, setFormData] = useState<NodeCreateRequest>({
        name: node?.name || '',
        location: node?.location || '',
        latitude: node?.latitude || undefined,
        longitude: node?.longitude || undefined,
        status: node?.status || 'active'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
                    value={formData.latitude || ''}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    label="Longitude"
                    name="longitude"
                    type="number"
                    value={formData.longitude || ''}
                    onChange={handleChange}
                />
                <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                        name="status"
                        value={formData.status}
                        label="Status"
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            status: e.target.value as string
                        }))}
                    >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                        <MenuItem value="maintenance">Maintenance</MenuItem>
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