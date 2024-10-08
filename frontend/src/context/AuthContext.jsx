import React, { createContext, useState, useEffect } from 'react';
import api, { login as apiLogin, register as apiRegister, logout as apiLogout, fetchUsers as apiUsers, registerAdmin as apiRegisterAdmin, updateUsers as apiUpdate, createState as apiCreateState, updateStates as apiUpdateState, fetchAllStates as apiStates } from '../api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = JSON.parse(localStorage.getItem('user'));

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }

    // Interceptar respuestas de api
    const responseInterceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    // Limpiar interceptor al desmontar
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const login = async (credentials) => {
    try {
      const { token, userId, userName, userRole } = await apiLogin(credentials);

      // Actualiza el estado del contexto
      setToken(token);
      setUser({ id: userId, name: userName, rol: userRole });

      return userRole;
    } catch (error) {
      console.error('Error al ingresar credenciales.', error);
      throw error;
    }
  };

  const register = async (userInfo) => {
    try {
      const data = await apiRegister(userInfo);
    } catch (error) {
      console.error('Error al registrar el usuario.', error);
    }
  };

  const registerAdmin = async (userInfo) => {
    try {
      const data = await apiRegisterAdmin(userInfo);
    } catch (error) {
      console.error('Error al registrar el usuario.', error);
    }
  };

  const logout = async () => {
    await apiLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const fetchUsers = async () => {
    try {
      const data = await apiUsers();
      return data;
    } catch (error) {
      console.error('Error al hacer fetch de usuarios.', error);
    }
  };

  const updateUsers = async (userId, userInfo) => {
    try {
      const data = await apiUpdate(userId, userInfo);
      return data;
    } catch (error) {
      console.error('Error al actualizar el usuario.', error);
    }
  };

  const createState = async (stateInfo) => {
    try {
      const data = await apiCreateState(stateInfo);
    } catch (error) {
      console.error('Error al registrar el usuario.', error);
    }
  };

  const fetchStates = async () => {
    try {
      const data = await apiStates();
      return data;
    } catch (error) {
      console.error('Error al hacer fetch de los estados.', error);
    }
  };

  const updateStates = async (stateId, stateInfo) => {
    try {
      const data = await apiUpdateState(stateId, stateInfo);
      return data;
    } catch (error) {
      console.error('Error al actualizar el estado .', error);
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, register, logout, fetchUsers, registerAdmin, updateUsers, createState, fetchStates, updateStates }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };