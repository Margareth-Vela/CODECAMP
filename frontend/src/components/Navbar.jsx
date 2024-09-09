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

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  console.log(cartItems);
  const navigate = useNavigate();

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
            Product Store
          </Typography>
          {user ? (
            <>
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