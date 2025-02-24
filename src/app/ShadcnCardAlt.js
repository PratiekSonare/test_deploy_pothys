import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const imageurl = "https://images.unsplash.com/photo-1740021546242-8b718a3e0459?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D"
export default function CarouselSize() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent className="flex gap-4 mx-10">
        {Array.from({ length: 20 }).map((_, index) => (
          <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/5">
            <div className="flex flex-col items-center p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <img 
                    src={imageurl} 
                    alt="product_name" // Use product_name for better accessibility
                    className="w-full h-32 rounded-lg object-cover mb-4 border-2 border-gray-300 dark:border-gray-600 transition-transform duration-300 transform hover:scale-105"
                />
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 text-center mb-1">
                    product_name
                </h3>
                <p className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-1">
                    ₹ price
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                    product_quantity in stock
                </p>
                <button className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
                    Add to Cart
                </button>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
