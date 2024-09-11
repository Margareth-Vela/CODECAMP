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
//                        AUTENTICACION 
// ***********************************************************************

// --------------------------- LOGIN -------------------------------------- 
export const login = async (credentials) => {
  try {
    const { data } = await api.post('/login', credentials);
    //Guardar datos de token y usuarios 
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ id: data.userId, name: data.userName, rol: data.userRole }));
    return data;
  } catch (error) {
    console.error('Error al intentar login.', error);
    throw error;
  }

};
// --------------------------- LOGOUT -------------------------------------- 
export const logout = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Error al intentar logout.', error);
    throw error;
  }
};

// --------------------------- REGISTER -------------------------------------- 
export const register = async (userInfo) => {
  try {
    const { data } = await api.post('/users/create', userInfo);
    return data;
  } catch (error) {
    console.error('Error al crear el usuario.', error);
    throw error;
  }
};

export const registerAdmin = async (userInfo) => {
  try {
    const { data } = await api.post('/users/oper/create', userInfo);
    return data;
  } catch (error) {
    console.error('Error al crear el usuario.', error);
    throw error;
  }
};

// ***********************************************************************
//                        CRUD ORDENES
// ***********************************************************************

// --------------------------- ENVIAR ORDENES ----------------------------
export const submitOrder = async (ordenInfo) => {
  try {
    const { data } = await api.post('/orden/create', ordenInfo);
    return data;
  } catch (error) {
    console.error('Error al enviar orden.', error);
    throw error;
  }
};

// ------------------------ ACTUALIZAR ORDENES ----------------------------
export const updateOrder = async (orderId, ordenInfo) => {
  try {
    await api.put(`/orden/update/${orderId}`, ordenInfo);
  } catch (error) {
    console.error('Error al actualizar orden.', error);
    throw error;
  }
};

// --------------------------- GET ORDENES USER ----------------------------
export const fetchOrderUser = async (userId) => {
  try {
    const { data } = await api.get(`/orden/user/${userId}`);
    return data;
  } catch (error) {
    console.error('Error al obtener ordenes del usuario.', error);
    throw error;
  }
};

// --------------------------- GET ORDENES DETAILS----------------------------
export const fetchOrderDetails = async (orderId) => {
  try {
    const { data } = await api.get(`/orden/details/${orderId}`);
    return data[0];
  } catch (error) {
    console.error('Error al obtener detalles de la orden.', error);
    throw error;
  }
};

// --------------------------- GET ALL ORDENES ----------------------------
export const fetchOrder = async () => {
  try {
    const { data } = await api.get('/orden');
    return data[0];
  } catch (error) {
    console.error('Error al obtener ordenes.', error);
    throw error;
  }
};

// ***********************************************************************
//                        CRUD USUARIOS
// ***********************************************************************
// --------------------------- GET ALL USERS ----------------------------
export const fetchUsers = async () => {
  try {
    const { data } = await api.get('/users');
    return data[0];
  } catch (error) {
    console.error('Error al obtener detalles de los usuarios.', error);
    throw error;
  }
};

// ------------------------ ACTUALIZAR USUARIOS ----------------------------
export const updateUsers = async (userId, userInfo) => {
  try {
    await api.put(`/users/update/${userId}`, userInfo);
  } catch (error) {
    console.error('Error al actualizar el usuario.', error);
    throw error;
  }
};

// ***********************************************************************
//                        CRUD PRODUCTOS
// ***********************************************************************
// --------------------------- CREAR PRODUCTOS ----------------------------
export const createProducts = async (productInfo) => {
  try {
    const { data } = await api.post('/products/create', productInfo);
    return data;
  } catch (error) {
    console.error('Error al crear producto.', error);
    throw error;
  }
};

export const checkCode = async (codigo) => {
  try {
    const { data } = await api.post('/products/checkCode', { codigo });
    return data;
  } catch (error) {
    console.error('Erro al realizar check del codigo.', error);
    throw error;
  }
};
// --------------------------- GET ACTIVE PRODUCTS ----------------------------
export const fetchProducts = async () => {
  try {
    const { data } = await api.get('/products');
    return data[0];
  } catch (error) {
    console.error('Error al obtener productos activos.', error);
    throw error;
  }
};

// --------------------------- GET ALL PRODUCTS ----------------------------
export const fetchAllProducts = async () => {
  try {
    const { data } = await api.get('/products/getAll');
    return data[0];
  } catch (error) {
    console.error('Error al obtener productos.', error);
    throw error;
  }
};

// ------------------------ ACTUALIZAR PRODUCTOS ----------------------------
export const updateProducts = async (productId, productInfo) => {
  try {
    await api.put(`/products/update/${productId}`, productInfo);
  } catch (error) {
    console.error('Error al actualizar el producto.', error);
    throw error;
  }
};

// ***********************************************************************
//                        CRUD CATEGORIA PRODUCTOS
// ***********************************************************************
// --------------------------- CREAR CATEGORIA ----------------------------
export const createCategory = async (categoryInfo) => {
  try {
    const { data } = await api.post('/CatProducts/create', categoryInfo);
    return data;
  } catch (error) {
    console.error('Error al crear categoria.', error);
    throw error;
  }
};

export const checkName = async (nombre) => {
  try {
    const { data } = await api.post('/CatProducts/checkName', { nombre });
    return data;
  } catch (error) {
    console.error('Erro al realizar check del nombre.', error);
    throw error;
  }
};

// --------------------------- GET ALL CATEGORIES ----------------------------
export const fetchAllCategories = async () => {
  try {
    const { data } = await api.get('/CatProducts');
    return data[0];
  } catch (error) {
    console.error('Error al obtener categorias.', error);
    throw error;
  }
};

// --------------------------- GET PRODUCTS BY CATEGORY ----------------------------
export const fetchProductbyCategory = async () => {
  try {
    const { data } = await api.get('/CatProducts/getProductsCategory');
    return data[0];
  } catch (error) {
    console.error('Error al obtener productos por categoria.', error);
    throw error;
  }
};

// ------------------------ ACTUALIZAR PRODUCTOS ----------------------------
export const updateCategories = async (categoryId, categoryInfo) => {
  try {
    await api.put(`/CatProducts/update/${categoryId}`, categoryInfo);
  } catch (error) {
    console.error('Error al actualizar categorias.', error);
    throw error;
  }
};

export default api;