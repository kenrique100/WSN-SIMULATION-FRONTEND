import { Box, Button, CircularProgress, Stack } from '@mui/material';

interface FormButtonsProps {
  onCancel: () => void;
  onSave?: () => void;
  isEdit?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function FormButtons({
                                      onCancel,
                                      onSave,
                                      isEdit = false,
                                      isLoading = false,
                                      disabled = false,
                                    }: FormButtonsProps) {
  return (
    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
      <Button
        variant="outlined"
        onClick={onCancel}
        disabled={isLoading}
        sx={{ minWidth: 100 }}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={onSave}
        disabled={disabled || isLoading}
        sx={{ minWidth: 100 }}
      >
        {isLoading ? (
          <>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            {isEdit ? 'Updating...' : 'Creating...'}
          </>
        ) : isEdit ? (
          'Update'
        ) : (
          'Create'
        )}
      </Button>
    </Stack>
  );
}