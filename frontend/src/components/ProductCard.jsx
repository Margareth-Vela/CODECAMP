import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

const ProductCard = ({ product }) => {
  return (
    <Card sx={{ maxWidth: 345, marginBottom: 2 }}>
      <CardMedia
        component="img"
        height="140"
        image={product.foto}
        alt={product.nombre}
      />
      <CardContent>
        <Typography variant="h6" component="div">
          {product.nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.nombreCategoria}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.nombreEstado}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Marca: {product.marca}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Stock: {product.stock}
        </Typography>
        <Typography variant="h6" color="text.primary">
          ${product.precio}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
