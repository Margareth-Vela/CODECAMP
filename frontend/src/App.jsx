import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

//Componentes
import ProtectedRoute from './components/ProtectedRoute';
import RedirectBasedOnRole from './components/Redirect';
import Navbar from './components/Navbar';

//Paginas para todos
import HomePage from './pages/Home';
import LoginPage from './pages/Login';

//Paginas para ADMIN
import AdminHomePage from './pages/Admin/AdminHome';
import AdminOrderDetailsPage from './pages/Admin/AdminOrderDetails';
import AdminUsersPage from './pages/Admin/AdminUsers';
import AdminUserDetailPage from './pages/Admin/AdminUsersDetails';
import AdminProductDetailPage from './pages/Admin/AdminProductDetails';
import AdminRegister from './pages/Admin/AdminRegister';
import AdminProductsPage from './pages/Admin/AdminProducts';
import AdminCreateProductPage from './pages/Admin/AdminCreateProduct';
import AdminCategoriesPage from './pages/Admin/AdminCategories';
import AdminCategoryDetailPage from './pages/Admin/AdminCategoriesDetails';
import AdminCreateCategoryPage from './pages/Admin/AdminCreateCategory';
import AdminStatesPage from './pages/Admin/AdminEstados';

//Paginas para CLIENTES
import RegisterPage from './pages/Cliente/RegisterClient';
import OrderPage from './pages/Cliente/Order';
import OrderDetailsPage from './pages/Cliente/OrderDetails';
import CartPage from './pages/Cliente/Cart';


function App() {
  const location = useLocation();
  const noNavbarPaths = ['/login', '/register'];
  return (
    <div>
      {!noNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<RedirectBasedOnRole />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/admin/Home" element={<ProtectedRoute requiredRoles={['admin']} ><AdminHomePage /></ProtectedRoute>} />
        <Route path="/admin/order/:orderId" element={<ProtectedRoute requiredRoles={['admin']}><AdminOrderDetailsPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requiredRoles={['admin']} ><AdminUsersPage /></ProtectedRoute>} />
        <Route path="/admin/states" element={<ProtectedRoute requiredRoles={['admin']} ><AdminStatesPage /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute requiredRoles={['admin']} ><AdminProductsPage /></ProtectedRoute>} />
        <Route path="/admin/products/:productId" element={<ProtectedRoute requiredRoles={['admin']}><AdminProductDetailPage /></ProtectedRoute>} />
        <Route path="/admin/users/:userId" element={<ProtectedRoute requiredRoles={['admin']}><AdminUserDetailPage /></ProtectedRoute>} />
        <Route path="/admin/users/create" element={<ProtectedRoute requiredRoles={['admin']} ><AdminRegister /></ProtectedRoute>} />
        <Route path="/admin/products/create" element={<ProtectedRoute requiredRoles={['admin']} ><AdminCreateProductPage /></ProtectedRoute>} />
        <Route path="/admin/categories/create" element={<ProtectedRoute requiredRoles={['admin']} ><AdminCreateCategoryPage /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute requiredRoles={['admin']} ><AdminCategoriesPage /></ProtectedRoute>} />
        <Route path="/admin/categories/:categoryId" element={<ProtectedRoute requiredRoles={['admin']}><AdminCategoryDetailPage /></ProtectedRoute>} />
        
        <Route path="/order" element={<ProtectedRoute requiredRoles={['cliente', 'admin']} ><OrderPage /></ProtectedRoute>} />
        <Route path="/order/:orderId" element={<ProtectedRoute requiredRoles={['cliente', 'admin']}><OrderDetailsPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute requiredRoles={['cliente']}><CartPage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;