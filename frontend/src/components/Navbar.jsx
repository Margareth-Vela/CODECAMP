import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Badge, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

//Contextos
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

//Iconos de la aplicacion 
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CategoryIcon from '@mui/icons-material/Category';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';


const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'sticky',
  width: '100%',  
  padding: 0,   
  margin: 0,
  top: 0,
  marginBottom:10,
  zIndex: 1000,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
}));

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  console.log(cartItems);
  const navigate = useNavigate();
  const Rol = user?.rol;

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Redirige al usuario a la página de inicio 
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <StyledAppBar>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            TIENDA ONLINE
          </Typography>
          {user ? (
            Rol === 'cliente' ? (
              <>
                <IconButton color="inherit" component={Link} to="/home">
                  <HomeIcon />
                </IconButton>
                <IconButton color="inherit" component={Link} to="/order">
                  <AccountCircleIcon />
                  <Typography variant="body1" sx={{ marginLeft: 1 }}>
                    {user.name}
                  </Typography>
                </IconButton>
                <IconButton color="inherit" component={Link} to="/cart">
                  <Badge badgeContent={cartItems.length} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
                <IconButton color="inherit" onClick={handleLogout}>
                  <LogoutIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton color="inherit" component={Link} to="/admin/Home">
                  <AdminPanelSettingsIcon />
                  <Typography variant="body1" sx={{ marginLeft: 1 }}>
                    {user.name}
                  </Typography>
                </IconButton>
                <IconButton color="inherit" component={Link} to="/admin/products">
                  <StorefrontIcon />
                  <Typography variant="body1" sx={{ marginLeft: 1 }}>
                    Productos
                  </Typography>
                </IconButton>
                <IconButton color="inherit" component={Link} to="/admin/categories">
                  <CategoryIcon />
                  <Typography variant="body1" sx={{ marginLeft: 1 }}>
                    Categorías
                  </Typography>
                </IconButton>
                <IconButton color="inherit" component={Link} to="/admin/orders">
                  <ListAltIcon />
                  <Typography variant="body1" sx={{ marginLeft: 1 }}>
                    Estados
                  </Typography>
                </IconButton>
                <IconButton color="inherit" component={Link} to="/admin/users">
                  <PersonIcon />
                  <Typography variant="body1" sx={{ marginLeft: 1 }}>
                    Usuarios
                  </Typography>
                </IconButton>
                <IconButton color="inherit" onClick={handleLogout}>
                  <LogoutIcon />
                </IconButton>
              </>
            )
          ) : (
            <>
              <Button color="inherit" onClick={handleLoginRedirect}>Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </StyledAppBar>
  );
};

export default Navbar;