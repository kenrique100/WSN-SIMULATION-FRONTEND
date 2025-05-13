import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

interface LabeledSelectOption {
  value: string;
  label: string;
}

interface LabeledSelectProps {
  label: string;
  name: string;
  value: string;
  options: readonly LabeledSelectOption[];
  onChange: (event: SelectChangeEvent) => void;
  hasError?: boolean;
  helperText?: string;
}

const LabeledSelect: React.FC<LabeledSelectProps> = ({
                                                       label,
                                                       name,
                                                       value,
                                                       options,
                                                       onChange,
                                                       hasError = false,
                                                       helperText
                                                     }) => {
  return (
    <FormControl fullWidth error={hasError}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-label`}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default LabeledSelect;