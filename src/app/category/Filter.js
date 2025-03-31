"use client"
import React, { useEffect, useState } from 'react'
import '../styles.css'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '../../components/ui/separator'
import axios from 'axios'
import { useRouter } from 'next/navigation'



const Filter = () => {

    const discountOptions = [
        { id: "fiftyPercent", label: "50% and more off" },
        { id: "thirtyPercent", label: "30% and more off" },
    ];

    const router = useRouter();

    const [showAll, setShowAll] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDiscounts, setSelectedDiscounts] = useState({
        fiftyPercent: false,
        thirtyPercent: false,
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const encodedCategory = encodeURIComponent("Fruits and Vegetables");
                const response = await axios.get(
                    `https://pothys-backend.onrender.com/api/products/category/${encodedCategory}`,
                    {
                        withCredentials: true,
                    }
                );
                setProducts(response.data);
                console.log('respone data: ', response.data);
                console.log('respone data brand: ', response.data.brand);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleDiscountChange = (discountType) => {
        setSelectedDiscounts((prev) => ({
            ...prev,
            [discountType]: !prev[discountType],
        }));
    };

    const filteredProducts = products.filter(product => {
        const meetsFiftyPercent = selectedDiscounts.fiftyPercent ? product.discount >= 50 : true;
        const meetsThirtyPercent = selectedDiscounts.thirtyPercent ? product.discount >= 30 : true;

        return meetsFiftyPercent && meetsThirtyPercent;
    });

    useEffect(() => {
        console.log("Filtered Products: ", filteredProducts);
    }, [filteredProducts])


    const categories = [
        { name: "Fruits and Vegetables", route: "/category/fv" },
        { name: "Beverages", route: "/category/beverages" },
        { name: "Daily Staples", route: "/category/ds" },
        { name: "Cleaning and Household", route: "/category/ch" },
        { name: "Beauty and Hygiene", route: "/category/bh" },
        { name: "Home and Kitchen", route: "/category/hk" },
        { name: "Oil and Masala", route: "/category/fom" },
        { name: "Eggs and Meat", route: "/category/emf" },
        { name: "Bakery and Dairy", route: "/category/bcd" },
        { name: "Snacks", route: "/category/snacks" },
    ]

    const uniqueBrands = [...new Set(products.map(product => product.brand))];
    const visibleBrands = (uniqueBrands.length > 5 && showAll) ? uniqueBrands : uniqueBrands.slice(0, 5);


    return (
        <>
            <div className='hidden md:flex md:flex-col gap-5'>
                <div className='bg-white px-10 py-5 rounded-lg card-sdw'>
                    <p className='text3 text-2xl mb-2'>Categories</p>
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            className='block relative w-fit'
                            onClick={() => (router.push(category.route))}>

                            <p className='text0 text-base text-gray-600 mt-2 cursor-pointer group'>
                                {category.name}
                                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                            </p>

                        </button>
                    ))}
                </div>

                <div className='bg-white px-10 py-5 rounded-lg card-sdw'>
                    <div className='flex flex-col gap-2'>
                        <p className='text3 text-2xl mb-2'>Filters</p>

                        {/* Availability */}
                        <div className='flex flex-col mb-2'>
                            <p className='text1 text-lg mb-2 text-gray-800'>Availability</p>
                            <div className='flex flex-row items-center text0 space-x-2 ml-4'>
                                <Checkbox
                                    id="out-of-stock"
                                />
                                <label
                                    htmlFor="out-of-stock"
                                    className="text-gray-600 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Out of stock
                                </label>
                            </div>
                        </div>

                        <Separator className='my-1' />

                        {/* Brands */}
                        <div className='flex flex-col'>
                            <p className='text1 text-lg text-gray-800'>Brands</p>

                            {visibleBrands.map((brand, index) => (
                                <div key={brand} className='flex flex-row items-center text0 space-x-2 ml-4 mt-2'>
                                    <Checkbox id={`brand-${index}`} />
                                    <label
                                        htmlFor={`brand-${index}`}
                                        className="text-gray-600 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {brand}
                                    </label>
                                </div>
                            ))}

                            {/* Show More / Show Less Button */}
                            {visibleBrands.length > 5 && (
                                <div className='flex items-center justify-center'>
                                    <button
                                        className="text3 text-blue-600 text-sm mt-2"
                                        onClick={() => setShowAll(!showAll)}
                                    >
                                        {showAll ? "Show Less" : "Show More"}
                                    </button>
                                </div>
                            )}
                        </div>

                        <Separator className='my-2' />

                        {/* Discount */}
                        <div className='flex flex-col mb-2'>
                            <p className='text1 text-lg text-gray-800'>Discount</p>
                            {discountOptions.map((option) => (
                                <div key={option.id} className='flex flex-row items-center text0 space-x-2 ml-4 mt-2'>
                                    <Checkbox
                                        id={option.id}
                                        checked={selectedDiscounts[option.id]}
                                        onCheckedChange={() => handleDiscountChange(option.id)}
                                    />
                                    <label htmlFor={option.id} className="text-gray-600 text-sm leading-none">
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}

export default Filter