import * as yup from 'yup';
import { subYears } from 'date-fns';

const today = new Date();
const minDate = subYears(today, 18);

const registerSchema = yup.object().shape({
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

  export default registerSchema;