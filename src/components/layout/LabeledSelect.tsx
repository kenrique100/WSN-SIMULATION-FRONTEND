import {
  FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, FormHelperText
} from '@mui/material';

interface LabeledSelectProps {
  label: string;
  value: string;
  name: string;
  options: readonly { value: string; label: string }[];
  onChange: (e: SelectChangeEvent<string>) => void;
  helperText?: string;
}

export default function LabeledSelect({
                                        label, value, name, options, onChange, helperText
                                      }: LabeledSelectProps) {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select name={name} value={value} label={label} onChange={onChange}>
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
