import React, { useContext, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

//Contextos
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { OrdenContext } from '../../context/OrdenContext';

//Esquemas
import ordenSchema from '../../validation/ordenSchema'

//Componentes
import TextFieldController from '../../components/TextFieldController';

//Iconos de la aplicacion 
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


const CartPage = () => {
  const { cartItems, addToCart, removeFromCart, removeProduct, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { createOrden } = useContext(OrdenContext);

  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(ordenSchema),
    defaultValues: {
      nombre_completo: user.name || '',
      telefono: '',
      correo: '',
      direccion: '',
    },
  });
  const [isConfirming, setIsConfirming] = useState(false);


  //Total del carrito
  const getTotal = () => {
    const total = cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);
    return total.toFixed(2);
  };

  //Funciones para botones

  const handleCancelClick = () => {
    clearCart();
    navigate('/');
  };

  const handleConfirmClick = () => {
    setIsConfirming(true);
  };

  const onSubmit = (data) => {
    const orderDetails = cartItems.map(item => ({
      idProducto: item.idProductos,
      cantidad: item.quantity,
    }));

    const order = {
      ...data,
      fecha_entrega: getDeliveryDateJSON(),
      detallesOrden: orderDetails,
    };

    createOrden(order);
    clearCart();
    navigate('/');
  };

  const getDeliveryDate = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 10);
    return deliveryDate.toLocaleDateString();
  };

  const getDeliveryDateJSON = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 10);
    const year = deliveryDate.getFullYear();
    const month = String(deliveryDate.getMonth() + 1).padStart(2, '0');
    const day = String(deliveryDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Carrito de compras
        </Typography>
        {cartItems.length > 0 ? (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Subtotal</TableCell>
                    <TableCell>Quitar del carrito</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.idProductos}>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell>${item.precio}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => removeFromCart(item.idProductos)}>
                          <RemoveIcon />
                        </IconButton>
                        {item.quantity}
                        <IconButton onClick={() => addToCart(item)}>
                          <AddIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>${(item.precio * item.quantity).toFixed(2)}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => removeProduct(item.idProductos)}>
                          <RemoveShoppingCartIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h6" component="h2" gutterBottom>
              Total: ${getTotal()}
            </Typography>
          </>
        ) : (
          <Typography>No hay productos en el carrito.</Typography>
        )}

        {isConfirming && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" component="h2" gutterBottom>
              Datos de facturación
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextFieldController
                  name="nombre_completo"
                  control={control}
                  label="Nombre Completo"
                  errors={errors}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextFieldController
                  name="telefono"
                  control={control}
                  label="Teléfono"
                  errors={errors}
                />
              </Grid>
              <Grid item xs={12}>
                <TextFieldController
                  name="correo"
                  control={control}
                  label="Correo"
                  errors={errors}
                />
              </Grid>
              <Grid item xs={12}>
                <TextFieldController
                  name="direccion"
                  control={control}
                  label="Dirección"
                  errors={errors}
                />
              </Grid>
            </Grid>
            <Typography variant="h6" component="h2" gutterBottom style={{ marginTop: '16px' }}>
              Fecha de entrega estimada: {getDeliveryDate()}
            </Typography>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: '16px', marginBottom: '16px' }}
            >
              Enviar orden
            </Button>
          </form>
        )
        }

        {!isConfirming && (
          <Button variant="contained" color="secondary" startIcon={<CheckCircleIcon />} style={{ marginRight: '8px' }} onClick={handleConfirmClick}>
            Confirmar
          </Button>
        )
        }
        <Button variant="contained" color="default" startIcon={<CancelIcon />} onClick={handleCancelClick}>
          Cancelar
        </Button>
      </Container>
    </>
  );
};

export default CartPage;
