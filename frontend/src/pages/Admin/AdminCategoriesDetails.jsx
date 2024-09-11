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

//Schema
import categorySchema from '../../validation/categorySchema';

// Mapa de IDs a Labels
const stateIdMap = {
    'Activo': '7',
    'Inactivo': '8',
    'Descontinuado': '9',
    'En descuento': '10'
};

// Estados disponibles
const availableStates = [
    { id: '7', label: 'Activo' },
    { id: '8', label: 'Inactivo' },
    { id: '9', label: 'Descontinuado' },
    { id: '10', label: 'En descuento' }
];

const hasActiveProducts = (products, categoryName) => {
    // Filtrar productos por nombre de categoría
    const filteredProducts = products.filter(product => product.nombreCategoria === categoryName);
    const resultProducts = filteredProducts.some(product => product.nombreEstado === 'Activo' || product.nombreEstado === 'En descuento');

    return resultProducts;
};


const AdminCategoryDetailPage = () => {
    const { categoryId } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const { updateCategories, fetchProductbyCategory } = useContext(ProductContext);
    const { user } = useContext(AuthContext);
    const [showInactive, setShowInactive] = useState(true);
    const [showDiscontinued, setShowDiscontinued] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const categoryDetails = location.state.categoryDetails;

    const currentStateId = stateIdMap[categoryDetails.Estado];

    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(categorySchema),
        defaultValues: {
            idCategoriaProductos: '',
            idEstados: '',
            idUsuarios: '',
            nombre: '',
        }
    });

    useEffect(() => {
        const fetchProductCategoryDetails = async () => {
            try {
                const products = await fetchProductbyCategory();
                const hasActive = hasActiveProducts(products, categoryDetails.NombreCategoria);

                setShowInactive(!hasActive);
                setShowDiscontinued(!hasActive);

                setValue('idUsuarios', user.id);
                setValue('idCategoriaProductos', categoryId);
                setValue('nombre', categoryDetails.NombreCategoria);

            } catch (error) {
                console.error('Error al obtener detalles de la categoría:', error);
            }
        };

        fetchProductCategoryDetails();
    }, [categoryId, setValue]);

    const filteredStates = availableStates.filter(state => {
        if (!showInactive && state.label === 'Inactivo') {
            return false;
        }
        if (!showDiscontinued && state.label === 'Descontinuado') {
            return false;
        }
        return true;
    });


    console.log('Form errors', errors)


    const onSubmit = async (data) => {
        try {
            await updateCategories(categoryId, data);
            alert('Categoría actualizado con éxito');
            setIsEditing(false);
            navigate('/admin/categories')
        } catch (error) {
            console.error('Error updating category:', error);
            alert('Hubo un error al actualizar la categoría. Por favor, inténtelo de nuevo.');
        }
    };

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        return dateString.split('T')[0];
    };

    return (
        <Grid container justifyContent="center" style={{ padding: '20px' }}>
            <Grid item xs={12} md={10} lg={8}>
                <Paper style={{ padding: '16px', marginBottom: '20px' }}>
                    <Typography variant="h5" component="div" gutterBottom>
                        Detalles de la Categoría #{categoryId}
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography><strong>Nombre Categoria:</strong> {categoryDetails.NombreCategoria}</Typography>
                            <Typography><strong>Estado:</strong> {categoryDetails.Estado}</Typography>
                            <Typography><strong>Nombre Usuario Creación/Última actualización: </strong>{categoryDetails.NombreUsuario}</Typography>
                            <Typography><strong>Fecha de creación:</strong> {formatDate(categoryDetails.fecha_creacion)}</Typography>
                        </Grid>
                        {isEditing && (
                            <Grid item xs={12}>
                                <Typography variant="h6">Actualizar Categoría:</Typography>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <TextFieldController
                                        name="nombre"
                                        control={control}
                                        label="Nombre Categoría"
                                        errors={errors}
                                    />
                                    <SelectFieldController
                                        name="idEstados"
                                        control={control}
                                        label="Estado"
                                        options={filteredStates}
                                        errors={errors}
                                    />
                                    <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
                                        Actualizar Categoría
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
                                {isEditing ? 'Cancelar' : 'Actualizar Categoría'}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default AdminCategoryDetailPage;
