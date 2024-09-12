import React, { useEffect, useState, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

//Contextos
import { OrdenContext } from '../../context/OrdenContext';


const AdminHomePage = () => {
    const { fetchOrders } = useContext(OrdenContext);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await fetchOrders();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrder();
    }, []);

    const handleRowClick = (orderId) => {
        try {
            const selectedOrder = orders.find(order => order.idOrden === orderId);
            navigate(`/admin/order/${orderId}`, { state: { orderDetails: selectedOrder } });
        } catch (err) {
            setError(err.message);
        }
    };

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        return dateString.split('T')[0];
    };

    return (
        <Paper>
            <Typography variant="h5" component="div" style={{ padding: '16px' }}>
                Historial de Órdenes
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Orden</TableCell>
                            <TableCell>ID Usuario</TableCell>
                            <TableCell>Nombre Completo</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Fecha de Creación</TableCell>
                            <TableCell>Fecha de Entrega</TableCell>
                            <TableCell>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow 
                                key={order.idOrden} 
                                hover 
                                onClick={() => handleRowClick(order.idOrden)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell>{order.idOrden}</TableCell>
                                <TableCell>{order.idUsuarios}</TableCell>
                                <TableCell>{order.nombre_completo}</TableCell>
                                <TableCell>{order.Estado}</TableCell>
                                <TableCell>{formatDate(order.fecha_creacion)}</TableCell>
                                <TableCell>{order.fecha_entrega}</TableCell>
                                <TableCell>{(order.total_orden).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default AdminHomePage;
