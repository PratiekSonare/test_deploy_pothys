"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../ProductCard";
import NoItem from "../NoItem";

export default function HKCards({products}) {
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

      <div className="flex flex-row justify-center md:justify-between my-5">
        <div className="block relative w-fit">
          <p className="text3 text-2xl md:text-3xl font-bold cursor-pointer group">
            Home and Kitchen
            <span className="absolute rounded-lg left-0 bottom-0 z-0 md:-z-50 md:w-0 h-[4px] bg-red-600 transition-all duration-300 w-full md:group-hover:w-full"></span>
          </p>
        </div>
      </div>


      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-0 gap-y-0 md:gap-x-0 md:gap-y-10">
        {Object.keys(groupedProducts).map(productName => (
          <ProductCard key={productName} productVariants={groupedProducts[productName]} />
        ))};
      </div>
    </div>
  );
}
