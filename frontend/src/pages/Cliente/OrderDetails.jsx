import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, TextField, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

//Contextos
import { OrdenContext } from '../../context/OrdenContext';

//Iconos
import CancelIcon from '@mui/icons-material/Cancel';
import RedoIcon from '@mui/icons-material/Redo';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { fetchOrderDetails, updateOrder } = useContext(OrdenContext);
    const [orderDetails, setOrderDetails] = useState(null);
    const [error, setError] = useState(null);
    const [showCancelForm, setShowCancelForm] = useState(false);
    const [showReturnForm, setShowReturnForm] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [returnReason, setReturnReason] = useState('');
    const [showReturnButton, setShowReturnButton] = useState(false);
    const [clientInfo, setClientInfo] = useState({
        nombre_completo: '',
        telefono: '',
        correo: '',
        direccion: '',
        fecha_entrega: '',
        total_orden: '',
        idEstados: '',
        motivo_rechazo: ''
    });

    useEffect(() => {
        const getOrderDetails = async () => {
            try {
                if (!orderId) {
                    console.error('No se encuentra ID de la orden.');
                    return;
                }

                const data = await fetchOrderDetails(orderId);

                const order = location.state.orderDetails;

                const products = data.detallesOrden.split(';').map(detail => {
                    const parts = detail.split(',').map(part => part.trim());
                    const product = {};
                    parts.forEach(part => {
                        const [key, value] = part.split(':').map(p => p.trim());
                        if (key && value) {
                            product[key] = value;
                        }
                    });
                    return product;
                });

                setOrderDetails({ ...data, products, order });
                setClientInfo({
                    nombre_completo: order.nombre_completo,
                    telefono: order.telefono,
                    correo: order.correo,
                    direccion: order.direccion,
                    fecha_entrega: order.fecha_entrega,
                    total_orden: order.total_orden,
                    idEstados: '',
                    motivo_rechazo: 'Sin descripción.'
                });

                if (order.Estado === 'Entregado') {
                    setShowReturnButton(true);
                }
            } catch (err) {
                console.log('Error al hacer fetch.')
                setError(err.message);
            }
        };
        getOrderDetails();
    }, [orderId, fetchOrderDetails, location.state]);

    //Funciones para botones

    const handleCancelOrder = () => {
        setShowCancelForm(true);
    };

    const handleReturnOrder = () => {
        setShowReturnForm(true);
    };

    const handleCancelSubmit = async () => {
        try {
            await updateOrder(orderId, {
                ...clientInfo,
                idEstados: 2,
                motivo_rechazo: cancelReason
            });
            navigate('/order'); // Regresa a la página de órdenes después de cancelar
        } catch (err) {
            console.error('Error al cancelar la orden.', err);
        }
    };

    const handleReturnSubmit = async () => {
        try {
            await updateOrder(orderId, {
                ...clientInfo,
                idEstados: 6,
                motivo_rechazo: returnReason
            });
            navigate('/order'); // Regresa a la página de órdenes después de devolver
        } catch (err) {
            console.error('Error al devolver la orden.', err);
        }
    };

    const handleBackToOrders = () => {
        navigate('/order');
    };


    if (error) return <div>Error: {error}</div>;

    return (
        <Box padding={2}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h4" component="h1">
                    Detalles de la Orden
                </Typography>
                <Button variant="contained" color="primary" onClick={handleBackToOrders} startIcon={<ArrowBackIcon />}>
                    Regresar a Órdenes
                </Button>
            </Box>

            {orderDetails && (
                <Box mb={2}>
                    <Typography variant="h6">Factura</Typography>
                    <Typography>Nombre: {orderDetails.order.nombre_completo}</Typography>
                    <Typography>Correo: {orderDetails.order.correo}</Typography>
                    <Typography>Teléfono: {orderDetails.order.telefono}</Typography>
                    <Typography>Dirección: {orderDetails.order.direccion}</Typography>
                </Box>
            )}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Marca</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Subtotal</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderDetails ? (
                            orderDetails.products.map((product, index) => (
                                <TableRow key={index}>
                                    <TableCell>{product['Nombre']}</TableCell>
                                    <TableCell>{product['Marca']}</TableCell>
                                    <TableCell>{product['Cantidad']}</TableCell>
                                    <TableCell>{product['Precio']}</TableCell>
                                    <TableCell>{product['Subtotal']}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6}>Loading...</TableCell>
                            </TableRow>
                        )}
                        {orderDetails && (
                            <TableRow>
                                <TableCell colSpan={4}>Total</TableCell>
                                <TableCell>{orderDetails.total_orden}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {orderDetails && (
                <Box display="flex" mt={2}>
                    {orderDetails.order.Estado === 'Cancelado' || orderDetails.order.Estado === 'Devuelto' ? (
                        <Typography variant="body1">
                            {orderDetails.order.Estado === 'Cancelado' ? 'Pedido Cancelado.' : 'Pedido Devuelto.'}
                        </Typography>
                    ) : (
                        <>
                            {!showReturnButton && (
                                <Button variant="contained" color="error" onClick={handleCancelOrder} startIcon={<CancelIcon />} sx={{ mr: 2 }}>
                                    Cancelar Pedido
                                </Button>
                            )}

                            {showReturnButton && (
                                <Button variant="contained" color="secondary" onClick={handleReturnOrder} startIcon={<RedoIcon />}>
                                    Devolver Pedido
                                </Button>
                            )}

                        </>
                    )}
                </Box>
            )}

            {showCancelForm && (
                <Box mt={2}>
                    <Typography variant="h6">Motivo de Rechazo</Typography>
                    <TextField
                        label="Motivo"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                    />
                    <Button variant="contained" color="error" onClick={handleCancelSubmit} sx={{ mt: 2 }}>
                        Confirmar Cancelación
                    </Button>
                </Box>
            )}

            {showReturnForm && (
                <Box mt={2}>
                    <Typography variant="h6">Motivo de Devolución</Typography>
                    <TextField
                        label="Motivo"
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                    />
                    <Button variant="contained" color="error" onClick={handleReturnSubmit} sx={{ mt: 2 }}>
                        Confirmar Devolución
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default OrderDetailsPage;
