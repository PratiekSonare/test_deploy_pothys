"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

const Footer = () => {

  const router = useRouter();

  return (
    <footer className="flex flex-row md:hidden max-w-screen bg-gray-900 p-5 text-[10px] justify-around items-center">

      <div className='flex flex-col justify-center items-center gap-10'>
        {/* main footer, pothys links */}
        <div className='-mb-5'>
          <div className='grid grid-cols-[1fr_1fr_2fr] space-x-5'>
            {/* Pothys Store Links */}
          <div className="flex flex-col justify-start items-start text1 text-gray-400">
              <span className="text2 text-white tracking-tight">Pothys Store</span>
              <div className="my-1"></div>
              <button onClick={() => router.push(`${process.env.NEXT_PUBLIC_FRONTEND_LINK}/`)}>Home</button>
              <button onClick={() => router.push(`${process.env.NEXT_PUBLIC_FRONTEND_LINK}/dow`)}>Best Deals</button>
              <button onClick={() => router.push(`${process.env.NEXT_PUBLIC_FRONTEND_LINK}/cart`)}>Cart</button>
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
            <div className="flex flex-col items-center gap-2 max-w-xs flex-shrink-0">
              <img src="/pohtys-white-final.svg" style={{ width: '90%' }} alt="Logo" />
              <div className="flex flex-row items-center justify-center gap-5">
                <img src="/google.svg" style={{ width: '8%', filter: 'invert(0.8)' }} alt="Google" />
                <img src="/iconmonstr-instagram-11.svg" style={{ width: '8%', filter: 'invert(0.8)' }} alt="Instagram" />
                <img src="/whatsapp.svg" style={{ width: '8%', filter: 'invert(0.8)' }} alt="WhatsApp" />
              </div>
            </div>
          </div>
        </div>

        {/* seltel */}
        <div className='flex flex-col justify-center items-center -mb-2 text-[8px]'>
          <span className="text0 text-gray-500">Powered by</span>
          <img
            src="/seltel-white.svg"
            className="w-[20%] -mt-1"
          ></img>
          <span className="text0 text-gray-500 -mt-1">© All rights reserved - 2025</span>
        </div>
      </div>

    </footer>
  )
}

export default Footer;