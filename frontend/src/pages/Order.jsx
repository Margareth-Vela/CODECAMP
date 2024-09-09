import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Divider, IconButton, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

//Contextos
import { AuthContext } from '../context/AuthContext';
import { OrdenContext } from '../context/OrdenContext';

//Componentes
import OrderCard from '../components/OrderCard';

//Iconos de la aplicacion
import { Home as HomeIcon } from '@mui/icons-material';

const OrderPage = () => {
  const { user } = useContext(AuthContext);
  const { fetchOrders } = useContext(OrdenContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchOrders(user.id);
        setOrders(data);
      } catch (err) {
        setError(err.message);
      }
    };
    getOrders();
  }, [user.id, fetchOrders]);


  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Bienvenido, {user.name}
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" component="h2">
          Historial de órdenes
        </Typography>
        <IconButton color="primary" onClick={handleHomeClick}>
          <HomeIcon />
        </IconButton>
      </Box>
      <Divider />
      {orders.length === 0 ? (
        <Typography variant="body1">Aún no hay órdenes.</Typography>
      ) : (
        <Grid container spacing={2} style={{ marginTop: 10}}>
            {orders.map((order) => (
                <OrderCard key={order.idOrden} order={order} />
            ))}
        </Grid>
      )}
    </Container>
  );
};

export default OrderPage;
