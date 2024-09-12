import React from 'react';
import { Card, CardContent, Typography, Box, Divider, Badge, Chip, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const OrderCard = ({ order }) => {
    const navigate = useNavigate();

    const handleClick = async () => {
        try {
            const orderId = order.idOrden;
            navigate(`/order/${orderId}`, { state: { orderDetails: order } });
        } catch (err) {
            setError(err.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'En proceso':
                return 'warning';
            case 'Confirmado':
                return 'info';
            case 'Entregado' || 'Enviado':
                return 'success';
            case 'Cancelado' || 'Devuelto':
                return 'error';
            default:
                return 'default';
        }
    };

    const StyledCard = styled(Card)({
        cursor: 'pointer',
        marginBottom: '1rem',
        position: 'relative',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        },
    });

    return (
        <Grid item xs={12} sm={6} md={4}>
            <StyledCard onClick={handleClick}>
                <Badge
                    badgeContent={
                        <Chip
                            label={order.Estado}
                            color={getStatusColor(order.Estado)}
                            size="small"
                            style={{ fontWeight: 'bold' }}
                        />
                    }
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    overlap="rectangular"
                    style={{ top: 20, right: 8 }}
                >
                    <CardContent style={{marginBottom: 10}}>
                        <Box mb={2}>
                            <Typography variant="h6">Detalles de la orden</Typography>
                            <Typography variant="body1">Nombre: {order.nombre_completo}</Typography>
                            <Typography variant="body1">Teléfono: {order.telefono}</Typography>
                            <Typography variant="body1">Correo: {order.correo}</Typography>
                            <Typography variant="body1">Dirección: {order.direccion}</Typography>
                        </Box>
                        <Divider />
                        <Box mt={2}>
                            <Typography variant="body1">Order ID: {order.idOrden}</Typography>
                            <Typography variant="body1">Fecha de entrega: {order.fecha_entrega}</Typography>
                            <Typography variant="body1">Estado de la orden: {order.Estado}</Typography>
                            <Typography variant="body1">Total: ${(order.total_orden).toFixed(2)}</Typography>
                        </Box>
                    </CardContent>
                </Badge>
            </StyledCard>
        </Grid>
    );
};

export default OrderCard;
