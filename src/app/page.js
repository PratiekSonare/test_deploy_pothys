"use client"
import React, {useState} from "react";
import Header from "./header/Header"
import SearchBar from "./header/SearchBar";
import ShadcnCard from "./home/ShadcnCard";
import CategoryCardFv from "./home/fv/CategoryCard";
import CategoryCardBe from "./home/beverages/CategoryCard";
import CategoryCardSn from "./home/snacks/CategoryCard";
import CategoryCardCl from "./home/cleaning/CategoryCard";
import CategoryCardBh from "./home/bh/CategoryCard";
import CategoryCardHk from "./home/hk/CategoryCard";
import ImageCarousel from "./home/image_carousel/ImageCarousel";

import './styles.css';

export default function Home() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <>
      <header className="top-0 header-sdw">
        <Header />
      </header>
      
      <div className="flex flex-col items-center justify-center my-10 z-50">

        <div className="flex flex-col gap-2 items-center text-4xl my-10">
          <span className="poppins-medium"><span className="poppins-extrabold text-green-600">Shopping</span> made easy. <span className="poppins-extrabold text-green-600">Grocery</span> at your doorstep.</span>
          <span>Now at <span className="poppins-extrabold">Puducherry</span>!</span>
        </div>

        <SearchBar 
          onFocus={() => setIsSearchFocused(true)} 
          onBlur={() => setIsSearchFocused(false)} 
        />
      </div>


      <div className={isSearchFocused ? 'blur' : ''}>
        <div className="p-5 md:pt-10 md:px-40 z-0">
          <div className="flex flex-col bg-gray-100 rounded-lg px-20 py-5 border-black border-dashed border-[1px] border-opacity-80">
            <span className="text-[30px] items-start text3 mt-5">BEST DEALS</span>
            <div className="mb-5 mt-2"><ShadcnCard /></div>
          </div>
        </div>
  
        <div className="p-5 md:py-5 md:px-40">
          <div className="flex flex-col bg-gray-100 rounded-lg px-20 py-5 border-black border-dashed border-[1px] border-opacity-80">
            <span className="text-[30px] items-start text3 mt-5">POPULAR NOW</span>
            <div className="mb-5 mt-2"><ShadcnCard /></div>
          </div>
        </div>

        <div className="p-5 md:py-5 md:px-40">
          <CategoryCardFv/>
        </div>

        <div className="-my-10"/>

        <div className="p-5 md:py-5 md:px-40">
          <CategoryCardBe/>
        </div>

        <div className="-my-10"/>

        <div className="p-5 md:py-5 md:px-40">
          <CategoryCardSn/>
        </div>

        <div className="-my-10"/>

        <div className="p-5 md:py-5 md:px-40">
          <CategoryCardCl/>
        </div>

        <div className="-my-10"/>

        <div className="p-5 md:py-5 md:px-40">
          <CategoryCardBh/>
        </div>

        <div className="-my-10"/>

        <div className="p-5 md:py-5 md:px-40">
          <CategoryCardHk/>
        </div>

        <div className="my-10"/>

        <div className="p-5 md:py-5 md:px-40">
          <div className="flex flex-col justify-center items-center">
            <ImageCarousel/>
            <div className="my-5"></div>
            <span className="text-3xl text3">Established in 2024</span>
            <div className="my-3"></div>
            <span className="text-xl text1">Pothy's store has served more than <span className="text2 text-green-600">500+</span> customers across <span className="text2">Puducherry</span>!</span>
            <span className="text-xl text1">Customter's <span className="text2">trust</span>, our <span className="text2">commitment</span>! </span>            
          </div>
        </div>

        <div className="my-10"></div>
      </div>

    
      <footer className="bg-gray-900 p-10 text-lg">
        <div className="flex flex-row justify-around w-full">
          {/* Pothys Store Links */}
          <div className="flex flex-col text1 text-gray-400">
            <span className="text2 text-white">Pothys Store</span>
            <div className="my-2"></div>
            <span>link1</span>
            <span>link2</span>
            <span>link3</span>

          </div>

          {/* Image and Social Icons */}
          <div className="flex flex-col items-center gap-5 max-w-xs flex-shrink-0">
            <img src="/pohtys-white-final.svg" style={{ width: '100%' }} alt="Logo" />
            <div className="flex flex-row items-center justify-center gap-10">
              <img src="/google.svg" style={{ width: '8%', filter: 'invert(0.8)' }} alt="Google" />
              <img src="/iconmonstr-instagram-11.svg" style={{ width: '8%', filter: 'invert(0.8)' }} alt="Instagram" />
              <img src="/whatsapp.svg" style={{ width: '8%', filter: 'invert(0.8)' }} alt="WhatsApp" />
            </div>
          </div>

          {/* Help and Contact Us Links */}
          <div className="flex flex-col text1 text-gray-400">
            <span className="text2 text-white">Help</span>
            <div className="my-2"></div>
            <span>FAQs</span>
            <span>Contact Us</span>
            <span>About Us</span>
          </div>
        </div>
      </footer>
    </>
      
  );
}
