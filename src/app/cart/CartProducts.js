"use client"
import React, { createContext, useState } from 'react';
import { Button } from "@/components/ui/button"; // Import Shadcn UI Button
import { Card } from "@/components/ui/card"; // Import Shadcn UI Card
import { Separator } from "@/components/ui/separator"; // Import Shadcn UI Separator
import { useCart } from './CartContext';
import { useForm } from 'react-hook-form';
import {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
  from '@/components/ui/form';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

import { useRouter } from 'next/navigation';

import { Input } from "@/components/ui/input";
import Header from './Header';
import '../styles.css'
import Footer from '../footer/Footer';
import generateInvoice from '../invoice/page';
import HeaderParent from './HeaderParent';

const CartProducts = () => {

    const { cartItems, addToCart, incrementQ, decrementQ, removeFromCart, clearCart, calculateTotal } = useCart();
    const total_amount = calculateTotal();

  return (

        <div className='hidden md:flex'>
            <div className="p-2 md:p-5 w-screen md:w-full">
              <div className='flex justify-between md:justify-between'>
                <h1 className="text-2xl font-bold mb-4 text3">Your Cart</h1>
                <button onClick={clearCart} className='flex flex-row justify-center items-center rounded-lg h-[40px] bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-[20s] ease-in-out'>
                  <span className='text1 p-2'>Clear Cart</span>
                </button>
              </div>
    
              {cartItems.length === 0 ? (
                <div className='flex flex-col items-center justify-center p-36 card-sdw bg-white rounded-lg'>
                  <p className='text0 text-lg'>Your cart is empty.</p>
                  <img
                    src='/sad-svgrepo-com.svg'
                    alt='sad'
                    className=''
                    style={{ width: '15%' }}>
                  </img>
                </div>
    
              ) : (
                <div className='flex flex-col'>
                  <div className='overflow-y-scroll flex-grow'>
                    {cartItems.map((product, index) => (
                      <Card key={`${product._id}-${product.quantityType}` || index} className="w-full mb-4 px-2 md:p-4">
                        <div className="grid grid-cols-[1fr_2fr]">
    
                          <div className='flex items-center justify-start rounded-lg flex-shrink'>
                            <img
                              src={product.imageURL}
                              alt="cartproduct"
                              key={product._id || index}
                              className='w-1/2 md:w-[25%] object-cover rounded-lg'
                            />
                            <div className='md:ml-5 scale-75 md:scale-100'>
                              <h2 className="text1 text-gray-600 text-base font-semibold -mb-2">{product.brand}</h2>
                              <h2 className="text2 text-lg font-semibold ">{product.name}</h2>
                              <h2 className="text0 text-xs self-end">{product.quantityType}</h2>
                            </div>
                          </div>
    
                          <div className='flex items-center justify-center scale-75 md:scale-100'>
    
                            <div className='grid grid-cols-[4fr_1fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr_1fr] items-center gap-5 md:gap-5'>
    
                              <div className='flex flex-row gap-1 text-lg justify-center items-center rounded-lg w-full h-[40px] bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-200 ease-in-out'>
                                <button onClick={() => decrementQ(product)} className="w-1/3 h-full flex items-center justify-center">-</button>
                                <button className="w-1/3 h-full flex items-center justify-center">
                                  <span className="font-bold">{product.quantity}</span>
                                </button>
                                <button onClick={() => incrementQ(product)} className="w-1/3 h-full flex items-center justify-center">+</button>
                              </div>
    
                              <div className='flex flex-row text-lg justify-center items-center rounded-lg w-full h-[40px] bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200 ease-in-out'>
                                <button onClick={() => removeFromCart(product._id)}>
                                  <span className='text1 text-sm p-2'>Remove</span>
                                </button>
                              </div>
    
                              <div className='flex flex-col'>
                                <span className='text-[15px] md:text-xs text0 self-end text-gray-600'>Quantity:</span>
                                <span className='self-end text2 text-[15px] md:text-lg text-black tracking-tighter'>
                                  {product.quantity} x {product.quantityType}
                                </span>
                              </div>
                              <div>
    
                                <div className='flex flex-col'>
                                  <p className='text-[15px] md:text-xs text0 self-end text-gray-600'>Final Price:</p>
                                  <span className='self-end text2 text-[15px] md:text-lg text-black'>₹{(product.discount > 0 ? product.quantity * product.discounted_price : product.quantity * product.price).toFixed(2)}</span>
                                </div>
    
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                    <Separator className="mt-4 mb-2" />
                  </div>
    
                  <div className="flex justify-between">
                    <div className='flex flex-col items-center justify-center'>
                      <span className='text1 text-gray-600 text-lg'>You're saving a total of</span>
                      <span className='text2 text-green-400 text-2xl'>₹(saved_price)!</span>
                    </div>
                    <Separator orientation='vertical' className="my-4" />
                    <div className='flex flex-col px-5'>
                      <span className='text1 text-gray-600 text-lg self-end mt-4'>Total:</span>
                      <span className='text2 text-2xl self-end'>₹{total_amount.toFixed(2)}</span>
                      <div className='self-end'>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Button variant="link" className='p-0'><span className='text-xs text0 text-gray-500'>+ View Price Breakdown</span></Button>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-55">
                            <div className='flex flex-col gap-2 text0 text-xs'>
                              <div className='flex flex-row justify-between'>
                                <span className='text-gray-400'>+Delivery Charges</span>
                                <span className='text-gray-600'>₹2</span>
                              </div>
                              <div className='flex flex-row justify-between'>
                                <span className='text-gray-400'>+CGST</span>
                                <span className='text-gray-600'>₹(cgst)</span>
                              </div>
                              <div className='flex flex-row justify-between'>
                                <span className='text-gray-400'>+SGST</span>
                                <span className='text-gray-600'>₹(sgst)</span>
                              </div>
                              <div className='flex flex-row justify-between'>
                                <span className='text-gray-400'>+Convenience Fee</span>
                                <span className='text-gray-600'>₹(c_fee)</span>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-2" />
                </div>
              )}
            </div>
        </div>
    )
}

export default CartProducts