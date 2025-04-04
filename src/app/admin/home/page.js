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
  
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString(); // HH:MM:SS
      const formattedDate = now.toLocaleDateString(); // DD/MM/YYYY or MM/DD/YYYY based on locale

      setCurrentTime(`${formattedTime}`);
      setCurrentDate(`${formattedDate}`);
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
      routeTo: `${process.env.NEXT_PUBLIC_FRONTEND_LINK}/admin/settings`,
    },
    {
      title: "Inventory Dashboard",
      description: "Checkout existing inventory, pending stock",
      src: "/cart-shopping-fast.svg",
      routeTo: `${process.env.NEXT_PUBLIC_FRONTEND_LINK}/admin/inv`,
    },
    {
      title: "Finances",
      description: "Look at daily, monthly revenue. Manage dyanmic pricing.",
      src: "/american-dollar-cents.svg",
      routeTo: `${process.env.NEXT_PUBLIC_FRONTEND_LINK}/admin/fin`,
    },
    {
      title: "Product Analytics", //which product is fast moving, slow moving, rate of their transactions, best performing product in this week etc.
      description: "Analyse fast-moving, slow-moving products in your inventory, restock inventory intelligently!",
      src: "/statistics.svg",
      routeTo: `${process.env.NEXT_PUBLIC_FRONTEND_LINK}/admin/product-analytics`,
    },
    {
      title: "Activity Dashboard", //notifications, pending deliveries
      description: "Analyse user/admin activity across all interfaces in one touch.",
      src: "/notebook.svg",
      routeTo: `${process.env.NEXT_PUBLIC_FRONTEND_LINK}/admin/activity`,
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
        <div className='flex flex-row items-start gap-5 mr-5'>

          <div className='flex flex-col bg-green-500 px-5 py-2 rounded-lg'>
            <span className='text-lg text0 self-end text-green-300'>Time</span>
            <span className='text-2xl text2'>{currentTime}</span>
          </div>
          <div className='flex flex-col bg-green-500 px-5 py-2 rounded-lg'>
            <span className='text-lg text0 self-end text-green-300'>Date</span>
            <span className='text-2xl text2'>{currentDate}</span>
          </div>

        </div>
      </div>

      <div className='my-10'></div>

      <div className='px-24'>

        {content.map((content, index) =>
          <div
            key={index}
            onClick={() => router.push(`${content.routeTo}`)}
            className='p-10 mb-10 shadow-lg rounded-lg flex flex-row gap-16 items-center hover:scale-[101%] transition-all duration-300 ease-in-out
            bg-transparent border-blue-500 border-[3px] hover:bg-blue-500 hover:border-0 group'>

            <img
              src={content.src}
              className='w-[5%] group-hover:filter group-hover:invert'
            />

            <div className='flex flex-row justify-between w-full'>
              <div className='flex flex-col'>
                <span className='text3 text-3xl group-hover:text-white'>{content.title}</span>
                <span className='text0 text-lg text-gray-600 group-hover:text-gray-200'>{content.description}</span>
              </div>
              <div className='flex-grow'></div>

              <img src='/arrow.svg' className='w-[3%] rotate-180 group-hover:filter group-hover:invert'>
              </img>
            </div>

          </div>

        )}


      </div>

    </div>
  )
}

export default page