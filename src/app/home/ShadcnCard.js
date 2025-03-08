"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CarouselSize() {
  // const { addToCart, updateQuantity, cartItems, saveCartToLocalStorage } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products/dow-true");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

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
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    console.log(`Product added to cart: ${product.name}`)
  };

  // Increment Quantity
  const incrementQ = (productId) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    
    // console.log(`Quantity updated - Product: ${product.name} - Quantity: ${product.quantity} `)
  };

  // Decrement Quantity (Remove if quantity becomes 0)
  const decrementQ = (productId) => {
    setCartItems((prevCart) =>
      prevCart
        .map((item) =>
          item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0) // Remove item if quantity is 0
    );

    // console.log(`Quantity updated - Product: ${product.name} - Quantity: ${product.quantity} `)
  };

  return (
    <div className="relative w-full">
      <Carousel opts={{ align: "start", slidesToScroll: 4 }} className="w-full h-full">
        <CarouselContent className="flex gap-4">
          {products.map((product) => {
            const cartItem = cartItems.find((item) => item._id === product._id);
            const quantity = cartItem ? cartItem.quantity : 1;

            return (
              <CarouselItem key={product._id} className="md:basis-1/3 lg:basis-1/5 h-[500px] text1">
                <div className="rounded-lg bg-white dark:bg-slate-800 shadow-md hover:shadow-lg overflow-auto">
                  <div className="relative flex flex-col">
                    <img
                      className="w-full object-cover"
                      src="https://images.unsplash.com/photo-1674296115670-8f0e92b1fddb?auto=format&fit=crop&w=870&q=80"
                      alt="Product"
                    />
                    <div className="absolute top-2 right-2 bg-green-200 p-1 rounded-lg text-green-500 text-sm">
                      {product.discount}% off
                    </div>
                    <div className="p-4">
                      <h2 className="mb-2 text-xl dark:text-white text-gray-900">{product.name}</h2>
                      <p className="mb-2 text-base text-gray-700">Product description goes here.</p>
                      <div className="flex items-end">
                        <p className="mr-2 text-xl text-gray-900 dark:text-white">
                          ₹{product.discounted_price || product.price}
                        </p>
                        {product.discount && (
                          <p className="text-md text-gray-500 line-through">₹{product.price}</p>
                        )}
                      </div>
                      <Select>
                        <SelectTrigger className="w-full h-[40px] bg-gray-300 opacity-80">
                          <SelectValue placeholder="Quantity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kg</SelectItem>
                          <SelectItem value="litre">Litre</SelectItem>
                          <SelectItem value="units">Units</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {!cartItem ? (
                    <div className="flex justify-center p-3">
                      <button
                        onClick={() => addToCart(product)}
                        className="p-2 text-md w-full h-[40px] rounded-lg border-2 border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 transition"
                      >
                        <span className="font-bold">Add</span>
                      </button>
                    </div>
                  ) : (
                      <div className="flex justify-center p-3 transition-opacity duration-500 ease-in-out opacity-100 text-lg">
                        <div className="flex flex-row h-[40px] justify-around w-full rounded-lg bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300">
                        <button onClick={() => decrementQ(product._id)}> - </button>
                          <button>
                            <span className="font-bold">{quantity}</span>
                          </button>
                        <button onClick={() => incrementQ(product._id)}> + </button>
                      </div>
                    </div>
                  )}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

          <div className="flex justify-center items-center underline text1">
            <button>
              <span>View All</span>
            </button>
          </div>

        <div className="absolute -top-7 right-[3.2rem] transform -translate-y-1/2">
          <CarouselPrevious className="bg-transparent border-[1px] border-gray-800 text-black hover:bg-gray-800 hover:text-white p-2 rounded-lg" />
        </div>
        <div className="absolute -top-7 right-[3.5rem] transform -translate-y-1/2">
          <CarouselNext className="bg-transparent border-[1px] border-gray-800 text-black hover:bg-gray-800 hover:text-white p-2 rounded-lg" />
        </div>
      </Carousel>
    </div>
  );
}
