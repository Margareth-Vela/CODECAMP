import React, { useState, useEffect, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

//Contextos
import ProductContext from '../../context/ProductContext';

const AdminProductsPage = () => {
    const { fetchAllProducts } = useContext(ProductContext);
    const [productsData, setProductsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await fetchAllProducts();
                console.log
                setProductsData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);


    const handleRowClick = (id) => {
        const selectedProduct = productsData.find(product => product.idProductos === id);
        navigate(`/admin/products/${id}`, { state: { productDetails: selectedProduct } });
    };

    const handleCreateButtonClick = () => {
        navigate('/admin/products/create');
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
                    Listado de Productos
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateButtonClick}
                >
                    Crear Producto
                </Button>
            </Grid>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                        <TableCell>ID</TableCell>
                            <TableCell>Nombre Categoría</TableCell>
                            <TableCell>Nombre Producto</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Marca</TableCell>
                            <TableCell>Código</TableCell>
                            <TableCell>Stock</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productsData.map((product) => (
                            <TableRow
                                key={product.idProductos}
                                hover
                                onClick={() => handleRowClick(product.idProductos)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell>{product.idProductos}</TableCell>
                                <TableCell>{product.nombreCategoria}</TableCell>
                                <TableCell>{product.nombre}</TableCell>
                                <TableCell>{product.nombreEstado}</TableCell>
                                <TableCell>{product.marca}</TableCell>
                                <TableCell>{product.codigo}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default AdminProductsPage;
