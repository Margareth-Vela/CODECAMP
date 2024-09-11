import React from 'react';
import { Controller } from 'react-hook-form';
import { TextField, MenuItem } from '@mui/material';

const SelectFieldController = ({ name, control, label, options = [], errors, ...rest }) => (
    <Controller
        name={name}
        control={control}
        render={({ field }) => (
            <TextField
                {...field}
                select
                label={label}
                fullWidth
                variant="outlined"
                margin="normal"
                error={!!errors[name]} // Marca el campo como error si hay errores
                helperText={errors[name] ? errors[name].message : ''} // Muestra el mensaje de error
                {...rest}
            >
                {options.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        )}
    />
);

export default SelectFieldController;
