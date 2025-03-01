"use client";
import * as React from "react";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CarouselSize() {
  const [showQuantity, setShowQuantity] = useState(Array(20).fill(false)); // Array to manage visibility for each item
  const [quantities, setQuantities] = useState(Array(20).fill(1)); // Array to manage quantities for each item

  const incrementQ = (index) => {
    setQuantities((prev) => {
      const newQuantities = [...prev];
      newQuantities[index] += 1;
      return newQuantities;
    });
  };

  const decrementQ = (index) => {
    setQuantities((prev) => {
      const newQuantities = [...prev];
      if (newQuantities[index] > 1) {
        newQuantities[index] -= 1; // Decrement quantity if greater than 1
      } else {
        newQuantities[index] = 1; // Keep quantity at least 1
        setShowQuantity((prev) => {
          const newShowQuantity = [...prev];
          newShowQuantity[index] = false; // Hide quantity controls
          return newShowQuantity;
        });
      }
      return newQuantities;
    });
  };

  const handleAddToCart = (index) => {
    setShowQuantity((prev) => {
      const newShowQuantity = [...prev];
      newShowQuantity[index] = true; // Show quantity for the specific item
      return newShowQuantity;
    });
  };

  return (
    <Carousel
      opts={{
        align: "start",
        slidesToScroll: 1, // Ensure it scrolls by one card width
      }}
      className="w-full"
    >
      <CarouselContent className="flex gap-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/5">
            <div className="transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-md duration-300 hover:shadow-lg">
              <div className="flex flex-col">
                <img
                  className="w-full object-cover object-center"
                  src="https://images.unsplash.com/photo-1674296115670-8f0e92b1fddb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                  alt="Product Image"
                />
                <div className="p-4">
                  <h2 className="mb-2 text-xl dark:text-white text-gray-900 font-bold">Product Name</h2>
                  <p className="mb-2 text-base dark:text-gray-300 text-gray-700">Product description goes here.</p>
                  <div className="flex items-center">
                    <p className="mr-2 text-lg font-semibold text-gray-900 dark:text-white">$20.00</p>
                    <p className="text-base font-medium text-gray-500 line-through dark:text-gray-300">$25.00</p>
                    <p className="ml-auto bg-green-200 p-1 rounded-lg text-base font-small text-green-500">20% off</p>
                  </div>
                </div>
              </div>
              {!showQuantity[index] && (
                <div className="flex justify-center p-3">
                  <button
                    onClick={() => handleAddToCart(index)}
                    className="p-3 text-md w-full h-[50px] rounded-lg bg-blue-500 hover:bg-blue-600 transition-opacity duration-500 ease-in-out opacity-100"
                  >
                    Add to Cart
                  </button>
                </div>
              )}

              {showQuantity[index] && (
                <div className="flex justify-center p-3 transition-opacity duration-500 ease-in-out opacity-100 text-lg">
                  <div className="flex flex-row h-[50px] justify-around w-full rounded-lg bg-green-500">
                    <button onClick={() => decrementQ(index)} className="text-white">-</button>
                    <button><span className="text-white font-bold">{quantities[index]}</span></button>
                    <button onClick={() => incrementQ(index)} className="text-white">+</button>
                  </div>
                </div>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}