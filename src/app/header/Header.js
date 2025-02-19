import React from 'react'
import SearchBar from './SearchBar'

const header = () => {
  return (
    <div className='max-w-screen h-[100px] bg-white'>
      <div className='flex items-center justify-center'>
        <div className="grid md:grid-cols-4 grid-cols-3 gap-0 md:gap-[400px] items-center text-black p-5">
          {/* Logo */}
          <div className="hidden md:block col-span-1 text-center">
            Logo
          </div>

          {/* Search Bar - Takes up 2 columns */}
          <div className="col-span-2">
            <SearchBar />
          </div>

          {/* Cart */}
          <div className="col-span-1 text-center">
            Cart
          </div>
        </div>

      </div>
      
    </div>
  )
}

export default header