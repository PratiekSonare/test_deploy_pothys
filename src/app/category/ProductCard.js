"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "../cart/CartContext";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

const ProductCard = ({ productVariants }) => {
  const { cartItems, addToCart, incrementQ, decrementQ } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    console.log('product variant passed: ', productVariants);

    if (productVariants.length > 0) {
      const itemInCart = cartItems.find(item => item.name === productVariants[0].name);
      const defaultVariant = itemInCart
        ? productVariants.find(variant => variant._id === itemInCart._id) || productVariants[0]
        : productVariants[0];

      setSelectedVariant(defaultVariant);
    }
  }, [productVariants, cartItems]);

  const handleVariantChange = (value) => {
    const variant = productVariants.find(v => v.quantity.toString() === value);
    setSelectedVariant(variant);
    setLoading(true); // Reset loading when a new variant is selected

  };

  return (
    <div className="container mx-auto grid grid-cols-1 gap-4 text0 w-[260px]">
      <div className="rounded-lg bg-white dark:bg-slate-800 shadow-md hover:shadow-lg overflow-auto">
        <div className="relative flex flex-col">
          <div className="flex justify-center items-center rounded-lg p-2">
            <div className="border-gray-500 border-[1px] p-2 rounded-lg">
              <img 
                className="w-full object-cover rounded-lg" 
                style={{ width: 'auto', height: '175px' }} 
                src={selectedVariant?.imageURL} 
                alt={selectedVariant?.name}
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
              />
            </div>
          </div>
          {selectedVariant?.discount > 0 && (
            <div className="absolute top-2 right-2 bg-green-200 p-1 rounded-lg text-green-500 text-sm">
              {selectedVariant.discount}% OFF
            </div>
          )}
          <div className="p-4">
            <h2 className="text-lg dark:text-white text-gray-600">{selectedVariant?.brand}</h2>
              
              <h2
                className="mb-2 text-lg dark:text-white text-gray-900 relative group"
                title={selectedVariant?.name} // Tooltip for accessibility
              >
                {selectedVariant?.name.length > 18 ? `${selectedVariant?.name.slice(0, 18)}...` : selectedVariant?.name}
                <span className="absolute opacity-0 group-hover:opacity-100 bg-blue-600 text-white text-sm px-2 py-1 rounded-md transition-opacity duration-300 -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  {selectedVariant?.name}
                </span>
              </h2>            
            
            <div className="flex items-end">
              <p className="mr-2 text-xl text-gray-900 dark:text-white">
                ₹{selectedVariant?.discount > 0 ? selectedVariant.discounted_price : selectedVariant?.price}
              </p>
              {selectedVariant?.discount > 0 && (
                <p className="text-md text-gray-500 line-through">₹{selectedVariant.price}</p>
              )}
            </div>

            {/* Dropdown for Variants */}
            <div className="mt-4 -mb-4">
              <Select onValueChange={handleVariantChange}>
                <SelectTrigger className="w-full h-[40px] bg-gray-300 opacity-80">
                  <span>{selectedVariant?.quantity} {selectedVariant?.unit}</span>
                </SelectTrigger>
                <SelectContent>
                  {productVariants.map((variant) => (
                    <SelectItem key={variant._id} value={variant.quantity.toString()}>
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
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        {!cartItems.some(item => item._id === selectedVariant?._id) ? (
          <div className="flex justify-center p-3">
            <button 
              onClick={() => addToCart(selectedVariant)} 
              className="flex items-center justify-center p-2 text-md w-full h-[40px] rounded-lg border-2 border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 transition"
            >
              <span className="font-bold">Add</span>
            </button>
          </div>

        ) : (
          <div className="flex justify-center p-3">
            <div className="flex flex-row h-[40px] justify-around text-lg w-full rounded-lg bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition">
              <button onClick={() => decrementQ({
                ...selectedVariant,
                quantityType: `${selectedVariant.quantity} ${selectedVariant.unit}`
              })}>-</button>
              <button>
                <span className="font-bold">{cartItems.find(item => item._id === selectedVariant?._id)?.quantity || 1}</span>
              </button>
              <button onClick={() => incrementQ({
                ...selectedVariant,
                quantityType: `${selectedVariant.quantity} ${selectedVariant.unit}`
              })}>+</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
