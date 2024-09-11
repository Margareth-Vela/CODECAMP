import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Paper, Typography, Button, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

//Contextos
import { AuthContext } from '../../context/AuthContext';
import { OrdenContext } from '../../context/OrdenContext';

//Componentes
import TextFieldController from '../../components/TextFieldController';
import SelectFieldController from '../../components/SelectFieldController';

//Schema
import registerSchema from '../../validation/registerSchema';

// Estados disponibles
const availableStates = [
    { id: '7', label: 'Activo' },
    { id: '8', label: 'Inactivo' }
];

// Estados disponibles
const availableRoles = [
    { id: '1', label: 'Cliente' },
    { id: '2', label: 'Operador' }
];

const AdminUserDetailPage = () => {
    const { userId } = useParams();
    const [orders, setOrders] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { fetchOrderUser } = useContext(OrdenContext);
    const { updateUsers } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const userDetails = location.state.userDetails;

    const modifiedSchema = registerSchema.shape({
        password: yup.string().notRequired(),
        confirmPassword: yup.string().notRequired(),
        idEstados: yup.string().required('El estado es requerido.')
    });

    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(modifiedSchema),
        defaultValues: {
            Nombre_completo: '',
            telefono: '',
            Correo: '',
            password: '',
            confirmPassword: '',
            fecha_nacimiento: '',
            idRol: '',
            idEstados: ''
        }
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await fetchOrderUser(userId);
                setOrders(data);

                setValue('Nombre_completo', userDetails.Nombre_completo);
                setValue('telefono', userDetails.telefono);
                setValue('Correo', userDetails.Correo);
                setValue('fecha_nacimiento', userDetails.fecha_nacimiento);

            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        fetchOrders();
    }, [userId, setValue]);

    const onSubmit = async (data) => {
        try {
            await updateUsers(userId, data);
            alert('Usuario actualizado con éxito');
            setIsEditing(false);
            navigate('/admin/users')
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleRowClick = (orderId) => {
        try {
            const selectedOrder = orders.find(order => order.idOrden === orderId);
            navigate(`/admin/order/${orderId}`, { state: { orderDetails: selectedOrder } });
        } catch (err) {
            setError(err.message);
        }
    };

    if (!orders) return <Typography>Cargando...</Typography>;

    return (
        <Grid container justifyContent="center" style={{ padding: '20px' }}>
            <Grid item xs={12} md={10} lg={8}>
                <Paper style={{ padding: '16px', marginBottom: '20px' }}>
                    <Typography variant="h5" component="div" gutterBottom>
                        Detalles del Usuario #{userId}
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography><strong>Nombre Completo:</strong> {userDetails.Nombre_completo}</Typography>
                            <Typography><strong>Correo:</strong> {userDetails.Correo}</Typography>
                            <Typography><strong>Teléfono:</strong> {userDetails.telefono}</Typography>
                            <Typography><strong>Fecha de nacimiento:</strong> {userDetails.fecha_nacimiento}</Typography>
                            <Typography><strong>Rol:</strong> {userDetails.Rol}</Typography>
                            <Typography><strong>Estado:</strong> {userDetails.Estado}</Typography>
                        </Grid>
                        {userDetails.Rol === 'Cliente' && orders.length > 0 ? (
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Órdenes del Usuario
                                </Typography>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID de Orden</TableCell>
                                                <TableCell>Estado de Orden</TableCell>
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
                                                    <TableCell>{order.Estado}</TableCell>
                                                    <TableCell>{order.fecha_entrega}</TableCell>
                                                    <TableCell>{order.total_orden}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        ) : userDetails.Rol === 'Cliente' ? (
                            <Grid item xs={12}>
                                <Typography>No hay órdenes realizadas por este usuario.</Typography>
                            </Grid>
                        ) : null}

                        {isEditing && (
                            <Grid item xs={12}>
                                <Typography variant="h6">Actualizar Usuario:</Typography>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <TextFieldController
                                        name="Nombre_completo"
                                        control={control}
                                        label="Nombre completo"
                                        errors={errors}
                                    />
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextFieldController
                                                name="Correo"
                                                control={control}
                                                label="Correo Electrónico"
                                                type="email"
                                                errors={errors}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <SelectFieldController
                                                name="idRol"
                                                control={control}
                                                label="Rol"
                                                options={availableRoles}
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
                                            <TextFieldController
                                                name="fecha_nacimiento"
                                                control={control}
                                                label="Fecha de Nacimiento"
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
                                    <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
                                        Actualizar Usuario
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
                                {isEditing ? 'Cancelar' : 'Actualizar Usuario'}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default AdminUserDetailPage;
