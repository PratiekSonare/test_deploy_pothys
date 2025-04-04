import { useRouter } from 'next/navigation'
import React from 'react'

const images = [
    {
        src:"/category_images/fv/hp_f&v_m_cuts-&-exotics_480_250923.webp",
        alt: "fv"
    },
    {
        src:"/category_images/fv/hp_f&v_m_fresh-fruits_480_250923.webp",
        alt: "fv"
    },
    {
        src:"/category_images/fv/hp_f&v_m_fresh-vegetables_480_250923.webp",
        alt: "fv"
    },
    {
        src:"/category_images/fv/hp_f&v_m_herbs-&-seasoning_480_250923.webp",
        alt: "fv"
    },
]


const CategoryCard = () => {
    const router = useRouter();

  return (
    <div className="flex flex-col bg-transparent rounded-lg py-5">
        <div className='block relative w-fit md:mb-3'>
            <span className="cursor-pointer group text-xl z-50 md:text-[40px] items-start text3">
                Fruits and Vegetables
                <span className="absolute rounded-lg left-0 bottom-0 -z-50 w-0 h-[4px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </span>
        </div>        
                <div className="mb-5 mt-2 grid grid-cols-2 gap-2 md:flex md:flex-row  md:gap-10">
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    className='rounded-lg w-full md:w-[22%] h-auto hover:scale-105 transition-all ease-in-out duration-300 shadow-xl hover:shadow-2xl'
                    onClick={() => router.push('/category/fv')}>                    
                </img>
            ))}
        </div>
    </div>
  )
}

export default CategoryCard