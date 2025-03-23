"use client"
import React from 'react'

const Footer = () => {
  return (
    <footer className="flex flex-row md:hidden max-w-screen bg-gray-900 p-5 text-xs justify-around items-center">


      <div className='grid grid-cols-[1fr_1fr_2fr] space-x-5'>
        {/* Pothys Store Links */}
        <div className="flex flex-col text1 text-gray-400">
          <span className="text2 text-white tracking-tight">Pothys Store</span>
          <div className="my-1"></div>
          <span>link1</span>
          <span>link2</span>
          <span>link3</span>
        </div>
  
      {/* Help and Contact Us Links */}
        <div className="flex flex-col text1 text-gray-400">
          <span className="text2 text-white">Help</span>
          <div className="my-1"></div>
          <span>FAQs</span>
          <span>Contact Us</span>
          <span>About Us</span>
        </div>
  
        {/* Image and Social Icons */}
        <div className="flex flex-col items-center gap-5 max-w-xs flex-shrink-0 ">
          <img src="/pohtys-white-final.svg" style={{ width: '100%' }} alt="Logo" />
          <div className="flex flex-row items-center justify-center gap-5">
            <img src="/google.svg" style={{ width: '8%', filter: 'invert(0.8)' }} alt="Google" />
            <img src="/iconmonstr-instagram-11.svg" style={{ width: '8%', filter: 'invert(0.8)' }} alt="Instagram" />
            <img src="/whatsapp.svg" style={{ width: '8%', filter: 'invert(0.8)' }} alt="WhatsApp" />
          </div>
        </div>
      </div>


      
  </footer>
  )
}

export default Footer;