import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RedirectBasedOnRole = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const roleToRoute = {
      'admin': '/admin/Home',
      'cliente': '/home',
    };

    if (user) {
      navigate(roleToRoute[user.rol] || '/home'); 
    } else {
      navigate('/home'); 
    }
  }, [user, navigate]);

  return <div>Loading...</div>;
};

export default RedirectBasedOnRole;
