import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/RegisterClient';
import OrderPage from './pages/Order';
import OrderDetailsPage from './pages/OrderDetails';
import CartPage from './pages/Cart';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/order" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
      <Route path="/order/:orderId" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>}/>
    </Routes>
  );
}

export default App;