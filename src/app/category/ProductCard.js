"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from '../cart/CartContext';
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const ProductGrid = () => {
  const { cartItems, addToCart, incrementQ, decrementQ } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState({}); // State to hold selected variants

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/dow-true");
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const groupedProducts = products.reduce((acc, product) => {
        if (!acc[product.name]) {
          acc[product.name] = [];
        }
        acc[product.name].push(product);
        return acc;
      }, {});

      const initialVariants = {};
      Object.keys(groupedProducts).forEach(productName => {
        const ItemsInCart = cartItems.find(item => item.name === productName);

        if (ItemsInCart) {
          initialVariants[productName] = {
            ...groupedProducts[productName].find(variant => variant._id === ItemsInCart._id) 
            || groupedProducts[productName][0], // Fallback to first variant if not found
            quantityType: `${ItemsInCart.quantity} ${ItemsInCart.unit}`
          };
        } else {
          const firstVariant = groupedProducts[productName][0];
          initialVariants[productName] = {
            ...firstVariant,
            quantityType: `${firstVariant.quantity} ${firstVariant.unit}`
          };
        }
      });

      setSelectedVariants(initialVariants);
    }
  }, [products, cartItems]); // Add cartItems dependency to ensure updates

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = (variant) => {
    const existingItem = cartItems.find(item => item.name === variant.name);
    
    if (existingItem) {
      // If the product already exists in the cart, do not allow adding a different quantity
      alert(`You have already added ${existingItem.quantityType} of ${variant.name}. Please update the quantity instead.`);
      return;
    }
  
    addToCart({
      ...variant,
      quantityType: `${variant.quantity} ${variant.unit}`
    });
  };

  return (
    <div className="container mx-auto grid grid-cols-1 gap-4">
      {Object.keys(selectedVariants).map((productName) => {
        const productVariants = products.filter(product => product.name === productName);
        const selectedVariant = selectedVariants[productName];
        const cartItem = cartItems.find(item => item.name === productName);
        const quantity = cartItem ? cartItem.quantity : 1;


        return (
          <div key={productName} className="rounded-lg bg-white dark:bg-slate-800 shadow-md hover:shadow-lg overflow-auto">
            <div className="relative flex flex-col">
              <div className="flex justify-center items-center rounded-lg p-2">
                <div className="border-gray-500 border-[1px] p-2 rounded-lg">
                  <img
                    className="w-full object-cover rounded-lg"
                    style={{ width: 'auto', height: '175px' }}
                    src={selectedVariant?.imageURL}
                    alt={productName}
                  />
                </div>
              </div>
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
                      <span>{selectedVariant?.quantity} {selectedVariant?.unit}</span>
                    </SelectTrigger>
                    <SelectContent>
                      {productVariants.map((variant) => (
                        <div key={variant._id}>
                            <SelectItem value={variant.quantity.toString()}>
                              <div className="flex flex-col space-y-1 w-full">
                                <p>{variant.quantity} {variant.unit}</p>
                                <div className="flex flex-row justify-center items-center space-x-2">
                                  {variant.discount > 0 && (
                                    <div className="text-xs bg-green-200 p-1 rounded-lg text-green-500">
                                      <p>{variant.discount}% OFF</p>
                                    </div>
                                  )}
                                  <p className="text-sm">₹{variant.discount > 0 ? variant.discounted_price : variant.price}</p>
                                  {variant.discount > 0 && (
                                    <p className="text-xs items-end line-through">₹{variant.price}</p>
                                  )}
                                </div>
                              </div>
                            </SelectItem>
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
                  onClick={handleAddToCart}
                  className="p-2 text-md w-full h-[40px] rounded-lg border-2 border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 transition"
                >
                  <span className="font-bold">Add</span>
                </button>
              </div>
            ) : (
              <div className="flex justify-center p-3 transition-opacity duration-500 ease-in-out opacity-100 text-lg">
                <div className="flex flex-row h-[40px] justify-around w-full rounded-lg bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300">
                  <button onClick={() => decrementQ(selectedVariant)}>-</button>
                  <button>
                    <span className="font-bold">{quantity}</span>
                  </button>
                  <button onClick={() => incrementQ(selectedVariant)}>+</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;