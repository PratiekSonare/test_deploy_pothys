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
import CartProducts from './CartProducts';
import CartParent from './CartParent';
import FooterParent from '../footer/FooterParent';

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

  const handleTransactionSuccess = async (transactionData) => {
    // Assuming transactionData is the response from your transaction API
    const { transaction_id, date_time, payment_method, total_amount, cartItems, customer } = transactionData;

    // Call the function to generate the invoice
    generateInvoice(transaction_id, date_time, payment_method, total_amount, cartItems, customer);
  };

  const handleTransaction = async (data) => {
    console.log("Customer data:", data); // Debugging line
    console.log("Cart Items:", cartItems);
    console.log("Total Amount:", total_amount);

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          total_amount,
          payment_method: "UPI",
          customer: data, // Pass the form data here
          status: "success",
          delivery_status: "pending"
        })
      });

      const result = await response.json();

      // Log the parsed result
      console.log("Response data:", result); // Log the response data

      if (result.success) {
        alert(`Transaction successful! Transaction ID: ${result.transaction_id}`);

        // Call handleTransactionSuccess with the transaction data
        handleTransactionSuccess({
          transaction_id: result.transaction_id,
          date_time: new Date(), // You can adjust this based on your backend response
          payment_method: "UPI", // Assuming this is static for now
          total_amount,
          cartItems,
          customer: data
        });

        // Open a new tab with the invoice URL, passing the transaction ID
        const invoiceUrl = `/invoice?transaction_id=${result.transaction_id}`; // Adjust the URL as needed
        window.open(invoiceUrl, '_blank'); // Open the invoice in a new tab

        router.push('/'); // Redirect to home
        clearCart();
      } else {
        alert(`Transaction failed. Reason: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Transaction failed: ', error);
      alert('An error occurred while processing the transaction.');
    } finally {
      setLoading(false);
    }
  };


  return (

    <div className='overflow-x-hidden w-screen'>
      <header className="top-0 header-sdw w-full">
        <HeaderParent />
      </header>

      <div className='p-2 md:p-10 grid grid-rows-2 md:grid-cols-2 space-y-10 md:space-x-10'>

        {/* cart */}
        <CartParent />

        {/* customer form */}
        <div className="md:p-5">
          <h1 className="text-2xl font-bold mb-4 text3">Customer Details</h1>

          <div className='space-y-5 text0 w-11/12 md:w-full md:block'>
            <Form {...form} >
              <form onSubmit={form.handleSubmit(handleTransaction)} className='space-y-5 text0'>
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
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
                  render={({ field }) => (
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="403, Shanti Niketan, Puducherry - 400000" required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Button
                    className='flex flex-row justify-center items-center rounded-lg h-[40px] bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-[20s] ease-in-out'
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Complete Transaction'}
                  </Button>
                </div>
              </form>
            </Form>

          </div>
        </div>

      </div>

      <footer>
        <FooterParent />
      </footer>
    </div>
  );
};

export default Cart;