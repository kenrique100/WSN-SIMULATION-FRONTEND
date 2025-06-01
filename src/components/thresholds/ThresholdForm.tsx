import { Box, Stack, TextField, LinearProgress } from '@mui/material';
import FormButtons from '@/components/layout/FormButtons';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export interface ThresholdFormValues {
  sensorTypeId: number;
  infoLevel: number;
  warningLevel: number;
  dangerLevel: number;
  updatedBy: number;
}

const schema: yup.ObjectSchema<ThresholdFormValues> = yup.object({
  sensorTypeId: yup.number().required('Sensor type is required').positive('Invalid sensor type'),
  infoLevel: yup.number()
    .required('Info level is required')
    .typeError('Must be a number')
    .test('is-less-than-warning', 'Info must be less than warning', function (value) {
      return !this.parent.warningLevel || (value < this.parent.warningLevel);
    }),
  warningLevel: yup.number()
    .required('Warning level is required')
    .typeError('Must be a number')
    .test('is-less-than-danger', 'Warning must be less than danger', function (value) {
      return !this.parent.dangerLevel || (value < this.parent.dangerLevel);
    })
    .test('is-greater-than-info', 'Warning must be greater than info', function (value) {
      return !this.parent.infoLevel || (value > this.parent.infoLevel);
    }),
  dangerLevel: yup.number()
    .required('Danger level is required')
    .typeError('Must be a number')
    .test('is-greater-than-warning', 'Danger must be greater than warning', function (value) {
      return !this.parent.warningLevel || (value > this.parent.warningLevel);
    }),
  updatedBy: yup.number().required(),
}).required();

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
  const user = useAuthStore(state => state.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<ThresholdFormValues>({
    defaultValues: {
      sensorTypeId: initialData?.sensorTypeId || undefined,
      infoLevel: initialData?.infoLevel || 0,
      warningLevel: initialData?.warningLevel || 0,
      dangerLevel: initialData?.dangerLevel || 0,
      updatedBy: user?.userId || 1, // Default to current user or fallback
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const values = watch();

  // Auto-adjust values to maintain proper hierarchy
  useEffect(() => {
    if (values.infoLevel !== undefined && values.warningLevel !== undefined &&
      values.infoLevel >= values.warningLevel) {
      setValue('warningLevel', values.infoLevel + 1, { shouldValidate: true });
    }

    if (values.warningLevel !== undefined && values.dangerLevel !== undefined &&
      values.warningLevel >= values.dangerLevel) {
      setValue('dangerLevel', values.warningLevel + 1, { shouldValidate: true });
    }
  }, [values.infoLevel, values.warningLevel, values.dangerLevel, setValue]);

  // Set the current user as the updater
  useEffect(() => {
    if (user?.userId) {
      setValue('updatedBy', user.userId);
    }
  }, [user, setValue]);

  const handleFormSubmit: SubmitHandler<ThresholdFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        infoLevel: Number(data.infoLevel),
        warningLevel: Number(data.warningLevel),
        dangerLevel: Number(data.dangerLevel),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 2 }}>
      {isSubmitting && <LinearProgress sx={{ mb: 2 }} />}
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
              required
              disabled={isEdit || isSubmitting}
              error={!!errors.sensorTypeId}
              helperText={errors.sensorTypeId?.message}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />

        {['infoLevel', 'warningLevel', 'dangerLevel'].map((fieldKey) => (
          <Controller
            key={fieldKey}
            name={fieldKey as keyof ThresholdFormValues}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={fieldKey
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())}
                type="number"
                fullWidth
                required
                disabled={isSubmitting}
                error={!!errors[fieldKey as keyof ThresholdFormValues]}
                helperText={errors[fieldKey as keyof ThresholdFormValues]?.message}
                inputProps={{ step: "0.01" }}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        ))}

        <Controller
          name="updatedBy"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Updated By"
              type="number"
              fullWidth
              disabled
              error={!!errors.updatedBy}
              helperText={errors.updatedBy?.message}
            />
          )}
        />

        <FormButtons
          onCancel={onCancel}
          isEdit={isEdit}
          disabled={isSubmitting || !isValid}
        />
      </Stack>
    </Box>
  );
}