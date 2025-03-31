import { useRouter } from 'next/navigation'
import React from 'react'

const CategoryCard = () => {

    const images = [
        {
            src: "/category_images/hk/hp_GM-cleaning-needs_m_250723_06.webp",
            alt: "beverages"
        },
        {
            src: "/category_images/hk/hp_GM-storage-container_m_250723_05.webp",
            alt: "beverages"
        },
        {
            src: "/category_images/hk/hp_GM100-199_m_250723_02.webp",
            alt: "beverages"
        },
        {
            src: "/category_images/hk/hp_GMStorefront-pressure-cooker_m_250723_03.webp",
            alt: "beverages"
        }
    ]
    
    const router = useRouter();

  return (
    <div className="flex flex-col bg-transparent rounded-lg py-5">
        <div className='block relative w-fit md:mb-3'>
            <span className="cursor-pointer group text-xl z-50 md:text-[40px] items-start text3">
                Home and Kitchen
                <span className="absolute rounded-lg left-0 bottom-0 -z-50 w-0 h-[4px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </span>
        </div>        
                <div className="mb-5 mt-2 grid grid-cols-2 gap-2 md:flex md:flex-row  md:gap-10">
            {images.map((image, index) => (
                <img
                    src={image.src}
                    alt={image.alt}
                    key={index}
                    className='rounded-lg w-full md:w-[22%] h-auto hover:scale-105 transition-all ease-in-out duration-300 shadow-xl hover:shadow-2xl'
                    onClick={() => router.push('/category/hk')}>                                        
                </img>
            ))}
        </div>
    </div>
  )
}

export default CategoryCard