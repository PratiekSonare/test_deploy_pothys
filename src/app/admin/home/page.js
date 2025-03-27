"use client"
import React, { useState, useEffect } from 'react'
import HeaderParent from '@/app/cart/HeaderParent'
import '../../styles.css'
import { useRouter } from 'next/navigation'
import dotenv from 'dotenv';
// landing page for the admin, routes to other dashboards and activites
// employee list, store location, etc

dotenv.config();

const page = () => {
  
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString(); // HH:MM:SS
      const formattedDate = now.toLocaleDateString(); // DD/MM/YYYY or MM/DD/YYYY based on locale

      setCurrentTime(`${formattedDate} | ${formattedTime}`);
    };

    updateTime(); // Set initial value immediately
    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);


  const router = useRouter();

  const content = [
    {
      title: "Admin Settings",
      description: "Manage and edit admin users, settings",
      src: "/admin-svgrepo-com.svg",
      routeTo: "/admin/settings",
    },
    {
      title: "Inventory Dashboard",
      description: "Checkout existing inventory, pending stock",
      src: "/shoppingcart.svg",
      routeTo: "/admin/inv",
    },
    {
      title: "Finances",
      description: "Look at daily, monthly revenue. Manage dyanmic pricing.",
      src: "/american-dollar-cents.svg",
      routeTo: "/admin/fin",
    },
    {
      title: "Activity Dashboard", //notifications, pending deliveries
      description: "Analyse user/admin activity across all interfaces in one touch.",
      src: "/notebook.svg",
      routeTo: "/admin/activity",
    },
  ];

  return (
    <div className=''>

      <header className='top-0 header-sdw'>
        <HeaderParent />
      </header>

      <div className='my-10'></div>

      <div className='px-24 flex flex-row justify-between items-center'>
        <span className='text-4xl text3'>Welcome, admin.</span>
        <div className='flex flex-col items-end mr-5'>
          <span className='text-lg text0'>Date/Time</span>
          <span className='text-2xl text2'>{currentTime}
          </span>
        </div>
      </div>

      <div className='my-10'></div>

      <div className='px-24'>

        {content.map((content, index) =>
          <div
            key={index}
            onClick={() => router.push(`${process.env.NEXT_PUBLIC_FRONTEND_LINK}/${content.routeTo}`)}
            className='p-10 mb-10 shadow-lg rounded-lg flex flex-row gap-16 items-center hover:scale-[101%] transition-all duration-300 ease-in-out
            bg-transparent border-blue-500 border-[3px] hover:bg-blue-500 hover:border-0 group'>

            <img
              src={content.src}
              className='w-[5%]'
            />

            <div className='flex flex-row justify-between w-full'>
              <div className='flex flex-col'>
                <span className='text3 text-3xl group-hover:text-white'>{content.title}</span>
                <span className='text0 text-lg text-gray-600 group-hover:text-gray-400'>{content.description}</span>
              </div>
              <div className='flex-grow'></div>

              <img src='/arrow.svg' className='w-[3%] rotate-180'>
              </img>
            </div>

          </div>

        )}


      </div>

    </div>
  )
}

export default page