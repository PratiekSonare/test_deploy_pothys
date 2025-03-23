import { useRouter } from 'next/navigation'
import React from 'react'

const CategoryCard = () => {

    const router = useRouter();

    const images = [
        {
            src: "/category_images/bh/hp_b&h_m_-makeup_480_250923.webp",
            alt: "beverages"
        },
        {
            src: "/category_images/bh/hp_b&h_m_big-pack-bigger-saving bf_480_250923.webp",
            alt: "beverages"
        },
        {
            src: "/category_images/bh/hp_b&h_m_mens-shaving_480_250923.webp",
            alt: "beverages"
        },
        {
            src: "/category_images/bh/hp_b&h_m_minimum-30-off_480_250923.webp",
            alt: "beverages"
        },
        {
            src: "/category_images/bh/hp_b&h_m_moisturiser_480_250923.webp",
            alt: "beverages"
        },
        {
            src: "/category_images/bh/hp_b&h_m_moisturiser_480_250923.webp",
            alt: "beverages"
        },
    ]
  return (
    <div className="flex flex-col bg-transparent rounded-lg py-5">
        <div className='block relative w-fit md:mb-3'>
            <span className="cursor-pointer group text-xl z-50 md:text-[40px] items-start text3">
                Beauty and Hygiene
                <span className="absolute rounded-lg left-0 bottom-0 -z-50 w-0 h-[4px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </span>
        </div>        
        <div className="mb-5 mt-2 grid grid-cols-2 gap-2 md:flex md:flex-row  md:gap-10">
            {images.map((image, index) => (
                <img
                    src={image.src}
                    alt={image.alt}
                    key={index}
                    className='rounded-lg w-full md:w-[15%] h-auto hover:scale-105 transition-all ease-in-out duration-300 shadow-xl hover:shadow-2xl'
                    onClick={() => router.push('/category/bh')}>                    
                </img>
            ))}
        </div>
    </div>
  )
}

export default CategoryCard