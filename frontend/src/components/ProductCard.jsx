//Librerias locales
import React from 'react';
import { Card, CardContent, CardMedia, IconButton, Typography, Badge, Box } from '@mui/material';

//Iconos de la aplicacion 
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

const ProductCard = ({ product, addToCart, removeFromCart, cartItem }) => {

  return (
    <Card sx={{maxWidth: 345, marginBottom: 2}}>
      <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
        <CardMedia
          component="img"
          sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
          image={product.foto}
          alt={product.nombre}
        />
      </Box>

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
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
          <IconButton color="primary" onClick={() => addToCart(product)}>
            <AddShoppingCartIcon />
          </IconButton>
          <Box display="flex" alignItems="center">
            <Badge badgeContent={cartItem ? cartItem.quantity : 0} color="secondary">
              <Typography variant="body1">{cartItem ? cartItem.quantity : 0}</Typography>
            </Badge>
          </Box>
          <IconButton color="secondary" onClick={() => removeFromCart(product.idProductos)}>
            <RemoveShoppingCartIcon />
          </IconButton>
        </Box>
        
      </CardContent>
    </Card>
  );
};

export default ProductCard;
