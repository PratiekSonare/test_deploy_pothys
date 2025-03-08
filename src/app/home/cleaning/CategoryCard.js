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
  return (
    <div className="flex flex-col bg-transparent rounded-lg py-5">
        <span className="text-[30px] items-start text3">Cleaning and Household</span>
        <div className="mb-5 mt-2 flex flex-row gap-10">
            {images.map((image, index) => (
                <img
                    src={image.src}
                    alt={image.alt}
                    key={index}
                    className='rounded-lg hover:scale-105 transition-all ease-in-out duration-300 shadow-xl hover:shadow-2xl'
                    style={{width: '22%', height: 'auto'}}>
                </img>
            ))}
        </div>
    </div>
  )
}

export default CategoryCard