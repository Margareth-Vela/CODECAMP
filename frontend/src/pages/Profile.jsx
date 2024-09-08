import React, { useContext } from 'react';
import { Container, Typography, List, ListItem } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user.name}
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom>
        Purchase History
      </Typography>
      <List>
        {user.purchaseHistory.map((purchase, index) => (
          <ListItem key={index}>
            {purchase.itemName} - {purchase.date}
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ProfilePage;
