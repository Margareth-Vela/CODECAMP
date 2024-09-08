import React from 'react';
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

const TextFieldController = ({ name, control, label, type = 'text', ...props }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <TextField
        {...field}
        label={label}
        type={type}
        variant="outlined"
        margin="normal"
        fullWidth
        error={!!props.errors[name]}
        helperText={props.errors[name]?.message}
        {...props}
      />
    )}
  />
);

export default TextFieldController;