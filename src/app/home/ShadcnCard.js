"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from '../cart/CartContext';
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
import { Separator } from "@/components/ui/separator";

export default function CarouselSize() {
  const { cartItems, addToCart, incrementQ, decrementQ } = useCart();
  const [products, setProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/dow-true");
        setProducts(response.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false); // Ensure loading is set to false even on error
      }
    };

    fetchProducts();
  }, []);

  // Group products by name and initialize selectedVariants
  useEffect(() => {
    if (products.length > 0) {
      const groupedProducts = products.reduce((acc, product) => {
        if (!acc[product.name]) {
          acc[product.name] = [];
        }
        acc[product.name].push(product);
        return acc;
      }, {});

      // Initialize selectedVariants with the first variant of each product
      const initialVariants = {};
      Object.keys(groupedProducts).forEach(productName => {
        initialVariants[productName] = groupedProducts[productName][0]; // Set the first product as the default variant
      });
      setSelectedVariants(initialVariants);
    }
  }, [products]); // Runs only when products update

  // Render loading state
  if (loading) {
    return <div>Loading...</div>; // You can customize this loading state
  }

  return (
    <div className="relative w-full">
      <Carousel opts={{ align: "start", slidesToScroll: 4 }} className="w-full h-full">
        <CarouselContent className="flex gap-4">
          {Object.keys(selectedVariants).map((productName) => {
            const productVariants = products.filter(product => product.name === productName);
            const cartItem = cartItems.find((item) => item.name === productName);
            const quantity = cartItem ? cartItem.quantity : 1;

            const selectedVariant = selectedVariants[productName];

            return (
              <CarouselItem key={productName} className="md:basis-1/3 lg:basis-1/5 h-[500px] text1">
                <div className="rounded-lg bg-white dark:bg-slate-800 shadow-md hover:shadow-lg overflow-auto">
                  <div className="relative flex flex-col">
                    <img
                      className="w-full object-cover"
                      style={{ width: 'auto', height: '175px' }}
                      src={selectedVariant?.imageURL} // Use optional chaining
                      alt="Product"
                    />
                    {selectedVariant?.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-green-200 p-1 rounded-lg text-green-500 text-sm">
                        {selectedVariant.discount}% OFF
                      </div>
                    )}
                    <div className="p-4">
                    <h2 className="text2 text-lg dark:text-white text-gray-600">{selectedVariant?.brand}</h2>
                    <h2 className="mb-2 text-xl dark:text-white text-gray-900">{productName}</h2>
                    <div className="flex items-end">
                        <p className="mr-2 text-xl text-gray-900 dark:text-white">
                          ₹{selectedVariant?.discount > 0 ? selectedVariant.discounted_price : selectedVariant?.price}
                        </p>
                        {selectedVariant?.discount > 0 && (
                          <p className="text-md text-gray-500 line-through">₹{selectedVariant.price}</p>
                        )}
                      </div>

                      <div className="mt-4 -mb-4">
                        <Select onValueChange={(value) => {
                          const variant = productVariants.find(v => v.quantity.toString() === value);
                          setSelectedVariants(prev => ({ ...prev, [productName]: variant }));
                        }}>
                        <SelectTrigger className="w-full h-[40px] bg-gray-300 opacity-80">
                          <span>{selectedVariants[productName]?.quantity} {selectedVariants[productName]?.unit}</span>
                        </SelectTrigger>
                          <SelectContent>
                          {productVariants.map((variant, index) => (
                          <div key={`${variant._id}-${variant.quantity}-${variant.price}-${productName}`}>
                            <SelectItem className="" value={variant.quantity.toString()}>
                              <div className="flex flex-col space-y-1 w-full">
                                <p>{variant.quantity} {variant.unit}</p> 

                                <div className="flex flex-row justify-center items-center space-x-2">
                                  <div className="text-xs bg-green-200 p-1 rounded-lg text-green-500">
                                    <p>{variant.discount}% OFF</p>
                                  </div>
                                  <p className="text-sm">₹{variant.discount > 0 ? variant.discounted_price : variant.price}</p>
                                  <p className="text-xs items-end line-through">₹{variant.price}</p>
                                </div>
                              </div>
                            </SelectItem>

                            {/* ✅ Add Separator between items (except last one) */}
                            {index < productVariants.length - 1 && <Separator className="my-2" />}
                          </div>
                        ))}
                          </SelectContent>
                        </Select>
                      </div>

                    </div>
                  </div>

                  {!cartItem ? (
                    <div className="flex justify-center p-3">
                      <button
                        onClick={() => addToCart({
                          ...selectedVariant,
                          quantityType: `${selectedVariant.quantity} ${selectedVariant.unit}`
                        })}
                        className="p-2 text-md w-full h-[40px] rounded-lg border-2 border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 transition"
                      >
                        <span className="font-bold">Add</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center p-3 transition-opacity duration-500 ease-in-out opacity-100 text-lg">
                      <div className="flex flex-row h-[40px] justify-around w-full rounded-lg bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300">
                        <button onClick={() => decrementQ({
                          ...selectedVariant,
                          quantityType: `${selectedVariant.quantity} ${selectedVariant.unit}`
                        })}> - </button>

                        <button>
                          <span className="font-bold">{quantity}</span>
                        </button>

                        <button onClick={() => incrementQ({
                          ...selectedVariant,
                          quantityType: `${selectedVariant.quantity} ${selectedVariant.unit}`
                        })}> + </button>
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