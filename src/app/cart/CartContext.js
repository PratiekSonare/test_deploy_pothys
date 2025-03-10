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

    const quantityType = `${product.quantity} ${product.unit}`; // e.g., "500 g"

    setCartItems((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item._id === product._id && item.quantityType === quantityType
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id && item.quantityType === quantityType
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1, quantityType }];
      }
    });

    console.log("Product added to cart:", product);
    console.log("Expected quantityType:", quantityType);
};


// Increment Quantity
const incrementQ = (product) => {
  console.log("Incrementing product:", product);

  setCartItems((prevCart) => {
    console.log("Previous cart items:", prevCart);

    const updatedCart = prevCart.map((item) => {
      if (item._id === product._id && item.quantityType === product.quantityType) {
        console.log(`Incrementing quantity for: ${item.quantityType}`);
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    console.log("Cart after increment:", updatedCart);
    return updatedCart;
  });
};


// Decrement Quantity (Remove if quantity becomes 0)
const decrementQ = (product) => {
  console.log("Decrementing product:", product);

  setCartItems((prevCart) => {
    const updatedCart = prevCart.map((item) => {
      if (item._id === product._id && item.quantityType === product.quantityType) {
        console.log(`Decrementing quantity for: ${item.quantityType}`);
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });

    // Remove items with quantity 0
    const filteredCart = updatedCart.filter((item) => item.quantity > 0);

    console.log("Cart after decrement:", filteredCart);
    return filteredCart;
  });
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