import Image from "next/image";
import Header from "./header/Header"
import ProductCard from './ProductCard'
import Card from "./Card"
import BestDeals from "./BestDeals";
import ShadcnCard from "./ShadcnCard"
import ShadcnCardAlt from "./ShadcnCardAlt"

export default function Home() {
  return (
    <>
      <header className="top-0">
        <Header />
      </header>
      
      <div className="p-5 md:pt-10 md:px-40">
        <div className="flex flex-col bg-gray-300 rounded-lg px-20 py-5 border-black border-dashed border-[1px] border-opacity-80">
          <span className="text-[30px] items-start">Best Deals</span>
          <div className="mb-5"><ShadcnCardAlt /></div>
        </div>
      </div>


      <div className="p-5 md:py-5 md:px-40">
        <div className="flex flex-col bg-gray-300 rounded-lg px-20 py-5 border-black border-dashed border-[1px] border-opacity-80">
          <span className="text-[30px] items-start">Best Deals</span>
          <div className="mb-5"><ShadcnCardAlt /></div>
        </div>
      </div>

      <div className="p-5 md:py-5 md:px-40">
        <div className="flex flex-col bg-gray-300 rounded-lg px-20 py-5 border-black border-dashed border-[1px] border-opacity-80">
          <span className="text-[30px] items-start">Best Deals</span>
          <div className="mb-5"><ShadcnCardAlt /></div>
        </div>
      </div>

      <div className="p-5 md:py-5 md:px-40">
        <div className="flex flex-col bg-gray-300 rounded-lg px-20 py-5 border-black border-dashed border-[1px] border-opacity-80">
          <span className="text-[30px] items-start">Best Deals</span>
          <div className="mb-5"><ShadcnCardAlt /></div>
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
