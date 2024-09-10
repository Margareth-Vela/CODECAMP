import React from 'react';
import { List, ListItem, ListItemText, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

// Componente estilizado para Sidebar
const SidebarContainer = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: 0,
  height: '100vh',
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  padding: 0,
  margin: 0
}));

// Componente estilizado para ListItem
const SidebarItem = styled(ListItem, {shouldForwardProp: (prop) => prop !== 'active',
})(({ active }) => ({
    backgroundColor: active ? 'lightgray' : 'transparent',
    '&:hover': {
      backgroundColor: 'lightblue',
    },
  }));
  

const Sidebar = ({ categories, onSelectCategory, selectedCategory }) => {

  return (
    <SidebarContainer>
      <List>
        {categories.map((category) => (
          <SidebarItem
            key={category}
            onClick={() => onSelectCategory(category)}
            active={selectedCategory === category}
          >
            <ListItemText primary={category} />
          </SidebarItem>
        ))}
      </List>
      <Divider />
    </SidebarContainer>
  );
};

export default Sidebar;
