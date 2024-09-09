import * as yup from 'yup';

const ordenSchema = yup.object().shape({
    nombre_completo: yup.string().min(5, 'El nombre no puede ser menor a 5 caracteres').max(45, 'El nombre no puede ser mayor a 45 caracteres').required('Nombre completo es requerido.'),
    telefono: yup.string()
      .matches(/^[0-9()+-]+$/, 'El teléfono debe ser un número.')
      .max(12, 'El teléfono no puede ser mayor a 12 caracteres.')
      .required('El teléfono es requerido.'),
    direccion: yup.string().min(5, 'La dirección no puede ser menor a 5 caracteres').max(45, 'La dirección no puede ser mayor a 45 caracteres').required('La dirección es requerida.'),
});

export default ordenSchema;
