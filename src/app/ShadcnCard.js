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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CarouselSize() {
  const [showQuantity, setShowQuantity] = useState(Array(20).fill(false));
  const [quantities, setQuantities] = useState(Array(20).fill(1));

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
        newQuantities[index] -= 1;
      } else {
        newQuantities[index] = 1;
        setShowQuantity((prev) => {
          const newShowQuantity = [...prev];
          newShowQuantity[index] = false;
          return newShowQuantity;
        });
      }
      return newQuantities;
    });
  };

  const handleAddToCart = (index) => {
    setShowQuantity((prev) => {
      const newShowQuantity = [...prev];
      newShowQuantity[index] = true;
      return newShowQuantity;
    });
  };

  return (
    <div className="relative w-full ">
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 4,
        }}
        className="w-full h-full"
      >
        <CarouselContent className="flex gap-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/5 h-[500px] text1">
              <div className="transform rounded-lg bg-white dark:bg-slate-800 shadow-md duration-300 hover:shadow-lg overflow-hidden">
                <div className="relative flex flex-col"> {/* Make this relative to position the badge absolutely */}
                  <img
                    className="w-full object-cover object-center"
                    src="https://images.unsplash.com/photo-1674296115670-8f0e92b1fddb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                    alt="Product Image"
                  />
                  {/* Badge for discount */}
                  <div className="absolute top-2 right-2 bg-green-200 p-1 rounded-lg text-green-500 text-sm">
                    20% off
                  </div>
                  <div className="p-4">
                    <h2 className="mb-2 text-xl dark:text-white text-gray-900 text2">
                      Product Name
                    </h2>
                    <p className="mb-2 text-base text-[15px] dark:text-gray-300 text-gray-700">
                      Product description goes here.
                    </p>
                    <div className="">
                      <div className="flex flex-col gap-5">
                        <div className="flex flex-row items-end">
                          <p className="mr-2 text-xl text2 text-gray-900 dark:text-white">
                            ₹20.00
                          </p>
                          <p className="text-md mb-[1px] text-base text2 text-gray-500 line-through dark:text-gray-300">
                            ₹25.00
                          </p>
                        </div>

                        <div className="-mb-3 w-full">
                          <Select>
                            <SelectTrigger className="w-full h-[40px] bg-gray-300 opacity-80">
                              <SelectValue placeholder="Quantity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">Kg</SelectItem>
                              <SelectItem value="dark">Litre</SelectItem>
                              <SelectItem value="system">Units</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
                {!showQuantity[index] && (
                  <div className="flex justify-center p-3">
                  <button
                    onClick={() => handleAddToCart(index)}
                    className="p-2 text-center text-md w-full h-[40px] rounded-lg bg-transparent border-2 border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 transition-colors duration-[20s] ease-in-out"
                  >
                    <span className="font-bold transition-colors duration-300 ease-in-out">
                      Add
                    </span>
                  </button>
                  </div>
                )}

                {showQuantity[index] && (
                  <div className="flex justify-center p-3 transition-opacity duration-500 ease-in-out opacity-100 text-lg">
                    <div className="flex flex-row h-[40px] justify-around w-full rounded-lg bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-[20s] ease-in-out">
                      <button onClick={() => decrementQ(index)} className="">-</button>
                      <button><span className="font-bold">{quantities[index]}</span></button>
                      <button onClick={() => incrementQ(index)} className="">+</button>
                    </div>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
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