"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../ProductCard";

export default function FVCards() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const encodedCategory = encodeURIComponent("Fruits and Vegetables");
        const response = await axios.get(`http://localhost:5000/api/products/category/${encodedCategory}`);
        setProducts(response.data);
        console.log('server response data: ', response.data)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }

  const groupedProducts = products.reduce((acc, item) => {
    if (!acc[item.name]) {
      acc[item.name] = [];
    }
    acc[item.name].push(item);
    return acc;
  }, {});


  return (
    <div className="container mx-auto">

      <div className="block relative w-fit">
        <p className="text3 text-3xl font-bold mb-4 cursor-pointer group">
          Fruits and Vegetables
          <span className="absolute left-0 bottom-0 w-0 h-[4px] bg-black transition-all duration-300 group-hover:w-full"></span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {Object.keys(groupedProducts).map(productName => (
          <ProductCard key={productName} productVariants={groupedProducts[productName]} />
        ))};
      </div>
    </div>
  );
}
