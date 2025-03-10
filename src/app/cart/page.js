"use client"
import React, {useState} from 'react';
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

import { Input } from "@/components/ui/input";
import Header from './Header';
import '../styles.css'

const Cart = () => {
  
  const { cartItems, addToCart, incrementQ, decrementQ, removeFromCart, clearCart, calculateTotal } = useCart();

  const form = useForm({
          defaultValues: {
            customer_name: "",
            phone: "",
            address: "",
            repeat_customer: ""
          },
        });

  return (



    <>
      <header className="top-0 header-sdw">
        <Header />
      </header>
  
      <div className='p-10 grid grid-cols-[1fr_1fr] space-x-10'>
        <div className="p-5">
          <div className='flex justify-between'>
            <h1 className="text-2xl font-bold mb-4 text3">Your Cart</h1>
            <button onClick={clearCart} className='flex flex-row justify-center items-center rounded-lg h-[40px] bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-[20s] ease-in-out'>
                    <span className='text1 p-2'>Clear Cart</span>
            </button>
          </div>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              {cartItems.map((product, index) => (
                <Card key={product.id || index} className="mb-4 p-4">
                  <div className="grid grid-cols-[1fr_2fr]">
                    <div className='flex items-center justify-start rounded-lg flex-shrink'>
                      <img 
                        src={product.imageURL} 
                        // src="https://images.unsplash.com/photo-1674296115670-8f0e92b1fddb?auto=format&fit=crop&w=870&q=80"
                        alt="cartproduct"
                        key={product._id || index}
                        className='w-full object-cover rounded-lg'
                        style={{width: '25%', height: 'auto'}}                    
                        >
                      </img>
  
                      <div className='ml-5'>
                        <h2 className="text1 text-gray-600 text-base font-semibold -mb-2">{product.brand}</h2>
                        <h2 className="text2 text-lg font-semibold">{product.name}</h2>                
                      </div> 
                    </div>
        
                    <div className='flex items-center justify-center'>
                      <div className='grid grid-cols-[2fr_1fr_2fr] grid-rows-1 items-center gap-5'>
    
                        <div className='flex flex-row gap-1 text-lg justify-center items-center rounded-lg w-full h-[40px] bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-[20s] ease-in-out'>
                          <button onClick={() => decrementQ(product)} className="w-1/3 h-full flex items-center justify-center">-</button>
                          <button className="w-1/3 h-full flex items-center justify-center">
                            <span className="font-bold">{product.quantity}</span>
                          </button>
                          <button onClick={() => incrementQ(product)} className="w-1/3 h-full flex items-center justify-center">+</button>
                        </div>
    
                        <div className='flex flex-row text-lg justify-center items-center rounded-lg w-full h-[40px] bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-[20s] ease-in-out'>
                          <button
                            onClick={() => removeFromCart(product._id)}
                          >
                            <span className='text1 text-sm p-2'>Remove</span>
                          </button>
                        </div>
    
                        <div>
                          <div className='flex flex-col'>
                            <p className='text-xs text0 self-end  text-gray-600'>Discounted/Final Price:</p> 
                            <span className='self-end text2 text-lg text-black'>₹{ product.discount > 0 ? product.discounted_price : product.price }</span> 
                          </div>
                        </div>    
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              <Separator className="my-4" />
              <div className="flex justify-between">
                <div className='flex flex-col items-center justify-center'>
                  <span className='text1 text-gray-600 text-lg'>You're saving a total of</span> 
                  <span className='text2 text-green-400 text-2xl'>₹(saved_price)!</span>
                </div>
                <Separator orientation='vertical' className="my-4" />              
                <div className='flex flex-col px-5'>
                  <span className='text1 text-gray-600 text-lg self-end'>Total:</span> 
                  <span className='text2 text-2xl self-end'>₹{calculateTotal()}</span>
                </div>
              </div>
              <Separator className="my-4" />
  
            </div>
          )}
        </div>
  
        <div className='p-5'>
          <h1 className="text-2xl font-bold mb-4">Customer Details</h1>
  
            <div className='space-y-5'>
              <Form {...form}>
                <FormField 
                  control={form.control}
                  name="name"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                      <Input placeholder="Customer Name" required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}  
                />
  
                <FormField 
                  control={form.control}
                  name="phone"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                      <Input type="number" placeholder="Phone Number (+91)" required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}  
                />
  
                <FormField 
                  control={form.control}
                  name="address"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                      <Input placeholder="403, Shanti Niketan, Puducherry - 400000" required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}  
                />
              </Form>
  
              <div className='flex flex-row gap-4'>
  
                <div className='rounded-lg p-5 flex flex-col items-center bg-transparent border-2 border-blue-500 hover:bg-blue-500 transition-colors duration-200 ease-in-out'>
                  <img src='/cash.svg' alt='cashicon' style={{width: '20%'}}></img>
                  <span>Cash on Delivery</span>
                </div>
  
                <div className='rounded-lg p-5 flex flex-col items-center bg-transparent border-2 border-blue-500 hover:bg-blue-500 transition-colors duration-200 ease-in-out'>
                  <img src='/qr-code.svg' alt='qricon' style={{width: '20%'}}></img>
                  <span>UPI</span>
                </div>
  
                </div>
  
          </div>
  
  
          
        </div>
      </div>
    </>
  );
};

export default Cart;