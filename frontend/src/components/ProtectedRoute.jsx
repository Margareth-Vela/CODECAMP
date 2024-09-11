import { Navigate, Outlet } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRoles }) => {
  const { user } = useContext(AuthContext);
  const alertShownRef = useRef(false);

  useEffect(() => {
    if (user && requiredRoles && !requiredRoles.includes(user.rol) && !alertShownRef.current) {
      alert("Error: No está autorizado para ingresar a esa página.");
      alertShownRef.current = true;
    }
  }, [user, requiredRoles]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user.rol)) {
    if(user.Rol == 'cliente'){
      return <Navigate to="/home" replace />;
    }else{
      return <Navigate to="/admin/Home" replace />;
    }
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;