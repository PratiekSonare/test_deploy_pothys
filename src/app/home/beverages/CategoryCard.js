import React from 'react'

const CategoryCard = () => {

    const images = [
        {
            src: "/category_images/beverages/hp_bev_m_energy-drinks_480_250923.webp",
            alt: "beverages"
        },
        {
            src: "/category_images/beverages/hp_bev_m_flavoured-&-soya-milk_480_250923.webp",
            alt: "beverages"
        },
        {
            src: "/category_images/beverages/hp_bev_m_health-drinks-&-supplements_480_250923.webp",
            alt: "beverages"
        },
        {
            src: "/category_images/beverages/hp_bev_m_juices_480_250923.webp",
            alt: "beverages"
        },
        {
            src: "/category_images/beverages/hp_bev_m_soft-drinks-&-more_480_250923.webp",
            alt: "beverages"
        },
        {
            src: "/category_images/beverages/hp_bev_m_tea-&-coffee_480_250923.webp",
            alt: "beverages"
        },
    ]
  return (
    <div className="flex flex-col bg-transparent rounded-lg py-5">
        <span className="text-[30px] items-start text3">Beverages</span>
        <div className="mb-5 mt-2 flex flex-row gap-5">
            {images.map((image, index) => (
                <img
                    src={image.src}
                    alt={image.alt}
                    index={index}
                    className='rounded-lg hover:scale-105 transition-all ease-in-out duration-300 shadow-xl hover:shadow-2xl'
                    style={{width: '15%', height: 'auto'}}>                    
                </img>
            ))}
        </div>
    </div>
  )
}

export default CategoryCard