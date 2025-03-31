"use client"
import Header from '../Header'
import React, { useEffect, useState } from 'react'
import '../../styles.css'
import Footer from '@/app/footer/Footer'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '../../../components/ui/separator'
import { Slider } from '../../../components/ui/slider'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import HeaderParent from '../../header/HeaderParent'
import FooterParent from '../../footer/FooterParent'
import Filter from '../Filter'
import FilterParent from '../FilterParent'
import HKCards from './HKCards'


const discountOptions = [
    { id: "fiftyPercent", label: "50% and more off" },
    { id: "thirtyPercent", label: "30% and more off" },
    { id: "dealOfTheWeek", label: "Deal of the Week" },
  ];

const page = () => {
  
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
            const encodedCategory = encodeURIComponent("Home and Kitchen");
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products/category/${encodedCategory}`,
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

  const samplebrands = [
    "brand1",
    "brand2",
    "brand3",
    "brand4",
    "brand5",
    "brand6",
    "brand7",
    "brand8",
    "brand9",
    "brand0"
  ]

  const discounts = [
    "50% and more off",
    "30% and more off",
    "Deal of the Week"
  ]

    const uniqueBrands = [...new Set(products.map(product => product.brand))];
    const visibleBrands = (uniqueBrands.length > 5 && showAll) ? uniqueBrands : uniqueBrands.slice(0, 5);

  
  return (
    <div className='overflow-x-hidden w-screen'>
        <header className="top-0 header-sdw w-full">
            <HeaderParent />
        </header>
        
        <div className='my-5 md:my-20'></div>

        <div className='min-h-screen flex flex-col'>

            {/* Main Content */}
            <div className='flex-grow'>
                <div className='flex flex-col px-5 md:grid md:grid-cols-[1fr_4fr] md:px-20 md:space-x-10'>

                    {/* filter */}
                    <FilterParent />

                    {/* Product Cards Section */}
                    <div>
                        {loading ? (
                            <div className="flex justify-center items-center">
                                <div className="w-12 h-12 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <HKCards products={filteredProducts} />
                        )}
                    </div>
                </div>
            </div>

            <div className='my-20'></div>

            {/* Footer */}
            <footer className=''>
                <FooterParent />
            </footer>

        </div>
    </div>
  )
}

export default page