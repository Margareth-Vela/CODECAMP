//Librerias locales React
import React, { useContext, useState } from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';

//Contextos
import ProductContext from '../context/ProductContext';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

//Componentes
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Sidebar from '../components/SideBar';

const HomePage = () => {
  const { products } = useContext(ProductContext);
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', ...new Set(products.map(product => product.nombreCategoria))];

  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter(product => product.nombreCategoria === selectedCategory);

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
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ width: '220px', position: 'sticky', top: '66px', height: 'calc(100vh - 66px)', overflowY: 'auto', overflowX: 'hidden'}}>
            <Sidebar categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          </Box>
          <Box sx={{ position: 'sticky', flex: 1, overflowY: 'auto', padding: '16px' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Catálogo de productos
            </Typography>

            <Box flex="1" ml={2}>
              <Grid container spacing={3}>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.idProductos}>
                      <ProductCard product={product}
                        addToCart={handleAddToCart}
                        removeFromCart={handleRemoveFromCart}
                        cartItem={getCartItem(product.idProductos)}
                      />

                    </Grid>
                  ))
                ) : (
                  <Typography>No hay productos disponibles.</Typography>
                )}

              </Grid>
            </Box>
          </Box>
        </Box>
      </Container >
    </>
  );
};

export default HomePage;
