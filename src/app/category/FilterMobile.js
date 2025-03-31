"use client"
import React, { useEffect, useState } from 'react'
import '../styles.css'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '../../components/ui/separator'
import axios from 'axios'
import { useRouter } from 'next/navigation'



const FilterMobile = () => {

    const discountOptions = [
        { id: "fiftyPercent", label: "50% and more off" },
        { id: "thirtyPercent", label: "30% and more off" },
        { id: "dealOfTheWeek", label: "Deal of the Week" },
    ];

    const router = useRouter();
    const [showAll, setShowAll] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDiscounts, setSelectedDiscounts] = useState({
        fiftyPercent: false,
        thirtyPercent: false,
        dealOfTheWeek: false,
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
        const meetsDealOfTheWeek = selectedDiscounts.dealOfTheWeek ? product.dow === true : true;

        return meetsFiftyPercent && meetsThirtyPercent && meetsDealOfTheWeek;
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

    const [toggle, setToggle] = useState(false);
    const handleToggle = () => {
        (
            setToggle(prevToggle => !prevToggle)
        )
    }

    return (
        <div className="flex md:hidden w-screen relative">
            {/* Toggle Button */}
            <div className='z-100'>
                <button
                    onClick={() => setToggle(!toggle)}
                    className="text0 flex p-2 rounded-lg h-[40px] bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 ease-in-out"
                >
                    {toggle ? "Hide Filters" : "Show Filters"}
                </button>
            </div>

            {/* Sliding Filter Panel */}
            <div
                className={`z-50 absolute top-10 left-0 w-screen h-full transform transition-transform duration-500 ease-in-out ${
                    toggle ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col gap-5 p-5">

                    {/* Categories */}
                    <div className="bg-white p-5 rounded-lg shadow-md">

                        <div className='flex flex-row justify-between items-center'>
                            <p className="text3 text-2xl mb-2">Categories</p>
                            <button
                                onClick={() => setToggle(false)}
                                className="scale-125 text-gray-600 hover:text-black transition duration-200"
                            >
                                ✖
                            </button>
                        </div>

                        {categories.map((category, index) => (
                            <button
                                key={index}
                                className="block relative w-fit"
                                onClick={() => router.push(category.route)}
                            >
                                <p className="text0 text-base text-gray-600 mt-2 cursor-pointer group">
                                    {category.name}
                                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white p-5 rounded-lg shadow-md">
                        <div className="flex flex-col gap-2">
                        <div className='flex flex-row justify-between items-center'>
                            <p className="text3 text-2xl mb-2">Filters</p>
                            <button
                                onClick={() => setToggle(false)}
                                className="scale-125 text-gray-600 hover:text-black transition duration-200"
                            >
                                ✖
                            </button>
                        </div>
                            {/* Availability */}
                            <div className="flex flex-col mb-2">
                                <p className="text1 text-lg mb-2 text-gray-800">Availability</p>
                                <div className="flex flex-row items-center text0 space-x-2 ml-4">
                                    <Checkbox id="out-of-stock" />
                                    <label
                                        htmlFor="out-of-stock"
                                        className="text-gray-600 text-sm leading-none"
                                    >
                                        Out of stock
                                    </label>
                                </div>
                            </div>

                            <Separator className="my-1" />

                            {/* Brands */}
                            <div className="flex flex-col">
                                <p className="text1 text-lg text-gray-800">Brands</p>
                                {visibleBrands.map((brand, index) => (
                                    <div key={brand} className="flex flex-row items-center text0 space-x-2 ml-4 mt-2">
                                        <Checkbox id={`brand-${index}`} />
                                        <label htmlFor={`brand-${index}`} className="text-gray-600 text-sm leading-none">
                                            {brand}
                                        </label>
                                    </div>
                                ))}

                                {uniqueBrands.length > 5 && (
                                    <button
                                        className="text-blue-600 text-sm mt-2"
                                        onClick={() => setShowAll(!showAll)}
                                    >
                                        {showAll ? "Show Less" : "Show More"}
                                    </button>
                                )}
                            </div>

                            <Separator className="my-2" />

                            {/* Discount */}
                            <div className="flex flex-col mb-2">
                                <p className="text1 text-lg text-gray-800">Discount</p>
                                {discountOptions.map((option) => (
                                    <div key={option.id} className="flex flex-row items-center text0 space-x-2 ml-4 mt-2">
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
            </div>
        </div>
    );
};

export default FilterMobile