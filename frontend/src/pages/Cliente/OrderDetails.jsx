import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

//Contextos
import { OrdenContext } from '../../context/OrdenContext';

//Iconos
import CancelIcon from '@mui/icons-material/Cancel';
import RedoIcon from '@mui/icons-material/Redo';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

//Componentes
import TextFieldController from '../../components/TextFieldController';

//Schema
import orderDetailsSchema from '../../validation/orderDetailsSchema';

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { fetchOrderDetails, updateOrder } = useContext(OrdenContext);
    const [orderDetails, setOrderDetails] = useState(null);
    const [error, setError] = useState(null);
    const [showCancelForm, setShowCancelForm] = useState(false);
    const [showReturnForm, setShowReturnForm] = useState(false);
    const [showReturnButton, setShowReturnButton] = useState(false);
    const order = location.state.orderDetails;

    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(orderDetailsSchema),
        defaultValues: {
            nombre_completo: '',
            telefono: '',
            correo: '',
            direccion: '',
            fecha_entrega: '',
            total_orden: '',
            idEstados: '',
            motivo_rechazo: '',
        }
    });

    useEffect(() => {
        const getOrderDetails = async () => {
            try {
                if (!orderId) {
                    console.error('No se encuentra ID de la orden.');
                    return;
                }

                const data = await fetchOrderDetails(orderId);

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
                setValue('nombre_completo', order.nombre_completo);
                setValue('telefono', order.telefono);
                setValue('correo', order.correo);
                setValue('direccion', order.direccion);
                setValue('fecha_entrega', order.fecha_entrega);
                setValue('total_orden', order.total_orden);
                setValue('idEstados', '');
                if (order.motivo_rechazo != null) {
                    setValue('motivo_rechazo', order.motivo_rechazo);
                } else {
                    setValue('motivo_rechazo', '');
                }

                if (order.Estado === 'Entregado') {
                    setShowReturnButton(true);
                }
            } catch (err) {
                console.log('Error al hacer fetch.')
                setError(err.message);
            }
        };
        getOrderDetails();
    }, [orderId, setValue]);

    //Funciones para botones

    const handleCancelOrder = () => {
        setValue('idEstados', '2')
        setShowCancelForm(true);
    };

    const handleReturnOrder = () => {
        setValue('idEstados', '6')
        setShowReturnForm(true);
    };

    const onSubmit = async (data) => {
        if (!data.motivo_rechazo) {
            data.motivo_rechazo = 'Sin descripción.';
        }
        try {
            await updateOrder(orderId, data);
            alert('Orden actualizada con éxito');
            navigate('/order')
        } catch (error) {
            console.error('Error al actualizar orden:', error);
        }
    };

    const handleBackToOrders = () => {
        navigate('/order');
    };

    if (!orderDetails) return <Typography>Cargando...</Typography>;

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
                                <TableCell colSpan={6}>Cargando...</TableCell>
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextFieldController
                            name="motivo_rechazo"
                            control={control}
                            label="Motivo de rechazo"
                            errors={errors}
                        />
                        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
                            Confirmar cancelación
                        </Button>
                    </form>
                </Box>
            )}

            {showReturnForm && (
                <Box mt={2}>
                    <Typography variant="h6">Motivo de Devolución</Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextFieldController
                            name="motivo_rechazo"
                            control={control}
                            label="Motivo de rechazo"
                            errors={errors}
                        />
                        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
                            Confirmar devolución
                        </Button>
                    </form>
                </Box>
            )}
        </Box>
    );
};

export default OrderDetailsPage;
