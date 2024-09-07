import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { register } from '../api'; 

// Definir el esquema de validación con yup
const schema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email requerido'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Contraseña requerida'),
});

const Register = () => {
  const navigate = useNavigate();
  
  // Configuracion react-hook
  const { register: formRegister, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email:
          <input
            type="email"
            {...formRegister('email')}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </label>
      </div>
      <div>
        <label>Password:
          <input
            type="password"
            {...formRegister('password')}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </label>
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
