"use client"
import React from 'react';
import Link from 'next/link'; // Import Link from next/link
import { useCart } from '../cart/CartContext';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { cartItems, addToCart, incrementQ, decrementQ, removeFromCart, clearCart } = useCart();
  
  const router = useRouter();

  return (
    <div className='hidden md:block max-w-screen max-h-[150px] bg-white'>
      <div className='grid grid-cols-3 items-center p-5'>

        {/* Left Icon (e.g., Cart Icon) */}
        <div className="flex justify-start">
          <Link href="/">
            <img 
              src="/arrow.svg" 
              alt="cart"
              className="w-8 h-auto cursor-pointer" 
              onClick={() => router.push('/')}
            />
          </Link>
        </div>

        {/* Logo */}
        <div className="flex justify-center items-center">
          
          <img 
            src='/pothys-2template.svg' 
            alt='logo'
            style={{ width: '30%', height: 'auto' }} 
          />
        </div>

        {/* Right Icons (e.g., Phone and Form Icons) */}
        <div className='flex justify-end space-x-4'>
          <div className='p-2 rounded-lg bg-red-400 flex items-center justify-center'>
            <Link href='/contact-us'>
              <img 
                src='/phone-calling-svgrepo-com.svg' 
                alt='phone'
                className='w-5 h-auto' // Adjust size as needed
              />
            </Link>
          </div>
          <div className='p-2 rounded-lg bg-blue-400 flex items-center justify-center'>
            <Link href='/feedback'>
              <img 
                src='/form-svgrepo-com.svg' 
                alt='form'
                className='w-5 h-auto' // Adjust size as needed
              />
            </Link>
          </div>
        </div>
        
      </div>      
    </div>
  );
}

export default Header;