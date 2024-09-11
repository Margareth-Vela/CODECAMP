import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Grid } from '@mui/material';
import * as yup from 'yup';

//Contextos
import { AuthContext } from '../../context/AuthContext';
import ProductContext from '../../context/ProductContext';

//Schemas
import productSchema from '../../validation/productSchema';

//Componentes
import TextFieldController from '../../components/TextFieldController';
import SelectFieldController from '../../components/SelectFieldController';
import ImageController from '../../components/ImageController';

// Estados disponibles
const availableStates = [
    { id: '7', label: 'Activo' },
    { id: '10', label: 'En descuento' }
];

const AdminCreateProductPage = () => {
    const { createProduct, fetchAllCategories, checkCode } = useContext(ProductContext);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const [categories, setCategories] = useState(null);
    const navigate = useNavigate();

    const checkIfCodeExists = async (codigo) => {
        try {
            const response = await checkCode(codigo);
            return response.exists;
        } catch (error) {
            console.error('Error al verificar el código:', error);
            return false;
        }
    };


    const modifiedSchema = productSchema.shape({
        codigo: yup.string()
            .min(4, 'El código no puede ser menor a 4 caracteres')
            .max(45, 'El código no puede ser mayor a 45 caracteres')
            .required('Código del producto es requerido.')
            .test('unique', 'El código del producto ya existe.', async value => {
                if (!value) return false; 
                const exists = await checkIfCodeExists(value);
                return !exists; 
            }),
    });


    useEffect(() => {
        const fetchCategories = async () => {
            const data = await fetchAllCategories();
            setCategories(data);
        };

        fetchCategories();
    }, []);

    const availableCategories = categories?.map(categorie => ({
        id: categorie.idCategoriaProductos,
        label: categorie.NombreCategoria
    }));
    // Configuracion react-hook
    const { handleSubmit, control, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(modifiedSchema),
        defaultValues: {
            idCategoriaProductos: '',
            idEstados: '',
            idUsuarios: '',
            nombre: '',
            marca: '',
            codigo: '',
            stock: '',
            precio: '',
            foto: '',
        }
    });

    setValue('idUsuarios', user.id);

    // Función para convertir Base64 a Hex
    const base64ToHex = (base64) => {
        const raw = atob(base64.split(',')[1]);
        let hex = '0x';
        for (let i = 0; i < raw.length; i++) {
            let _hex = raw.charCodeAt(i).toString(16);
            hex += (_hex.length === 2 ? _hex : '0' + _hex);
        }
        return hex.toUpperCase();
    };

    const onSubmit = async (data) => {
        if (data.foto) {
            const hexData = base64ToHex(data.foto);
            data.foto = hexData;
        } else {
            data.foto = '0x'
        }
        try {
            await createProduct(data);
            alert('Producto creado con éxito');
            navigate('/admin/products'); // Redirige a la página de productos 
        } catch (error) {
            console.error('Error al crear el producto.', error);
            alert('Hubo un error al crear el producto. Por favor, inténtelo de nuevo.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4">Creación de Productos</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextFieldController
                    name="nombre"
                    control={control}
                    label="Nombre Producto"
                    errors={errors}
                />
                <TextFieldController
                    name="marca"
                    control={control}
                    label="Marca del Producto"
                    errors={errors}
                />
                <TextFieldController
                    name="codigo"
                    control={control}
                    label="Código del Producto"
                    errors={errors}
                />
                <TextFieldController
                    name="precio"
                    control={control}
                    label="Precio del Producto ($)"
                    isCurrency={true}
                    errors={errors}
                />
                <SelectFieldController
                    name="idEstados"
                    control={control}
                    label="Estado"
                    options={availableStates}
                    errors={errors}
                />
                <SelectFieldController
                    name="idCategoriaProductos"
                    control={control}
                    label="Categoría Productos"
                    options={availableCategories}
                    errors={errors}
                />
                <TextFieldController
                    name="stock"
                    control={control}
                    label="Stock"
                    errors={errors}
                />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <ImageController
                            name="foto"
                            control={control}
                            setValue={setValue}
                            errors={errors}
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Crear Producto
                </Button>
            </form>
        </Container>
    );
};

export default AdminCreateProductPage;
