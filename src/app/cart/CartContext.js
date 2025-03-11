"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});


  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const storedVariants = JSON.parse(localStorage.getItem("selectedVariants")) || {};

      setCartItems(storedCart);
      setSelectedVariants(storedVariants);
    }
  }, []);

  // Update localStorage whenever cartItems change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedVariants", JSON.stringify(selectedVariants));
    }
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

  // ✅ Calculate Total Cart Price
  const calculateTotal = () => {
    const delivery_charges = 2;
  
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.discount > 0 ? item.discounted_price : item.price;
      return total + price * item.quantity;
    }, 0);
  
    return cartItems.length > 0 ? subtotal + delivery_charges : 0;
  };

  const calculateProductQuantities = () => {
    return cartItems.reduce((acc, item) => {
      const key = `${item._id}`; // Unique key for each product type
      acc[key] = (acc[key] || 0) + item.quantity;
      return acc;
    }, {});
  };
  

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        incrementQ,
        decrementQ,
        removeFromCart,
        clearCart,
        calculateTotal,
        calculateProductQuantities
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
