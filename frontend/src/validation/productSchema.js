import * as yup from 'yup';
const MAX_FILE_SIZE = 50 * 1024;

function getBase64FileSize(base64) {
    let stringLength = base64.length - 'data:image/jpeg;base64,'.length;
    let sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
    return sizeInBytes;
  }

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
        .nullable().test('fileSize', 'El archivo es demasiado grande. El tamaño máximo es 50KB.', (value) => {
            if (!value) return true; // Allow null values
            return getBase64FileSize(value)<= MAX_FILE_SIZE;
          }),
});

export default productSchema;
