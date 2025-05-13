import { Box, Button } from '@mui/material';

interface FormButtonsProps {
  onCancel: () => void;
  isEdit?: boolean;
}

export default function FormButtons({ onCancel, isEdit = false }: FormButtonsProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
      <Button variant="outlined" onClick={onCancel}>Cancel</Button>
      <Button type="submit" variant="contained" color="primary">
        {isEdit ? 'Update' : 'Create'}
      </Button>
    </Box>
  );
}