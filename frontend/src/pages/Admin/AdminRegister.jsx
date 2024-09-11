import React, {useContext} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {Button, Typography, Container } from '@mui/material';
import registerSchema from '../../validation/registerSchema';
import TextFieldController from '../../components/TextFieldController';

const AdminRegister = () => {
  const { registerAdmin } = useContext(AuthContext);
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
      idRol: '2', // Valor predeterminado
    },
  });

  const onSubmit = async (data) => {
    try {
      await registerAdmin(data);
      alert('Usuario creado con éxito');
      navigate('/admin/users'); // Redirige a la página de usuarios 
    } catch (error) {
      console.error('Error al registrar el usuario.', error);
      alert('Hubo un error al registrar el usuario. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <Container maxWidth="sm">
        <Typography variant="h4">Registro de operadores</Typography>
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
    </Container>
  );
};

export default AdminRegister;
