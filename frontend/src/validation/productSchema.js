import * as yup from 'yup';

const productSchema = yup.object().shape({
    idCategoriaProductos: yup.string().required('Categoria de productos es requerido'),
    idEstados: yup.string().required('Estado es requerido'),
    idUsuarios: yup.string().required('Usuario es requerido'),
    nombre: yup.string().min(5, 'El nombre no puede ser menor a 5 caracteres').max(45, 'El nombre no puede ser mayor a 45 caracteres').required('Nombre del producto es requerido.'),
    marca: yup.string().min(2, 'La marca no puede ser menor a 5 caracteres').max(45, 'La marca no puede ser mayor a 45 caracteres').required('Marca del producto es requerido.'),
    codigo: yup.string().min(4, 'El código no puede ser menor a 5 caracteres').max(45, 'El código no puede ser mayor a 45 caracteres').required('Código del producto es requerido.'),
    stock: yup.string().matches(/^[0-9]+$/, 'El stock debe ser un número.').required('Stock es requerido.'),
    precio: yup.string().matches(/^[0-9.]+$/, 'El precio debe ser un número.').required('Precio es requerido.'),
    foto: yup.mixed()
        .nullable(),
});

export default productSchema;
