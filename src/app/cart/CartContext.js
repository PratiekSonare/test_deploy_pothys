"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  // Update localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add Product to Cart
  const addToCart = (product) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id && item.quantityType === product.quantityType);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id && item.quantityType === product.quantityType
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1, quantityType: product.quantityType }];
      }
    });

    console.log(`Product added to cart: ${product.name}`);
  };

// Increment Quantity
const incrementQ = (productId, quantityType) => {
  setCartItems((prevCart) =>
    prevCart.map((item) =>
      item._id === productId && item.quantityType === quantityType
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  );
};

// Decrement Quantity (Remove if quantity becomes 0)
const decrementQ = (productId, quantityType) => {
  setCartItems((prevCart) =>
    prevCart
      .map((item) =>
        item._id === productId && item.quantityType === quantityType
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0) // Remove item if quantity is 0
  );
};
  
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, incrementQ, decrementQ, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};