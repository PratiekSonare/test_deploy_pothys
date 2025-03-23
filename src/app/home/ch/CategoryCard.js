import { useRouter } from 'next/navigation'
import React from 'react'

const images = [
    {
        src:"/category_images/cleaning/hp_c&h_m_cleaners_480_250723.webp",
        alt: "cleaning"
    },
    {
        src:"/category_images/cleaning/hp_c&h_m_detergents-&-fabric-care_480_250723.webp",
        alt: "cleaning"
    },
    {
        src:"/category_images/cleaning/hp_c&h_m_freshner_480_250723.webp",
        alt: "cleaning"
    },
    {
        src:"/category_images/cleaning/hp_c&h_m_paper-disposables-&-garbage-bags_480_250723.webp",
        alt: "cleaning"
    },
]


const CategoryCard = () => {

    const router = useRouter();

    
  return (
    <div className="flex flex-col bg-transparent rounded-lg py-5">
        <div className='block relative w-fit md:mb-3'>
            <span className="cursor-pointer group text-xl z-50 md:text-[40px] items-start text3">
                Cleaning and Household
                <span className="absolute rounded-lg left-0 bottom-0 -z-50 w-0 h-[4px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </span>
        </div>        
        <div className="mb-5 mt-2 grid grid-cols-2 gap-2 md:flex md:flex-row  md:gap-10">
            {images.map((image, index) => (
                <img
                    src={image.src}
                    alt={image.alt}
                    key={index}
                    className='rounded-lg w-full h-auto md:w-[22%] hover:scale-105 transition-all ease-in-out duration-300 shadow-xl hover:shadow-2xl'
                    onClick={() => router.push('/category/ch')}>                    
                </img>
            ))}
        </div>
    </div>
  )
}

export default CategoryCard