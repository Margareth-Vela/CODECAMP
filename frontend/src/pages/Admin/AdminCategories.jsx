import React, { useState, useEffect, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

//Contextos
import ProductContext from '../../context/ProductContext';

const AdminCategoriesPage = () => {
    const { fetchAllCategories } = useContext(ProductContext);
    const [categoriesData, setCategoriesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await fetchAllCategories();
                setCategoriesData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleRowClick = (id) => {
        const selectedCategory = categoriesData.find(category => category.idCategoriaProductos === id);
        navigate(`/admin/categories/${id}`, { state: { categoryDetails: selectedCategory } });
    };

    const handleCreateButtonClick = () => {
        navigate('/admin/categories/create');
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Paper>
            <Grid container justifyContent="space-between" alignItems="center">
                <Typography variant="h5" component="div" style={{ padding: '16px' }}>
                    Lista de Categorías
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateButtonClick}
                >
                    Crear Categoría
                </Button>
            </Grid>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                        <TableCell>ID</TableCell>
                            <TableCell>Nombre Categoría</TableCell>
                            <TableCell>Estado Categoría</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categoriesData.map((category) => (
                            <TableRow
                                key={category.idCategoriaProductos}
                                hover
                                onClick={() => handleRowClick(category.idCategoriaProductos)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell>{category.idCategoriaProductos}</TableCell>
                                <TableCell>{category.NombreCategoria}</TableCell>
                                <TableCell>{category.Estado}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default AdminCategoriesPage;
