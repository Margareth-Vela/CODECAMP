import React from 'react';
import { Controller } from 'react-hook-form';
import { TextField, InputAdornment } from '@mui/material';

const TextFieldController = ({ name, control, isCurrency = false, label, type = 'text', ...props }) => (
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
        InputProps={{
          startAdornment: isCurrency && <InputAdornment position="start">$</InputAdornment>,
        }}
        {...props}
      />
    )}
  />
);

export default TextFieldController;