import React from 'react';
import Link from 'next/link'; // Import Link from next/link


const Header = () => {
  return (
    <div className='max-w-screen max-h-[150px] bg-white'>
      <div className='flex items-center justify-around p-5'>
        
        {/* Empty div to take up space on the left */}
        <div className="flex-grow"></div>

        {/* Logo */}
        <div className="flex justify-center items-center">
          <img 
            src='/pothys-2template.svg' 
            alt='logo'
            style={{ width: '60%', height: 'auto' }} 
          />
        </div>

        {/* Empty div to take up space on the left */}
        <div className="flex-grow"></div>

        {/* Cart */}
        <Link href='/cart'>
          <div className="relative text-center text-lg">
            <div className='flex items-center bg-red-300 rounded-lg p-2 cursor-pointer'>
              <img 
                src='/shoppingcart.svg' 
                alt='cart'
                style={{ width: '60%', height: 'auto' }} 
              />
              <div className='absolute top-5 right-2 transform translate-x-1/2 -translate-y-1/2 p-1 rounded-3xl bg-red-500 text-sm text-white'>
                <span>10</span>
              </div>
            </div>
          </div>
        </Link>
        
      </div>      
    </div>
  );
}

export default Header;