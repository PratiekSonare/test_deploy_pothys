"use client"
import React, {useState} from "react";
import Header from "./header/Header"
import SearchBar from "./header/SearchBar";
import ShadcnCardAlt from "./ShadcnCard"
import './styles.css'

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
            <div className="mb-5 mt-2"><ShadcnCardAlt /></div>
          </div>
        </div>
  
        <div className="p-5 md:py-5 md:px-40">
          <div className="flex flex-col bg-gray-100 rounded-lg px-20 py-5 border-black border-dashed border-[1px] border-opacity-80">
            <span className="text-[30px] items-start text3 mt-5">POPULAR NOW</span>
            <div className="mb-5 mt-2"><ShadcnCardAlt /></div>
          </div>
        </div>
      </div>


    
      {/* <div className=" bg-gray-400">
        <footer className="">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Learn
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </div> */}
    </>
      
  );
}
