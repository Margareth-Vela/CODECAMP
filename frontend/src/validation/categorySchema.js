import * as yup from 'yup';

const categorySchema = yup.object().shape({
    idCategoriaProductos: yup.string().required('Categoria de productos es requerido'),
    idEstados: yup.string().required('Estado es requerido'),
    idUsuarios: yup.string().required('Usuario es requerido'),
    nombre: yup.string().min(2, 'El nombre no puede ser menor a 2 caracteres').max(45, 'El nombre no puede ser mayor a 45 caracteres').required('Nombre de la categoría es requerido.'),
});

export default categorySchema;
