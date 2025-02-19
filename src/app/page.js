import Image from "next/image";
import Header from "./header/Header"
import ProductCard from './ProductCard'
import Card from "./Card"
import BestDeals from "./BestDeals";

export default function Home() {
  return (
    <>
      <header className="top-0">
        <Header />
      </header>
      
      <div className="p-5 md:p-10">
        <div className="flex flex-col bg-gray-300 rounded-lg">
          <span className="text-md md:text-2xl mx-5 md:mx-10 mt-5 md:mt-5 -mb-5 md:-mb-8">Best Deals</span>
          <div><Card/></div>
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
