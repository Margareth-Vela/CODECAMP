import React, { createContext, useState, useEffect } from 'react';
import { submitOrder as apiOrden } from '../api';

// Crear el contexto
export const OrdenContext = createContext();

// Crear el proveedor del contexto
export const OrdenProvider = ({ children }) => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
  useEffect(() => {
    // Función para obtener las órdenes desde la API
    const fetchOrdenes = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/ordenes');
        setOrdenes(response.data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchOrdenes();
  }, []);*/

  // Función para crear una nueva orden
  const createOrden = async (nuevaOrden) => {
    try {
      const response = await apiOrden(nuevaOrden);
      setOrdenes((prevOrdenes) => [...prevOrdenes, response.data]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <OrdenContext.Provider value={{ ordenes, loading, error, createOrden }}>
      {children}
    </OrdenContext.Provider>
  );
};
