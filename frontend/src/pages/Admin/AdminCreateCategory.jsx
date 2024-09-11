import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container } from '@mui/material';
import * as yup from 'yup';

//Contextos
import { AuthContext } from '../../context/AuthContext';
import ProductContext from '../../context/ProductContext';

//Schemas
import categorySchema from '../../validation/categorySchema';

//Componentes
import TextFieldController from '../../components/TextFieldController';
import SelectFieldController from '../../components/SelectFieldController';

// Estados disponibles
const availableStates = [
    { id: '7', label: 'Activo' },
    { id: '10', label: 'En descuento' }
];

const AdminCreateCategoryPage = () => {
    const { createCategory, fetchAllCategories, checkName } = useContext(ProductContext);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const [categories, setCategories] = useState(null);
    const navigate = useNavigate();

    const checkIfNameExists = async (nombre) => {
        try {
            const response = await checkName(nombre);
            return response.exists;
        } catch (error) {
            console.error('Error al verificar el nombre:', error);
            return false;
        }
    };


    const modifiedSchema = categorySchema.shape({
        nombre: yup.string()
            .min(2, 'El nombre no puede ser menor a 2 caracteres')
            .max(45, 'El nombre no puede ser mayor a 45 caracteres')
            .required('Nombre de la categoría es requerido.')
            .test('unique', 'El nombre de la categoría ya existe.', async value => {
                if (!value) return false; 
                const exists = await checkIfNameExists(value);
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

    const getNextCategoryId = (categories) => {
        if (!categories || categories.length === 0) {
            return 1;
        }
        const maxId = categories.reduce((max, category) => Math.max(max, category.idCategoriaProductos), 0);
        return maxId + 1;
    };

    const nextCategoryId = getNextCategoryId(categories);

    // Configuracion react-hook
    const { handleSubmit, control, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(modifiedSchema),
        defaultValues: {
            idCategoriaProductos: '',
            idEstados: '',
            idUsuarios: '',
            nombre: '',
        }
    });

    console.log('form errors', errors)
    setValue('idUsuarios', user.id);
    setValue('idCategoriaProductos', nextCategoryId);

    const onSubmit = async (data) => {
        try {
            await createCategory(data);
            alert('Categoría creada con éxito');
            navigate('/admin/categories'); // Redirige a la página de productos 
        } catch (error) {
            console.error('Error al crear la categorpia.', error);
            alert('Hubo un error al crear la categoría. Por favor, inténtelo de nuevo.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4">Creación de Categorías</Typography>
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
                    options={availableStates}
                    errors={errors}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Crear Categoría
                </Button>
            </form>
        </Container>
    );
};

export default AdminCreateCategoryPage;
