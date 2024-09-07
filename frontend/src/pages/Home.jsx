import React, { useContext } from 'react';
import ProductContext from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { Container, Typography, Grid } from '@mui/material';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const { products } = useContext(ProductContext);

  return (
    <>
      <Navbar />
      <Container sx={{ paddingTop: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Home Page
        </Typography>
        <Grid container spacing={3}>
          {products.length > 0 ? (
            products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.idProductos}>
                <ProductCard product={product} />
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
