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
});

// ***********************************************************************
//                        LOGIN
// ***********************************************************************
export const login = async (credentials) => {
  try {
    const { data } = await api.post('/login', credentials);

    //Guardar datos de token y usuarios 
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ id: data.userId, name: data.userName }));
    console.log(data);
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
//                        OBTENER PRODUCTOS
// ***********************************************************************
export const fetchProducts = async () => {
  const { data } = await api.get('/products');
  return data[0];
};

export default api;