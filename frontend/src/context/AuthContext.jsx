import React, { createContext, useState, useEffect } from 'react';
import api, { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api';

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

  const logout = async () => {
    await apiLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };