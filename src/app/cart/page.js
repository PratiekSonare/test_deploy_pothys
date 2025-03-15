"use client"
import React, {createContext, useState} from 'react';
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

const Cart = () => {
  
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const { cartItems, addToCart, incrementQ, decrementQ, removeFromCart, clearCart, calculateTotal } = useCart();

  const total_amount = calculateTotal();

  const form = useForm({
    defaultValues: {
      customer_name: "",
      phone: "",
      address: "",
    },
  });

  const handleTransaction = async (data) => {
    console.log("Customer data:", data); // Debugging line
    console.log("Cart Items:", cartItems);
    console.log("Total Amount:", total_amount);

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          total_amount,
          payment_method: "UPI",
          customer: data, // Pass the form data here
          status: "success"
        })
      });

         // Log the raw response for debugging
    console.log("Response status:", response.status); // Log the response status
    console.log("Response headers:", response.headers); // Log the response headers

    const result = await response.json();

    // Log the parsed result
    console.log("Response data:", result); // Log the response data

      if (result.success) {
        alert(`Transaction successful! Transaction ID: ${result.transaction_id}`);
        router.push('/');
        clearCart();

      } else {
        alert(`Transaction failed. Reason: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Transaction failed: ', error)
      alert('An error occurred while processing the transaction.');
    } finally {
      setLoading(false);
    }
  };


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
            <div className='flex flex-col items-center justify-center p-36 card-sdw bg-white rounded-lg'>
              <p className='text0 text-lg'>Your cart is empty.</p>
              <img
                src='/sad-svgrepo-com.svg'
                alt='sad'
                className=''
                style={{width: '15%'}}>
              </img>
            </div>

          ) : (
            <div className='h- flex flex-col'>
  <div className='overflow-y-scroll flex-grow'>
    {cartItems.map((product, index) => (
      <Card key={`${product._id}-${product.quantityType}` || index} className="mb-4 p-4">
        <div className="grid grid-cols-[1fr_2fr]">
          <div className='flex items-center justify-start rounded-lg flex-shrink'>
            <img 
              src={product.imageURL} 
              alt="cartproduct"
              key={product._id || index}
              className='w-full object-cover rounded-lg'
              style={{width: '25%', height: 'auto'}}                    
            />
            <div className='ml-5'>
              <h2 className="text1 text-gray-600 text-base font-semibold -mb-2">{product.brand}</h2>
              <h2 className="text2 text-lg font-semibold ">{product.name}</h2>                
              <h2 className="text0 text-xs self-end">{product.quantityType}</h2>                
            </div> 
          </div>
          <div className='flex items-center justify-center'>
            <div className='grid grid-cols-[2fr_1fr_1fr_1fr] grid-rows-1 items-center gap-5'>
              <div className='flex flex-row gap-1 text-lg justify-center items-center rounded-lg w-full h-[40px] bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-[20s] ease-in-out'>
                <button onClick={() => decrementQ(product)} className="w-1/3 h-full flex items-center justify-center">-</button>
                <button className="w-1/3 h-full flex items-center justify-center">
                  <span className="font-bold">{product.quantity}</span>
                </button>
                <button onClick={() => incrementQ(product)} className="w-1/3 h-full flex items-center justify-center">+</button>
              </div>
              <div className='flex flex-row text-lg justify-center items-center rounded-lg w-full h-[40px] bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-[20s] ease-in-out'>
                <button onClick={() => removeFromCart(product._id)}>
                  <span className='text1 text-sm p-2'>Remove</span>
                </button>
              </div>
              <div className='flex flex-col'>
                <span className='text-xs text0 self-end text-gray-600'>Quantity:</span>
                <span className='self-end text2 text-lg text-black tracking-tighter'>
                  {product.quantity} x {product.quantityType}
                </span>
              </div>
              <div>
                <div className='flex flex-col'>
                  <p className='text-xs text0 self-end text-gray-600'>Final Price:</p> 
                  <span className='self-end text2 text-lg text-black'>₹{( product.discount > 0 ? product.quantity * product.discounted_price : product.quantity * product.price ).toFixed(2)}</span> 
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
  
        <div className='p-5'>
          <h1 className="text-2xl font-bold mb-4 text3">Customer Details</h1>
  
            <div className='space-y-5 text0'>
              <Form {...form} >
                <form onSubmit={form.handleSubmit(handleTransaction)} className='space-y-5 text0'>
                  <FormField 
                    control={form.control}
                    name="customer_name"
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
  
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Complete Transaction'}
                  </Button>
                </form>
              </Form>
  
          </div>        
        </div>
      </div>
    </>
  );
};

export default Cart;