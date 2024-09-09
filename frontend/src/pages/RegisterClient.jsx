import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {Button, IconButton, Typography, Container, Box } from '@mui/material';
import registerSchema from '../validation/registerSchema';
import HomeIcon from '@mui/icons-material/Home';
import TextFieldController from '../components/TextFieldController';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Configuracion react-hook
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      Nombre_completo: '',
      Correo: '',
      password: '',
      confirmPassword: '',
      telefono: '',
      fecha_nacimiento: '',
      idRol: '1', // Valor predeterminado
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Registro de usuarios</Typography>
        <IconButton onClick={() => navigate('/')}>
          <HomeIcon fontSize="large" />
        </IconButton>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextFieldController
          name="Nombre_completo"
          control={control}
          label="Nombre Completo"
          errors={errors}
        />
        <TextFieldController
          name="Correo"
          control={control}
          label="Correo Electrónico"
          type="email"
          errors={errors}
        />
        <TextFieldController
          name="password"
          control={control}
          label="Contraseña"
          type="password"
          errors={errors}
        />
        <TextFieldController
          name="confirmPassword"
          control={control}
          label="Confirmar Contraseña"
          type="password"
          errors={errors}
        />
        <TextFieldController
          name="telefono"
          control={control}
          label="Teléfono"
          errors={errors}
        />
        <TextFieldController
          name="fecha_nacimiento"
          control={control}
          label="Fecha de Nacimiento"
          type="date"
          InputLabelProps={{ shrink: true }}
          errors={errors}
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
      <Box mt={2} display="flex" justifyContent="center">
        <Typography variant="body2">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
            Inicia sesión
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
