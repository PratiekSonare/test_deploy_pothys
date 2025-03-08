import React from 'react'

const images = [
    {
        src:"/category_images/snacks/hp_sbf_m_biscuits-&-namkeens_480_250923.webp",
        alt: "fv"
    },
    {
        src:"/category_images/snacks/hp_sbf_m_breakfast-cereals_480_250923.webp",
        alt: "fv"
    },
    {
        src:"/category_images/snacks/hp_sbf_m_pasta-sauces-&-more_480_270723.webp",
        alt: "fv"
    },
    {
        src:"/category_images/snacks/hp_sbf_m_sweet-cravings_480_250923.webp",
        alt: "fv"
    },
]
const CategoryCard = () => {
  return (
    <div className="flex flex-col bg-transparent rounded-lg py-5">
        <span className="text-[30px] items-start text3">Chai Time, Snacks and more...</span>
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