import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../api';

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
  }, []);

  const login = async (credentials) => {
    try {
      const { token, userId, userName } = await apiLogin(credentials);

      // Actualiza el estado del contexto
      setToken(token);
      setUser({ id: userId, name: userName });
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

  const logout = () => {
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