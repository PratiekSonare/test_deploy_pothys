"use client"
import Header from '../../header/Header'
import React, { useState } from 'react'
import '../../styles.css'
import Footer from '@/app/footer/Footer'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '../../../components/ui/separator'
import { Slider } from '../../../components/ui/slider'
import FVCards from './BHCards'

const page = () => {
  
    const [showAll, setShowAll] = useState(false);


  const categories = [
    "Fruits and Vegetables",
    "Beverages",
    "Daily Staples",
    "Cleaning and Household",
    "Beauty and Hygiene",
    "Home and Kitchen",
    "Foodgrains, Oil and Masala",
    "Eggs, Meat and Fish",
    "Bakery, Cakes and Dairy"
  ]

  const samplebrands = [
    "brand1",
    "brand2",
    "brand3",
    "brand4",
    "brand5",
    "brand6",
    "brand7",
    "brand8",
    "brand9",
    "brand0"
  ]

  const discounts = [
    "50% and more off",
    "30% and more off",
    "Deal of the Week"
  ]

  const visibleBrands = (samplebrands.length > 5 && showAll) ? samplebrands : samplebrands.slice(0, 5);

  
  return (
    <>
        <header className="top-0 header-sdw">
            <Header />
        </header>
        
        <div className='my-20'></div>

        <div className='min-h-screen flex flex-col'>

            {/* Main Content */}
            <div className='flex-grow'>
                <div className='grid grid-cols-[1fr_4fr] px-20 space-x-10'>

                    {/* filter */}
                    <div className='flex flex-col gap-5'>

                        <div className='bg-white px-10 py-5 rounded-lg card-sdw'>
                            <p className='text3 text-2xl mb-2'>Categories</p>
                            {categories.map((category, index) => (
                                <button key={index} className='block relative w-fit'>
                                    <p className='text0 text-base text-gray-600 mt-2 cursor-pointer group'>
                                        {category}
                                        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                                    </p>
                                </button>
                            ))}
                        </div>

                        <div className='bg-white px-10 py-5 rounded-lg card-sdw'>
                            <div className='flex flex-col gap-2'>
                                <p className='text3 text-2xl mb-2'>Filters</p>

                                {/* Availability */}
                                <div className='flex flex-col mb-2'>
                                    <p className='text1 text-lg mb-2 text-gray-800'>Availability</p>
                                    <div className='flex flex-row items-center text0 space-x-2 ml-4'>
                                        <Checkbox id="out-of-stock" />
                                        <label
                                            htmlFor="out-of-stock"
                                            className="text-gray-600 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Out of stock
                                        </label>
                                    </div>
                                </div>

                                <Separator className='my-1' />

                                {/* Brands */}
                                <div className='flex flex-col'>
                                    <p className='text1 text-lg text-gray-800'>Brands</p>

                                    {visibleBrands.map((brand, index) => (
                                        <div key={brand} className='flex flex-row items-center text0 space-x-2 ml-4 mt-2'>
                                            <Checkbox id={`brand-${index}`} />
                                            <label
                                                htmlFor={`brand-${index}`}
                                                className="text-gray-600 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {brand}
                                            </label>
                                        </div>
                                    ))}

                                    {/* Show More / Show Less Button */}
                                    {samplebrands.length > 5 && (
                                        <div className='flex items-center justify-center'>
                                            <button 
                                                className="text3 text-blue-600 text-sm mt-2"
                                                onClick={() => setShowAll(!showAll)}
                                            >
                                                {showAll ? "Show Less" : "Show More"}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <Separator className='my-2' />

                                {/* Price */}
                                <div className='flex flex-col mb-2'>
                                    <p className='text1 text-lg mb-2 text-gray-800'>Price</p>
                                    <Slider
                                        defaultValue={[50]}
                                        max={100}
                                        step={1}
                                        className='w-full self-center'
                                    />
                                </div>
                                
                                <Separator className='my-2' />

                                {/* Discount */}
                                <div className='flex flex-col mb-2'>
                                    <p className='text1 text-lg mb-2 text-gray-800'>Discount</p>

                                    {discounts.map((discount, index) => (
                                        <div key={discount} className='flex flex-row items-center text0 space-x-2 ml-4 mt-2'>
                                            <Checkbox id={`brand-${index}`} />
                                            <label
                                                htmlFor={`brand-${index}`}
                                                className="text-gray-600 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {discount}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className=''>
                        <FVCards />
                    </div>
                </div>
            </div>

            <div className='my-20'></div>

            {/* Footer */}
            <footer className=''>
                <Footer />
            </footer>

        </div>
    </>
  )
}

export default page