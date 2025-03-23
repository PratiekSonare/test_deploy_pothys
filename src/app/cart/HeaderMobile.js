import React from 'react';
import Link from 'next/link'; // Import Link from next/link
import { useCart } from './CartContext';

const Header = () => {
  const { cartItems, addToCart, incrementQ, decrementQ, removeFromCart, clearCart } = useCart();
  
  return (
    <div className='flex md:hidden max-w-screen max-h-[150px] bg-white'>
      <div className='grid grid-cols-3 items-center p-5'>

        {/* Left Icon (e.g., Cart Icon) */}
        <div className="flex justify-start scale-90">
          <Link href="/">
            <img 
              src="/arrow.svg" 
              alt="cart"
              className="w-8 h-auto" 
            />
          </Link>
        </div>

        {/* Logo */}
        <div className="flex justify-center items-center">
          <img 
            src='/pothys-2template.svg' 
            alt='logo'
            style={{ width: '100%', height: 'auto' }} 
          />
        </div>

        {/* Right Icons (e.g., Phone and Form Icons)
        <div className='flex justify-end space-x-1 scale-75'>
          <div className='p-2 rounded-lg bg-red-400 flex items-center justify-end'>
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
         */}
         
      </div>      
    </div>
  );
}

export default Header;