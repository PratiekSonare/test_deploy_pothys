"use client"
import React from 'react';
import Link from 'next/link'; // Import Link from next/link
import { useCart } from '../cart/CartContext';
import '../styles.css'

const Header = () => {

  const { cartItems, addToCart, incrementQ, decrementQ, removeFromCart, clearCart } = useCart();
  
  return (
    <div className='flex md:hidden max-w-screen max-h-[150px] bg-white'>
      <div className='flex items-center justify-between p-5'>
        
        {/* Logo */}
        <div className="flex justify-start items-center">
          <img 
            src='/pothys-2template.svg' 
            alt='logo'
            style={{ width: '40%', height: 'auto' }} 
            className=''
          />
        </div>


        {/* Cart */}
        <Link href='/cart'>
          <div className="relative text-center text-lg">
            <div className='flex flex-col items-center justify-center cursor-pointer scale-75'>

                <div className='absolute top-5 -right-1'>
                  <div className='p-2 bg-black flex justify-center items-center rounded-md' style={{ width: '25px', height: '25px' }}>
                    <span className='text-md text-white text3'> {cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0} </span>
                  </div>
                </div>

                <div className='w-3/4 p-2 rounded-lg bg-red-400'>
                  <img 
                    src='/shoppingcart.svg' 
                    alt='cart'
                    style={{ width: '100%', height: 'auto' }} 
                    className='w-1/2'
                  />
                </div>

            </div>
          </div>
        </Link>
        
      </div>      
    </div>
  );
}

export default Header;