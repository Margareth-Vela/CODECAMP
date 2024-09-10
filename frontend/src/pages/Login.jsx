import React, {useContext} from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import loginSchema from '../validation/loginSchema';
import { Container, Button, Typography, Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { yupResolver } from '@hookform/resolvers/yup';
import TextFieldController from '../components/TextFieldController';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      Correo: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      
      const Rol = await login(data);
      if(Rol === 'cliente'){
        navigate('/'); 
      }else{
        navigate('/admin/Home'); 
      }
    } catch (error) {
      console.error('Error al iniciar sesión.', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Login</Typography>
        <IconButton onClick={() => navigate('/')}>
          <HomeIcon fontSize="large" />
        </IconButton>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextFieldController
          name="Correo"
          control={control}
          label="Correo"
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </form>
      <Box mt={2} display="flex" justifyContent="center">
        <Typography variant="body2">
          ¿Aún no tienes cuenta?{' '}
          <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
            Regístrate
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
