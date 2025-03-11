import React from 'react';
import Link from 'next/link'; // Import Link from next/link
import { useCart } from '../cart/CartContext';

const Header = () => {

  const { cartItems, addToCart, incrementQ, decrementQ, removeFromCart, clearCart } = useCart();
  
  return (
    <div className='max-w-screen max-h-[150px] bg-white'>
      <div className="grid grid-cols-3 items-center p-5 px-10">
        {/* Cart Icon */}
        <Link href="/" className="flex justify-start">
          <img 
            src="/arrow.svg" 
            alt="cart"
            className="w-8 h-auto" 
          />
        </Link>

        {/* Logo (Centered) */}
        <div className="flex justify-center">
          <img 
            src="/pothys-2template.svg" 
            alt="logo"
            className="w-40 h-auto" 
          />
        </div>

        {/* Empty Space to Balance Layout */}
        <div></div>
        
      </div>
            
    </div>
  );
}

export default Header;