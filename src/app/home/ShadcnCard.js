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

        const ItemsInCart = cartItems.find(item => item.name === productName)

        if (ItemsInCart) {
          // Set the variant from the cart if it exists
          initialVariants[productName] = groupedProducts[productName].find(
            variant => variant._id === ItemsInCart._id
          ) || groupedProducts[productName][0]; // Fallback to first variant if not found
        } else {
          // Otherwise, set the first variant as default
          initialVariants[productName] = groupedProducts[productName][0];
        }
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
              <CarouselItem key={productName} className="md:basis-1/2 lg:basis-1/4 text1 w-full">
                <div className="rounded-lg bg-white dark:bg-slate-800 shadow-md hover:shadow-lg overflow-auto">
                  <div className="relative flex flex-col">
                      <div className="p-5">
                        {selectedVariant?.discount > 0 && (
                          <div className="absolute top-6 right-6 bg-green-200 p-1 rounded-lg text-green-500 text-sm">
                            {selectedVariant.discount}% OFF
                          </div>
                        )}
                        <div className="flex justify-center items-center rounded-lg p-2 border-gray-500 border-[1px]">
                          <img
                            className="w-full object-cover rounded-lg"
                            style={{ width: 'auto', height: '175px' }}
                            src={selectedVariant?.imageURL} // Use optional chaining
                            alt="Product"
                          />
                        </div>
                      </div>

                    <div className="p-4">
                      <h2 className="text2 text-base dark:text-white text-gray-600">{selectedVariant?.brand}</h2>
                      <div className="flex flex-row items-end space-x-1 mb-2">
                        <h2 className="text1 text-lg/6 dark:text-white text-gray-900">{productName}</h2>
                        {selectedVariant?.product_feature && (
                              <p className="text-sm text1 text-gray-400">{selectedVariant?.product_feature}</p>
                        )}
                      </div>
                      <div className="flex  items-end">
                          <p className="mr-2 text-xl text-gray-900 dark:text-white">
                            ₹{selectedVariant?.discount > 0 ? selectedVariant.discounted_price : selectedVariant?.price}
                          </p>
                          {selectedVariant?.discount > 0 && (
                            <p className="text-md text-gray-500 line-through">₹{selectedVariant?.price}</p>
                          )}
                      </div>

                      <div className="mt-4 -mb-4">
                        <Select onValueChange={(value) => {
                          const variant = productVariants.find(v => v._id.toString() === value);
                          setSelectedVariants(prev => ({ ...prev, [productName]: variant }));
                        }}>
                        <SelectTrigger className="w-full h-[40px] bg-gray-300 opacity-80">
                          <span>{selectedVariants[productName]?.quantity} {selectedVariants[productName]?.unit} {selectedVariants?.product_feature ? ` - ${selectedVariants?.product_feature}` : ''}</span>
                        </SelectTrigger>
                          <SelectContent>
                          {productVariants.map((variant, index) => (
                          <div key={`${variant._id}`}>
                            <SelectItem className="" key={variant._id} value={variant._id}>
                              <div className="flex flex-col space-y-1 w-full">
                                <span>{variant.quantity} {variant.unit} <span className="text-xs justify-end">{variant.product_feature ? `- ${variant.product_feature}` : ''}</span></span> 

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

        <div className="flex mt-5 -mb-5 justify-center items-center underline text1">
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