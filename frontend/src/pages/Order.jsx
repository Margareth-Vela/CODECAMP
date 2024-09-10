import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Divider, Grid } from '@mui/material';

//Contextos
import { AuthContext } from '../context/AuthContext';
import { OrdenContext } from '../context/OrdenContext';

//Componentes
import OrderCard from '../components/OrderCard';


const OrderPage = () => {
  const { user } = useContext(AuthContext);
  const { fetchOrders } = useContext(OrdenContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);


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


  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Bienvenido, {user.name}
      </Typography>
        <Typography variant="h5" component="h2">
          Historial de órdenes
        </Typography>
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
