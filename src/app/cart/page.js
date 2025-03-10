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
 import { Label } from "@/components/ui/label"

const Cart = () => {
  

  const { cartItems, addToCart, incrementQ, decrementQ, removeFromCart, clearCart } = useCart();

  const form = useForm({
          defaultValues: {
            customer_name: "",
            phone: "",
            address: "",
            repeat_customer: ""
          },
        });

  return (
    <div className='p-10 grid grid-cols-[1fr_1fr] space-x-10'>
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {cartItems.map((item, index) => (
              <Card key={item.id || index} className="mb-4 p-4">
                <div className="flex flex-row items-center">
                  <img 
                    src={item.imageURL} 
                    // src="https://images.unsplash.com/photo-1674296115670-8f0e92b1fddb?auto=format&fit=crop&w=870&q=80"
                    alt="cartproduct"
                    key={item._id || index}
                    className='object-fill rounded-lg'
                    style={{width: 'auto', height: '175px'}}                    
                    >
                  </img>
                  <div className='flex-1 ml-5'>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    {item.discount >0 && (<p className="text-gray-600">Discounted Price: ₹{item.discounted_price}</p>)}
                    <p className="text-gray-600 line-through">Price: ₹{item.price}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>

                  <div className='flex flex-row gap-2'>
                    <Button
                      variant="outline"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      Quantity Button
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            <Separator className="my-4" />
            <div className="flex justify-between">
              <Button variant="outline" onClick={""}>
                Clear Cart
              </Button>
              <Button variant="solid" className="bg-blue-600 text-white">
                Checkout
              </Button>
            </div>
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
  );
};

export default Cart;