"use client";
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const BestDeals = () => {
  const products = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]; // Dummy products

  const [visibleCount, setVisibleCount] = useState(5); // Default to 5 for larger screens
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 768) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);

    return () => {
      window.removeEventListener('resize', updateVisibleCount);
    };
  }, []);

  const handleNext = () => {
    if (startIndex < products.length - visibleCount) {
      setStartIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className='p-5 md:p-10'>
      <div className='flex flex-col bg-gray-300 rounded-lg p-3 md:p-5'>
        <span className='justify-start text-2xl text-black'>Best Deals</span>
        <div className="relative w-full flex items-center p-5">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className={`p-3 bg-gray-200 rounded-full text-lg font-bold transition-opacity text-black ${
              startIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
            }`}
          >
            &lt;
          </button>

          <div className="overflow-hidden w-full">
            <div
              className="flex gap-4 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${startIndex * (100 / visibleCount)}%)` }}
            >
              {products.map((_, index) => (
                <div key={index} className={`flex-shrink-0 w-${Math.floor(100 / visibleCount)}%`}>
                  <ProductCard />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={startIndex + visibleCount >= products.length}
            className={`p-3 bg-gray-200 rounded-full text-lg font-bold transition-opacity text-black ${
              startIndex + visibleCount >= products.length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
            }`}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default BestDeals;