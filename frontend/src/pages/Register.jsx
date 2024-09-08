import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { register } from '../api';
import { subYears } from 'date-fns';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Container } from '@mui/material';

// Definir el esquema de validación con yup
const today = new Date();
const minDate = subYears(today, 18);

const schema = yup.object().shape({
  Nombre_completo: yup.string().min(5, 'El nombre no puede ser menor a 5 caracteres').max(45, 'El nombre no puede ser mayor a 45 caracteres').required('Nombre completo es requerido.'),
  Correo: yup.string().email('Formato de correo incorrecto').required('El correo es requerido.'),
  password: yup.string().min(8, 'Contraseña debe ser de al menos 8 caracteres').required('La contraseña es requerida.'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Contraseñas no son iguales.')
    .required('Confirmar contraseña es requerido.'),
  telefono: yup.string()
    .matches(/^[0-9()+-]+$/, 'El teléfono debe ser un número.')
    .max(12, 'El teléfono no puede ser mayor a 12 caracteres.')
    .required('El teléfono es requerido.'),
  fecha_nacimiento: yup.date().max(minDate, 'Debe ser mínimo de 18 años para realizar las compras.').required('La fecha de nacimiento es requerida.'),
  idRol: yup.string().required('El rol es requerido.'),
});

const Register = () => {
  const navigate = useNavigate();

  // Configuracion react-hook
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      Nombre_completo: '',
      Correo: '',
      password: '',
      confirmPassword: '',
      telefono: '',
      fecha_nacimiento: '',
      idRol: '', // Valor predeterminado
    },
  });

  const onSubmit = async (data) => {
    try {
      await register(data);
      navigate('/login'); // Redirige a la página de inicio de sesión
    } catch (error) {
      console.error('Error al registrar el usuario.', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Registro de usuarios
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="Nombre_completo"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nombre completo"
              variant="outlined"
              margin="normal"
              fullWidth
              error={!!errors.Nombre_completo}
              helperText={errors.Nombre_completo?.message}
            />
          )}
        />
        <Controller
          name="Correo"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Correo"
              type="email"
              variant="outlined"
              margin="normal"
              fullWidth
              error={!!errors.Correo}
              helperText={errors.Correo?.message}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Contraseña"
              type="password"
              variant="outlined"
              margin="normal"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Confirmar contraseña"
              type="password"
              variant="outlined"
              margin="normal"
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          )}
        />
        <Controller
          name="telefono"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Teléfono"
              type="text"
              variant="outlined"
              margin="normal"
              fullWidth
              inputProps={{ maxLength: 12 }}
              error={!!errors.telefono}
              helperText={errors.telefono?.message}
            />
          )}
        />
        <Controller
          name="fecha_nacimiento"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Fecha de nacimiento"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              margin="normal"
              fullWidth
              error={!!errors.fecha_nacimiento}
              helperText={errors.fecha_nacimiento?.message}
            />
          )}
        />
        <Controller
          name="idRol"
          control={control}
          render={({ field }) => (
            <FormControl
              variant="outlined"
              margin="normal"
              fullWidth
              error={!!errors.idRol}
            >
              <InputLabel id="idRol-label">Rol</InputLabel>
              <Select
                {...field}
                labelId="idRol-label"
                label="idRol"
              >
                <MenuItem value="1">Cliente</MenuItem>
                <MenuItem value="2">Operador administrativo</MenuItem>
              </Select>
              {errors.idRol && (
                <Typography variant="caption" color="error">
                  {errors.idRol.message}
                </Typography>
              )}
            </FormControl>
          )}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Registrar
        </Button>
      </form>
    </Container>
  );
};

export default Register;
