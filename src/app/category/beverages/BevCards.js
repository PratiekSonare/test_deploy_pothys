"use client"
import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from '../../cart/CartContext';
import ProductCard from "../ProductCard";


export default function BevCards() {
  const { cartItems, addToCart, incrementQ, decrementQ } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/dow-true");
        setProducts(response.data);
        setLoading(false);
        console.log('Products: ', products[0]);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});


  return (
    <div className="container mx-auto">
      {Object.keys(groupedProducts).map(category => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {groupedProducts[category].map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                cartItems={cartItems} 
                addToCart={addToCart} 
                incrementQ={incrementQ} 
                decrementQ={decrementQ} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}