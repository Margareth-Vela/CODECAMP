import React, { createContext, useState, useEffect } from 'react';
import { fetchProducts as apiActiveProducts, fetchAllProducts as apiProducts, updateProducts as apiUpdate, fetchAllCategories as apiCategories, createProducts as apiCreateProducts, checkCode as apiCheck, createCategory as apiCreateCategory, fetchProductbyCategory as apiProduct_by_Category, checkName as apiCheckName, updateCategories as apiUpdateCategory } from '../api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await apiActiveProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      }
    };

    getProducts();
  }, []);

  //*********************************************************
  //                    CRUD PRODUCTOS
  //*********************************************************
  const createProduct = async (nuevoProducto) => {
    try {
        const response = await apiCreateProducts(nuevoProducto);
        setProducts((prevProducts) => [...prevProducts, response.data]);
    } catch (err) {
        setError(err.message);
    }
};

const checkCode = async (codigo) => {
  try {
      const response = await apiCheck(codigo);
      return response
  } catch (err) {
      setError(err.message);
  }
};

  const fetchAllProducts = async () => {
    try {
      const data = await apiProducts();
      return data;
    } catch (error) {
      setError(error.message);
    }
  };

  const updateProducts = async (productId, productInfo) => {
    try {
        const data = await apiUpdate(productId, productInfo);
        return data;
    } catch (error) {
        setError(error.message);
    }
};

  //*********************************************************
  //                    CRUD CATEGORIAS
  //*********************************************************
  const createCategory = async (nuevaCategoria) => {
    try {
        const response = await apiCreateCategory(nuevaCategoria);
        setCategories((prevCategories) => [...prevCategories, response.data]);
    } catch (err) {
        setError(err.message);
    }
};

const checkName = async (nombre) => {
  try {
      const response = await apiCheckName(nombre);
      return response
  } catch (err) {
      setError(err.message);
  }
};

  const fetchAllCategories = async () => {
    try {
      const data = await apiCategories();
      return data;
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchProductbyCategory = async () => {
    try {
      const data = await apiProduct_by_Category();
      return data;
    } catch (error) {
      setError(error.message);
    }
  };

  const updateCategories = async (categoryId, categoryInfo) => {
    try {
        const data = await apiUpdateCategory(categoryId, categoryInfo);
        return data;
    } catch (error) {
        setError(error.message);
    }
};

  return (
    <ProductContext.Provider value={{ products, createProduct, checkCode, fetchAllProducts, updateProducts, fetchAllCategories, createCategory, updateCategories, fetchProductbyCategory, checkName }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
