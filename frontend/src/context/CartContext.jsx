import React, { createContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  cartItems: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingCartItemIndex = state.cartItems.findIndex(item => item.idProductos === action.payload.idProductos);
      if (existingCartItemIndex >= 0) {
        const updatedCartItems = state.cartItems.map((item, index) =>
          index === existingCartItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        console.log(updatedCartItems);
        return { ...state, cartItems: updatedCartItems };
      }
      return { ...state, cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }] };

    case 'REMOVE_FROM_CART':
      const updatedCartItems = state.cartItems.map(item =>
        item.idProductos === action.payload
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 0 }
          : item
      ).filter(item => item.quantity > 0); 
      return { ...state, cartItems: updatedCartItems };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  return (
    <CartContext.Provider value={{ cartItems: state.cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export  {CartContext};
