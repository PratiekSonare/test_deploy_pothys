import React from 'react'
import SearchBar from './SearchBar'

const header = () => {
  return (
    <div className='max-w-screen max-h-[150px] bg-white'>
      <div className='flex items-center justify-around gap-[300px] p-5'>

          {/* Search Bar - Takes up 2 columns */}
          <div className="">
            <div className='flex flex-col text-lg'>
              <span className='font-bold'>Address</span>
              <span className='font-bold'>Contact</span>
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center items-center">
            <img 
              src='/pothys-2template.svg' 
              alt='logo'
              style={{ width: '80%', height: 'auto' }}>    
              </img>
          </div>

          {/* Cart */}
          <div className="relative text-center text-lg">
            <div className='flex items-center bg-red-300 rounded-lg p-2'>
              <img 
                src='/shoppingcart.svg' 
                alt='cart'
                style={{ width: '80%', height: 'auto' }} 
              />
              <div className='absolute top-6 right-0 transform translate-x-1/2 -translate-y-1/2 p-1 rounded-3xl bg-red-500 text-sm text-white'>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>      
    </div>
  )
}

export default header