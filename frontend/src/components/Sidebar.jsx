import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const Sidebar = ({ categories, onSelectCategory }) => {
  return (
    <List>
      {categories.map((category) => (
        <ListItem button key={category} onClick={() => onSelectCategory(category)}>
          <ListItemText primary={category} />
        </ListItem>
      ))}
    </List>
  );
};

export default Sidebar;