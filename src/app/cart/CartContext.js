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

  const [selectedVariants, setSelectedVariants] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedVariants")) || {};
  });

  // Update localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("selectedVariants", JSON.stringify(selectedVariants));
  }, [selectedVariants]);

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

    // Store selected variant
    setSelectedVariants((prev) => ({
      ...prev,
      [product._id]: quantityType,
    }));

    console.log("Product added to cart:", product);
    console.log("Expected quantityType:", quantityType);
  };

  // Increment Quantity
  const incrementQ = (product) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item._id === product._id && item.quantityType === product.quantityType
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrement Quantity (Remove if quantity becomes 0)
  const decrementQ = (product) => {
    setCartItems((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item._id === product._id && item.quantityType === product.quantityType
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );

      return updatedCart.filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
    setSelectedVariants((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedVariants({});
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, incrementQ, decrementQ, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
