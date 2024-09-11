import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/Home';
import AdminHomePage from './pages/AdminHome';
import AdminOrderDetailsPage from './pages/AdminOrderDetails';
import LoginPage from './pages/Login';
import RegisterPage from './pages/RegisterClient';
import OrderPage from './pages/Order';
import OrderDetailsPage from './pages/OrderDetails';
import CartPage from './pages/Cart';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectBasedOnRole from './components/Redirect';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const location = useLocation();
  const noNavbarPaths = ['/login', '/register'];
  return (
    <div>
      {!noNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<RedirectBasedOnRole />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin/Home" element={<ProtectedRoute requiredRoles={['admin']} ><AdminHomePage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/order" element={<ProtectedRoute requiredRoles={['cliente', 'admin']} ><OrderPage /></ProtectedRoute>} />
        <Route path="/admin/order/:orderId" element={<ProtectedRoute requiredRoles={['admin']}><AdminOrderDetailsPage /></ProtectedRoute>} />
        <Route path="/order/:orderId" element={<ProtectedRoute requiredRoles={['cliente', 'admin']}><OrderDetailsPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute requiredRoles={['cliente']}><CartPage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;