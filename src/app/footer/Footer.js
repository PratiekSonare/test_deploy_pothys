"use client"
import { useRouter } from 'next/navigation';
import React from 'react'
import dotenv from 'dotenv'

const Footer = () => {

  const router = useRouter();
  dotenv.config();

  const categories = [
    { name: "Fruits and Vegetables", route: "/category/fv" },
    { name: "Beverages", route: "/category/beverages" },
    { name: "Daily Staples", route: "/category/ds" },
    { name: "Cleaning and Household", route: "/category/ch" },
    { name: "Beauty and Hygiene", route: "/category/bh" },
    { name: "Home and Kitchen", route: "/category/hk" },
    { name: "Oil and Masala", route: "/category/fom" },
    { name: "Eggs and Meat", route: "/category/emf" },
    { name: "Bakery and Dairy", route: "/category/bcd" },
    { name: "Snacks", route: "/category/snacks" },
  ]

  return (
    <footer className="hidden md:block max-w-screen bg-gray-900 p-10 text-lg">
      <div className='flex flex-col justify-center items-center gap-16'>

        {/* pothys and other info */}
        <div className="grid grid-cols-5 gap-5 px-10 w-full">

          <div className='flex flex-col gap-10 justify-start items-start'>
            {/* Pothys Store Links */}
            <div className="flex flex-col justify-start items-start text1 text-gray-400">
              <span className="text2 text-white">Pothys Store</span>
              <div className="my-2"></div>
              <button onClick={() => router.push(`${process.env.NEXT_PUBLIC_FRONTEND_LINK}/`)}>Home</button>
              <button onClick={() => router.push(`${process.env.NEXT_PUBLIC_FRONTEND_LINK}/dow`)}>Best Deals</button>
              <button onClick={() => router.push(`${process.env.NEXT_PUBLIC_FRONTEND_LINK}/cart`)}>Cart</button>
            </div>

            {/* Help and Contact Us Links */}
            <div className="flex flex-col items-start text1 text-gray-400">
              <span className="text2 text-white">Help</span>
              <div className="my-2"></div>
              <button onClick={() => router.push(`${process.env.NEXT_PUBLIC_FRONTEND_LINK}/admin/admin-login`)}>Admin Portal</button>
              <button onClick={() => router.push(`${process.env.NEXT_PUBLIC_FRONTEND_LINK}/admin/admin-login`)}>Contact Us</button>
              <button onClick={() => router.push(`${process.env.NEXT_PUBLIC_FRONTEND_LINK}/admin/admin-login`)}>About Us</button>
            </div>
          </div>

          {/* Shop by category */}
          <div className="flex flex-col justify-start items-start text1 text-gray-400">
            <span className="text2 text-white">Shop now</span>
            <div className="my-2"></div>
            {categories.map((content, index) =>
              <button key={index} onClick={() => router.push(`${content.route}`)}>{content.name}</button>
            )}
          </div>

          <div className='flex flex-col justify-around h-full'>
            {/* Image and Social Icons */}
            <div className="flex flex-col items-start gap-5 max-w-xs flex-shrink-0">
              <img src="/pohtys-white-final.svg" style={{ width: '100%' }} alt="Logo" />
              <div className="flex flex-row items-center justify-center gap-10">
                <img src="/google.svg" style={{ width: '8%', filter: 'invert(0.8)' }} alt="Google" />
                <img src="/iconmonstr-instagram-11.svg" style={{ width: '8%', filter: 'invert(0.8)' }} alt="Instagram" />
                <img src="/whatsapp.svg" style={{ width: '8%', filter: 'invert(0.8)' }} alt="WhatsApp" />
              </div>
            </div>
  
            {/* seltel  */}
            <div className='flex flex-col justify-center items-center'>
              <span className="text0 text-xs text-gray-500">Powered by</span>
              <img
                src="/seltel-white.svg"
                className="w-[35%] -mt-2"
              ></img>
              <span className="text0 text-xs text-gray-500">© All rights reserved - 2025</span>
            </div>
          </div>

          {/* Branch */}
          <div className="flex flex-col items-end text1 text-gray-400">
            <span className="text2 text-white">Branch</span>
            <div className="my-2"></div>
            <button>Puducherry</button>
            <button>ABCDEFGH</button>
            <button>ABCDEFGH</button>
          </div>

          {/* Map */}
          <div className="flex flex-col items-end text1 text-gray-400">
            <span className="text2 text-white">Visit Us</span>
            <div className="my-2"></div>

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.420538740364!2d72.91253117520677!3d19.13306048208331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c7f189efc039%3A0x68fdcea4c5c5894e!2sIndian%20Institute%20of%20Technology%20Bombay!5e0!3m2!1sen!2sin!4v1743166793129!5m2!1sen!2sin"
              style={{ width: '180px', height: '300px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className='rounded-lg'
            ></iframe>
          </div>

        </div>

        <div className='flex flex-col justify-center items-center -mt-10 -mb-5'>


        </div>

      </div>

    </footer>
  )
}

export default Footer;