import { Box, Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';
import { ALERT_LEVELS, SENSOR_TYPES } from '@/types/constants';
import LabeledSelect from '@/components/layout/LabeledSelect';
import FormButtons from '@/components/layout/FormButtons';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { SelectChangeEvent } from '@mui/material';
interface ThresholdFormValues {
  sensorType: string;
  minValue?: number;
  maxValue?: number;
  notificationEnabled: boolean;
  level: string;
}

const schema: yup.ObjectSchema<ThresholdFormValues> = yup.object({
  sensorType: yup.string().required('Sensor type is required'),
  minValue: yup.number().typeError('Must be a number').optional(),
  maxValue: yup.number().typeError('Must be a number').optional().when(
    ['minValue'],
    ([minValue], schema) => {
      return minValue !== undefined
        ? schema.min(minValue, 'Max must be greater than min')
        : schema;
    }
  ),
  level: yup.string().required('Alert level is required'),
  notificationEnabled: yup.boolean().required(),
});

interface ThresholdFormProps {
  onSubmit: SubmitHandler<ThresholdFormValues>;
  onCancel: () => void;
  initialData?: Partial<ThresholdFormValues>;
}

function ThresholdForm({ onSubmit, onCancel, initialData }: ThresholdFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ThresholdFormValues>({
    defaultValues: {
      sensorType: '',
      minValue: undefined,
      maxValue: undefined,
      level: 'WARNING',
      notificationEnabled: true,
      ...initialData,
    },
    resolver: yupResolver(schema),
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Stack spacing={3}>
        <Controller
          name="sensorType"
          control={control}
          render={({ field }) => (
            <LabeledSelect
              label="Sensor Type"
              name={field.name}
              value={field.value}
              options={SENSOR_TYPES.map((s) => ({ value: s.name, label: s.name }))}
              onChange={(e: SelectChangeEvent) => field.onChange(e.target.value)}
              hasError={!!errors.sensorType}
              helperText={errors.sensorType?.message}
            />
          )}
        />

        <Controller
          name="minValue"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Min Value"
              type="number"
              fullWidth
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
              error={!!errors.minValue}
              helperText={errors.minValue?.message}
            />
          )}
        />

        <Controller
          name="maxValue"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Max Value"
              type="number"
              fullWidth
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
              error={!!errors.maxValue}
              helperText={errors.maxValue?.message}
            />
          )}
        />

        <Controller
          name="level"
          control={control}
          render={({ field }) => (
            <LabeledSelect
              label="Alert Level"
              name={field.name}
              value={field.value}
              options={ALERT_LEVELS}
              onChange={(e: SelectChangeEvent) => field.onChange(e.target.value)}
              hasError={!!errors.level}
              helperText={errors.level?.message}
            />
          )}
        />

        {/* Add checkbox if needed */}
         <Controller
          name="notificationEnabled"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
              label="Enable Notifications"
            />
          )}
        />

        <FormButtons onCancel={onCancel} isEdit={!!initialData} />
      </Stack>
    </Box>
  );
}

export default ThresholdForm;
