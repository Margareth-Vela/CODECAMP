import * as yup from 'yup';

const orderDetailsSchema = yup.object().shape({
    nombre_completo: yup.string().required('Nombre completo es requerido'),
    telefono: yup.string().matches(/^[0-9()+-]+$/, 'El teléfono debe ser un número.').required('Teléfono es requerido'),
    correo: yup.string().email('Correo no es válido').required('Correo es requerido'),
    direccion: yup.string().required('Dirección es requerida'),
    fecha_entrega: yup.string().required('Fecha de entrega es requerida'),
    total_orden: yup.string().required('Total de la orden es requerido'),
    idEstados: yup.string().required('Estado es requerido'),
    motivo_rechazo: yup.string(),
});

export default orderDetailsSchema;
