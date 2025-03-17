"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../ProductCard";
import NoItem from "../NoItem";

export default function CHCards({products}) {
  // Log the products whenever they change
  useEffect(() => {
    console.log('Filtered Products in FVCards:', products);
  }, [products]);

  if (!products || products.length === 0) {
    return <NoItem />;
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
          Cleaning and Household
          <span className="absolute left-0 bottom-0 w-0 h-[4px] bg-black transition-all duration-300 group-hover:w-full"></span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Object.keys(groupedProducts).map(productName => (
          <ProductCard key={productName} productVariants={groupedProducts[productName]} />
        ))};
      </div>
    </div>
  );
}
