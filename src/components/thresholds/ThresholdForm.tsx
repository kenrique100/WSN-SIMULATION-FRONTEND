import { Box, Stack, TextField } from '@mui/material';
import FormButtons from '@/components/layout/FormButtons';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export interface ThresholdFormValues {
  sensorTypeId: number;
  warningLevel?: number;
  dangerLevel?: number;
  updatedBy: number;
}

// Use ObjectSchema instead of SchemaOf
const schema: yup.ObjectSchema<ThresholdFormValues> = yup.object({
  sensorTypeId: yup.number().required('Sensor type is required'),
  warningLevel: yup.number().optional().typeError('Must be a number'),
  dangerLevel: yup.number().optional().typeError('Must be a number'),
  updatedBy: yup.number().required('User ID is required'),
}).required(); // Required for proper type inference

interface ThresholdFormProps {
  onSubmit: SubmitHandler<ThresholdFormValues>;
  onCancel: () => void;
  initialData?: Partial<ThresholdFormValues>;
  isEdit?: boolean;
}

export default function ThresholdForm({
                                        onSubmit,
                                        onCancel,
                                        initialData,
                                        isEdit = false,
                                      }: ThresholdFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ThresholdFormValues>({
    defaultValues: {
      sensorTypeId: undefined,
      warningLevel: undefined,
      dangerLevel: undefined,
      updatedBy: 1,
      ...initialData,
    },
    resolver: yupResolver(schema),
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Stack spacing={3}>
        <Controller
          name="sensorTypeId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Sensor Type ID"
              type="number"
              fullWidth
              disabled={isEdit}
              error={!!errors.sensorTypeId}
              helperText={errors.sensorTypeId?.message}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />

        <Controller
          name="warningLevel"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Warning Level"
              type="number"
              fullWidth
              error={!!errors.warningLevel}
              helperText={errors.warningLevel?.message}
              onChange={(e) =>
                field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
              }
            />
          )}
        />

        <Controller
          name="dangerLevel"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Danger Level"
              type="number"
              fullWidth
              error={!!errors.dangerLevel}
              helperText={errors.dangerLevel?.message}
              onChange={(e) =>
                field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
              }
            />
          )}
        />

        <Controller
          name="updatedBy"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Updated By (User ID)"
              type="number"
              fullWidth
              error={!!errors.updatedBy}
              helperText={errors.updatedBy?.message}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />

        <FormButtons onCancel={onCancel} isEdit={isEdit} />
      </Stack>
    </Box>
  );
}
