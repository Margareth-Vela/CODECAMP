import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Paper, Typography, Button, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

//Contextos
import { AuthContext } from '../../context/AuthContext';
import ProductContext from '../../context/ProductContext';

//Componentes
import TextFieldController from '../../components/TextFieldController';
import SelectFieldController from '../../components/SelectFieldController';
import ProductImage from '../../components/ProductImage';
import ImageController from '../../components/ImageController';

//Schema
import productSchema from '../../validation/productSchema';

// Estados disponibles
const availableStates = [
    { id: '7', label: 'Activo' },
    { id: '8', label: 'Inactivo' },
    { id: '9', label: 'Descontinuado' },
    { id: '10', label: 'En descuento' }
];

const AdminProductDetailPage = () => {
    const { productId } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [categories, setCategories] = useState(null);
    const { updateProducts, fetchAllCategories } = useContext(ProductContext);
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const productDetails = location.state.productDetails;

    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(productSchema),
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

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await fetchAllCategories();
            setCategories(data);

            setValue('idUsuarios', user.id);
            setValue('nombre', productDetails.nombre);
            setValue('marca', productDetails.marca);
            setValue('codigo', productDetails.codigo);
            setValue('stock', productDetails.stock);
            setValue('precio', productDetails.precio);

        };

        fetchCategories();
    }, [productId, setValue]);

    const availableCategories = categories?.map(categorie => ({
        id: categorie.idCategoriaProductos,
        label: categorie.NombreCategoria
    }));

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
            await updateProducts(productId, data);
            alert('Producto actualizado con éxito');
            setIsEditing(false);
            navigate('/admin/products')
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <Grid container justifyContent="center" style={{ padding: '20px' }}>
            <Grid item xs={12} md={10} lg={8}>
                <Paper style={{ padding: '16px', marginBottom: '20px' }}>
                    <Typography variant="h5" component="div" gutterBottom>
                        Detalles del Producto #{productId}
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography><strong>Nombre Categoria:</strong> {productDetails.nombreCategoria}</Typography>
                            <Typography><strong>Nombre Producto:</strong> {productDetails.nombre}</Typography>
                            <Typography><strong>Marca:</strong> {productDetails.marca}</Typography>
                            <Typography><strong>Código:</strong> {productDetails.codigo}</Typography>
                            <Typography><strong>Stock:</strong> {productDetails.stock}</Typography>
                            <Typography><strong>Precio:</strong> {productDetails.precio}</Typography>
                            <Typography><strong>Estado:</strong> {productDetails.nombreEstado}</Typography>
                            <Typography><strong>Nombre Usuario Creación/Última actualización:</strong> {productDetails.nombreUsuario}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <ProductImage foto={productDetails.foto} />
                        </Grid>

                        {isEditing && (
                            <Grid item xs={12}>
                                <Typography variant="h6">Actualizar Producto:</Typography>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <TextFieldController
                                        name="nombre"
                                        control={control}
                                        label="Nombre Producto"
                                        errors={errors}
                                    />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextFieldController
                                                name="marca"
                                                control={control}
                                                label="Marca del Producto"
                                                errors={errors}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextFieldController
                                                name="codigo"
                                                control={control}
                                                label="Código del Producto"
                                                errors={errors}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextFieldController
                                                name="precio"
                                                control={control}
                                                label="Precio del Producto ($)"
                                                isCurrency={true}
                                                errors={errors}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={4}>
                                            <SelectFieldController
                                                name="idEstados"
                                                control={control}
                                                label="Estado"
                                                options={availableStates}
                                                errors={errors}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <SelectFieldController
                                                name="idCategoriaProductos"
                                                control={control}
                                                label="Categoría Productos"
                                                options={availableCategories}
                                                errors={errors}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextFieldController
                                                name="stock"
                                                control={control}
                                                label="Stock"
                                                errors={errors}
                                            />
                                        </Grid>
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
                                    </Grid>
                                    <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
                                        Actualizar Producto
                                    </Button>
                                </form>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? 'Cancelar' : 'Actualizar Producto'}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default AdminProductDetailPage;
