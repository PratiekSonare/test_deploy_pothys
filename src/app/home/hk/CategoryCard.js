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
        },
        {
            src: "/category_images/hk/hp_GMStorefront-stationery-store_m_250723_04.webp",
            alt: "beverages"
        },
        {
            src: "/category_images/hk/hp_GMunder-99_m_250723_01.webp",
            alt: "beverages"
        },
    ]
  return (
    <div className="flex flex-col bg-transparent rounded-lg py-5">
        <span className="text-[30px] items-start text3">Home and Kitchen</span>
        <div className="mb-5 mt-2 flex flex-row gap-5">
            {images.map((image, index) => (
                <img
                    src={image.src}
                    alt={image.alt}
                    key={index}
                    className='rounded-lg hover:scale-105 transition-all ease-in-out duration-300 shadow-xl hover:shadow-2xl'
                    style={{width: '15%', height: 'auto'}}>                    
                </img>
            ))}
        </div>
    </div>
  )
}

export default CategoryCard