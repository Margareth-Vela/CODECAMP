import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Paper, Typography, Button, Grid } from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

//Contextos
import { OrdenContext } from '../context/OrdenContext';

//Componentes
import TextFieldController from '../components/TextFieldController';
import SelectFieldController from '../components/SelectFieldController';

//Schema
import orderDetailsSchema from '../validation/orderDetailsSchema';

// Mapa de IDs a Labels
const stateIdMap = {
    'Confirmado': '1',
    'Cancelado': '2',
    'Devuelto': '6',
    'En proceso': '4',
    'Enviado': '5',
    'Entregado': '3'
};

// Filtrar los estados disponibles
const availableStates = [
    { id: '1', label: 'Confirmado' },
    { id: '2', label: 'Cancelado' },
    { id: '6', label: 'Devuelto' },
    { id: '4', label: 'En proceso' },
    { id: '5', label: 'Enviado' },
    { id: '3', label: 'Entregado' }
];

const AdminOrderDetailPage = () => {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { fetchOrderDetails, updateOrder } = useContext(OrdenContext);
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state.orderDetails;

    const currentStateId = stateIdMap[order.Estado];
    const filteredStates = availableStates.filter(state => state.id !== currentStateId);

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

    const selectedState = useWatch({ control, name: 'idEstados' });

    useEffect(() => {
        const fetchOrder = async () => {
            try {
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
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        fetchOrder();
    }, [orderId, setValue]);

    const onSubmit = async (data) => {
        if (!data.motivo_rechazo) {
            data.motivo_rechazo = 'Sin descripción.';
        }
        try {
            await updateOrder(orderId, data);
            alert('Orden actualizada con éxito');
            setIsEditing(false);
            navigate('/admin/Home')
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    console.log('Selected state', selectedState)

    if (!orderDetails) return <Typography>Cargando...</Typography>;

    return (
        <Paper style={{ padding: '16px' }}>
            <Typography variant="h5" component="div" gutterBottom>
                Detalles de la Orden #{orderId}
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography><strong>ID Usuario:</strong> {orderDetails.order.idUsuarios}</Typography>
                    <Typography><strong>Nombre Completo:</strong> {orderDetails.order.nombre_completo}</Typography>
                    <Typography><strong>Estado:</strong> {orderDetails.order.Estado}</Typography>
                    <Typography><strong>Fecha de Entrega:</strong> {orderDetails.fecha_entrega}</Typography>
                    <Typography><strong>Dirección:</strong> {orderDetails.direccion}</Typography>
                    <Typography><strong>Teléfono:</strong> {orderDetails.telefono}</Typography>
                    <Typography><strong>Correo:</strong> {orderDetails.order.correo}</Typography>
                    <Typography><strong>Total:</strong> {orderDetails.total_orden}</Typography>
                    {orderDetails.order.Estado === 'Cancelado' || orderDetails.order.Estado === 'Devuelto' ? (
                        <Typography><strong>Motivo de Rechazo:</strong> {orderDetails.order.motivo_rechazo}</Typography>
                    ) : null}
                </Grid>
                {isEditing && (
                    <Grid item xs={12}>
                        <Typography variant="h6">Actualizar Orden:</Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextFieldController
                                name="correo"
                                control={control}
                                label="Correo Electrónico"
                                type="email"
                                errors={errors}
                            />

                            <TextFieldController
                                name="direccion"
                                control={control}
                                label="Dirección"
                                errors={errors}
                            />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <SelectFieldController
                                        name="idEstados"
                                        control={control}
                                        label="Estado"
                                        options={filteredStates}
                                        errors={errors}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextFieldController
                                        name="fecha_entrega"
                                        control={control}
                                        label="Fecha de Entrega"
                                        type="date"
                                        errors={errors}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextFieldController
                                        name="telefono"
                                        control={control}
                                        label="Teléfono"
                                        errors={errors}
                                    />
                                </Grid>

                            </Grid>
                            {selectedState === '2' || selectedState === '6' ? (
                                <TextFieldController
                                    name="motivo_rechazo"
                                    control={control}
                                    label="Motivo de Rechazo"
                                    errors={errors}
                                />
                            ) : null}
                            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
                                Actualizar Orden
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
                        {isEditing ? 'Cancelar' : 'Actualizar Orden'}
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default AdminOrderDetailPage;
