"use client"
import React, { useState } from "react";
import Header from "./header/Header"
import SearchBar from "./header/SearchBar";
import SearchBarMobile from './header/SearchBarMobile';
import ShadcnCard from "./home/ShadcnCard";
import CategoryCardFv from "./home/fv/CategoryCard";
import CategoryCardBe from "./home/beverages/CategoryCard";
import CategoryCardSn from "./home/snacks/CategoryCard";
import CategoryCardCl from "./home/ch/CategoryCard";
import CategoryCardBh from "./home/bh/CategoryCard";
import CategoryCardHk from "./home/hk/CategoryCard";
import ImageCarousel from "./home/image_carousel/ImageCarousel";

import './styles.css';
import Footer from "./footer/Footer";
import HeaderParent from "./header/HeaderParent";
import FooterParent from "./footer/FooterParent";
import ShadcnCardParent from "./home/ShadcnCardParent";

export default function Home() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="overflow-x-hidden">
      <header className="top-0 header-sdw w-full">
        <HeaderParent />
      </header>

      <div className="flex flex-col items-center justify-center my-10 z-50">

        <div className="flex flex-col gap-2 items-center text-xl md:text-4xl my-5 md:my-10 px-5">
          <span className="poppins-medium text-center"><span className="poppins-extrabold text-green-600">Shopping</span> made easy. <span className="poppins-extrabold text-green-600">Grocery</span> at your doorstep.</span>
          <span>Now at <span className="poppins-extrabold">Puducherry</span>!</span>
        </div>

        <SearchBar
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
        <SearchBarMobile
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />

      </div>


      <div className={isSearchFocused ? 'blur' : ''}>
        <div className="p-5 md:pt-10 md:px-40 z-0">
          <div className="flex flex-col bg-gray-100 rounded-lg px-5 md:px-20 py-5 border-black border-dashed border-[1px] border-opacity-80 bg-dow">
            <span className="text-xl md:text-[40px] items-start text3 mt-2 md:mt-5 md:mb-3">Deal of the Week</span>
            <div className="mb-5 mt-2"><ShadcnCardParent /></div>
          </div>
        </div>

        {/* popular now */}
        {/* <div className="p-5 md:py-5 md:px-40">
          <div className="flex flex-col bg-gray-100 rounded-lg px-20 py-5 border-black border-dashed border-[1px] border-opacity-80">
            <span className="text-[30px] items-start text3 mt-5">POPULAR NOW</span>
            <div className="mb-5 mt-2"><ShadcnCard /></div>
          </div>
        </div> */}

        <div className="p-5 md:py-5 md:px-40">
          <CategoryCardFv />
        </div>

        <div className="-my-10" />

        <div className="p-5 md:py-5 md:px-40">
          <CategoryCardBe />
        </div>

        <div className="-my-10" />

        <div className="p-5 md:py-5 md:px-40">
          <CategoryCardSn />
        </div>

        <div className="-my-10" />

        <div className="p-5 md:py-5 md:px-40">
          <CategoryCardCl />
        </div>

        <div className="-my-10" />

        <div className="p-5 md:py-5 md:px-40">
          <CategoryCardBh />
        </div>

        <div className="-my-10" />

        <div className="p-5 md:py-5 md:px-40">
          <CategoryCardHk />
        </div>

        <div className="my-10" />

        <div className="p-5 md:py-5 md:px-40 text-center">
          <div className="flex flex-col justify-center items-center">
            <ImageCarousel />
            <div className="my-5"></div>
            <span className="text-4xl text3">Established in 2024</span>
            <div className="my-1"></div>
            <span className="text-lg/6 md:text-3xl text1">Pothy's store has served more than <span className="text2 text-green-600">500+</span> customers across <span className="text2">Puducherry</span>!</span>
            <div className="my-5"></div>
            <span className="text-lg md:text-3xl text1">Customter's <span className="text2">trust</span>, our <span className="text2">commitment</span>! </span>
          </div>
        </div>

        <div className="my-5 md:my-10"></div>
      </div>


      <footer className="w-full">
        <FooterParent />
      </footer>
    </div>

  );
}
