import * as yup from 'yup';

const stateSchema = yup.object().shape({
    idEstados: yup.string().required('Estado es requerido'),
    Nombre: yup.string().min(2, 'El nombre no puede ser menor a 2 caracteres').max(45, 'El nombre no puede ser mayor a 45 caracteres').required('Nombre del estado es requerido.'),
});

export default stateSchema;
