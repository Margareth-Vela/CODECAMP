import React, { useContext } from 'react';
import { Container, Typography, List, ListItem, IconButton, Button } from '@mui/material';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { CartContext } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>
      <List>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <ListItem key={item.idProductos}>
              <Typography variant="body1">
                {item.nombre} - ${item.precio}
              </Typography>
              <Typography variant="body1">
                Cantidad - {item.quantity}
              </Typography>
              <IconButton onClick={() => removeFromCart(item.idProductos)}>
                <RemoveShoppingCartIcon />
              </IconButton>
              <IconButton onClick={() => addToCart(item)}>
                <AddShoppingCartIcon />
              </IconButton>
            </ListItem>
          ))
        ) : (
          <Typography>No items in the cart</Typography>
        )}
      </List>
      <Button variant="contained" color="primary">
        Checkout
      </Button>
    </Container>
  );
};

export default CartPage;
