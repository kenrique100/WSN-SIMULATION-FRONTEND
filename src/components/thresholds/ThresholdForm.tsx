import { Box, Stack, TextField, LinearProgress } from '@mui/material';
import FormButtons from '@/components/layout/FormButtons';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';

export interface ThresholdFormValues {
  sensorTypeId: number;
  infoLevel?: number;
  warningLevel?: number;
  dangerLevel?: number;
  updatedBy: number;
}

const schema: yup.ObjectSchema<ThresholdFormValues> = yup.object({
  sensorTypeId: yup.number().required('Sensor type is required'),
  infoLevel: yup.number()
    .required('Info level is required')
    .test('is-less-than-warning', 'Info must be < warning', function (value) {
      const warning = this.parent.warningLevel;
      return !warning || (value !== undefined && value < warning);
    }),
  warningLevel: yup.number()
    .required('Warning level is required')
    .test('is-less-than-danger', 'Warning must be < danger', function (value) {
      const danger = this.parent.dangerLevel;
      return !danger || (value !== undefined && value < danger);
    })
    .test('is-greater-than-info', 'Warning must be > info', function (value) {
      const info = this.parent.infoLevel;
      return !info || (value !== undefined && value > info);
    }),
  dangerLevel: yup.number()
    .required('Danger level is required')
    .test('is-greater-than-warning', 'Danger must be > warning', function (value) {
      const warning = this.parent.warningLevel;
      return !warning || (value !== undefined && value > warning);
    }),
  updatedBy: yup.number().required('User ID is required'),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ThresholdFormValues>({
    defaultValues: {
      sensorTypeId: undefined,
      infoLevel: undefined,
      warningLevel: undefined,
      dangerLevel: undefined,
      updatedBy: 1,
      ...initialData,
    },
    resolver: yupResolver(schema),
  });

  const values = watch();

  useEffect(() => {
    if (
      values.warningLevel !== undefined &&
      values.dangerLevel !== undefined &&
      values.warningLevel >= values.dangerLevel
    ) {
      const newWarning = values.dangerLevel - 1;
      if (values.warningLevel !== newWarning) {
        setValue('warningLevel', newWarning, { shouldValidate: true });
      }
    }
  }, [values.warningLevel, values.dangerLevel, setValue]);

  const handleFormSubmit: SubmitHandler<ThresholdFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
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
              disabled={isEdit || isSubmitting}
              error={!!errors.sensorTypeId}
              helperText={errors.sensorTypeId?.message}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />

        {['infoLevel', 'warningLevel', 'dangerLevel', 'updatedBy'].map((fieldKey) => (
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
                disabled={isSubmitting}
                error={!!errors[fieldKey as keyof ThresholdFormValues]}
                helperText={errors[fieldKey as keyof ThresholdFormValues]?.message}
                onChange={(e) =>
                  field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                }
              />
            )}
          />
        ))}

        <FormButtons
          onCancel={onCancel}
          isEdit={isEdit}
          disabled={isSubmitting}
        />
      </Stack>
    </Box>
  );
}