import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/', // URL Backend
});

// ***********************************************************************
//                  Request Tokens
// ***********************************************************************
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ***********************************************************************
//                        LOGIN
// ***********************************************************************
export const login = async (credentials) => {
  try {
    const { data } = await api.post('/login', credentials);
    //Guardar datos de token y usuarios 
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ id: data.userId, name: data.userName, rol: data.userRole }));
    return data;
  } catch (error) {
    throw error;
  }

};

// ***********************************************************************
//                        LOGOUT
// ***********************************************************************
export const logout = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Logout failed', error);
    throw error;
  }
};

// ***********************************************************************
//                        CREATE/REGISTER
// ***********************************************************************
export const register = async (userInfo) => {
  const { data } = await api.post('/users/create', userInfo);
  return data;
};

// ***********************************************************************
//                        ENVIAR ORDEN
// ***********************************************************************
export const submitOrder = async (ordenInfo) => {
  try {
    const { data } = await api.post('/orden/create', ordenInfo);
    return data;
  } catch (error) {
    console.error('Error al enviar orden.', error);
    throw error;
  }
};

// ***********************************************************************
//                        ACTUALIZAR ORDEN
// ***********************************************************************
export const updateOrder = async (orderId, ordenInfo) => {
  try {
    await api.put(`/orden/update/${orderId}`, ordenInfo);
  } catch (error) {
    console.error('Error al enviar orden.', error);
    throw error;
  }
};

// ***********************************************************************
//                        OBTENER ORDEN USUARIO
// ***********************************************************************
export const fetchOrderUser = async (userId) => {
  try {
    const { data } = await api.get(`/orden/user/${userId}`);
    return data;
  } catch (error) {
    console.error('Error al obtener ordenes del usuario.', error);
    throw error;
  }
};
// ***********************************************************************
//                        OBTENER ORDEN DETALLES
// ***********************************************************************
export const fetchOrderDetails = async (orderId) => {
  try {
    const { data } = await api.get(`/orden/details/${orderId}`);
    return data[0];
  } catch (error) {
    console.error('Error al obtener detalles de la orden.', error);
    throw error;
  }
};

// ***********************************************************************
//                        OBTENER PRODUCTOS
// ***********************************************************************
export const fetchProducts = async () => {
  const { data } = await api.get('/products');
  return data[0];
};

export default api;