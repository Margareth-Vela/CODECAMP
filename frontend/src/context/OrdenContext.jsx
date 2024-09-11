import React, { createContext, useState } from 'react';
import { submitOrder as apiOrden, fetchOrderDetails as apiOrderDetails, fetchOrderUser as apiOrderUser, updateOrder as apiUpdate, fetchOrder as apiOrders } from '../api';

// Crear el contexto
export const OrdenContext = createContext();

// Crear el proveedor del contexto
export const OrdenProvider = ({ children }) => {
    const [ordenes, setOrdenes] = useState([]);
    const [error, setError] = useState(null);

    // Función para crear una nueva orden
    const createOrden = async (nuevaOrden) => {
        try {
            const response = await apiOrden(nuevaOrden);
            setOrdenes((prevOrdenes) => [...prevOrdenes, response.data]);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchOrderUser = async (userId) => {
        try {
            const data = await apiOrderUser(userId);
            return data;
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchOrderDetails = async (orderId) => {
        try {
            const data = await apiOrderDetails(orderId);
            return data;
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchOrders = async () => {
        try {
            const data = await apiOrders();
            return data;
        } catch (error) {
            setError(error.message);
        }
    };
    

    const updateOrder = async (orderId, OrderInfo) => {
        try {
            const data = await apiUpdate(orderId, OrderInfo);
            return data;
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <OrdenContext.Provider value={{ordenes, error, createOrden, fetchOrderUser, fetchOrderDetails, updateOrder, fetchOrders }}>
            {children}
        </OrdenContext.Provider>
    );
};
