import * as yup from 'yup';

const loginSchema = yup.object().shape({
  Correo: yup.string().email('Debe ser un correo válido.').required('Correo es requerido.'),
  password: yup.string().required('Contraseña es requerida.'),
});

export default loginSchema;
