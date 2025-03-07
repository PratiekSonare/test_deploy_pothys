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
  return (
    <div className="flex flex-col bg-transparent rounded-lg py-5">
        <span className="text-[30px] items-start text3">Fruits and Veggies</span>
        <div className="mb-5 mt-2 flex flex-row gap-10">
            {images.map((image, index) => (
                <img
                    src={image.src}
                    alt={image.alt}
                    index={index}
                    className='rounded-lg hover:scale-105 transition-all ease-in-out duration-300 shadow-xl hover:shadow-2xl'
                    style={{width: '22%', height: 'auto'}}>
                </img>
            ))}
        </div>
    </div>
  )
}

export default CategoryCard