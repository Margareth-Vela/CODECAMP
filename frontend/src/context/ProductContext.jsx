import React, { createContext, useState, useEffect } from 'react';
import { fetchProducts as apiProducts } from '../api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await apiProducts(); 
        setProducts(data);
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      }
    };

    getProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
