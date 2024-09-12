//Librerias locales
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, IconButton, Typography, Badge, Box } from '@mui/material';

//Iconos de la aplicacion 
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

const ProductCard = ({ product, addToCart, removeFromCart, cartItem }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const convertToBase64 = async () => {
      if (product.foto) {
        const arrayBuffer = Uint8Array.from(product.foto.data);
        const base64 = arrayBufferToBase64(arrayBuffer);
        setImageUrl(`data:image/jpeg;base64,${base64}`);
      }
    };

    convertToBase64();
  }, [product.foto]);

  // Función para convertir ArrayBuffer a Base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // Verifica si el producto está en stock
  const isOutOfStock = product.stock === 0;

  return (
    <Card sx={{ maxWidth: 345, marginBottom: 2, position: 'relative', opacity: isOutOfStock ? 0.5 : 1, pointerEvents: isOutOfStock ? 'none' : 'auto' }}>
      <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
        <CardMedia
          component="img"
          sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
          image={imageUrl}
          alt={product.nombre}
        />
        {product.nombreEstado === 'En descuento' && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bgcolor: 'error.main',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '0 0 4px 0',
              fontWeight: 'bold',
              fontSize: '0.75rem',
            }}
          >
            En descuento
          </Box>
        )}
      </Box>

      <CardContent>
        <Typography variant="h6" component="div">
          {product.nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.nombreCategoria}
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
          <IconButton color="primary" onClick={() => addToCart(product)} disabled={isOutOfStock}>
            <AddShoppingCartIcon />
          </IconButton>
          <Box display="flex" alignItems="center">
            <Badge badgeContent={cartItem ? cartItem.quantity : 0} color="secondary">
              <Typography variant="body1">{cartItem ? cartItem.quantity : 0}</Typography>
            </Badge>
          </Box>
          <IconButton color="secondary" onClick={() => removeFromCart(product.idProductos)} disabled={isOutOfStock}>
            <RemoveShoppingCartIcon />
          </IconButton>
        </Box>

      </CardContent>
    </Card>
  );
};

export default ProductCard;
