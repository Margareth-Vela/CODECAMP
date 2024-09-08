//Librerias locales React
import React, { useContext } from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';

//Contextos
import ProductContext from '../context/ProductContext';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

//Componentes
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';


const HomePage = () => {
  const { products } = useContext(ProductContext);
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  console.log('productosHome', products);
  //Funciones handler 
  const handleAddToCart = (product) => {
    if (user) {
      addToCart(product);
    } else {
      history.push('/login'); // Redirige a la página de inicio de sesión
    }
  };

  const handleRemoveFromCart = (productId) => {
    if (user) {
      removeFromCart(productId);
    } else {
      history.push('/login'); // Redirige a la página de inicio de sesión
    }
  };

  const getCartItem = (productId) => {
    const cartItem = cartItems.find(item => item.idProductos === productId);
    return cartItem;
  };

  return (
    <>
      <Navbar />
      <Container sx={{ paddingTop: 2 }}>
        <Box marginBottom={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Home Page
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {products.length > 0 ? (
            products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.idProductos}>
                <ProductCard product={product} 
                addToCart={handleAddToCart}
                removeFromCart={handleRemoveFromCart}
                cartItem={getCartItem(product.idProductos)}
                />

              </Grid>
            ))


          ) : (
            <Typography>No products available</Typography>
          )}

        </Grid>
      </Container>
    </>
  );
};

export default HomePage;
