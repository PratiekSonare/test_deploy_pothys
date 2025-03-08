import React from 'react'

const CategoryCard = () => {

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
        <span className="text-[30px] items-start text3">Beauty and Hygiene</span>
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