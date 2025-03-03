"use client"
import { Separator } from '@/components/ui/separator';
import * as React from 'react';
import { useState, useEffect } from 'react';

const SearchBar = ({ onFocus, onBlur }) => {
  const [products, setProducts] = useState([]);  
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [showQuantity, setShowQuantity] = useState(Array(20).fill(false));
  const [quantities, setQuantities] = useState(Array(20).fill(1));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); 
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(value)
    );

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (index) => {
    setShowQuantity((prev) => {
      const newShowQuantity = [...prev];
      newShowQuantity[index] = true;
      return newShowQuantity;
    });
  };
  
  const incrementQ = (index) => {
    setQuantities((prev) => {
      const newQuantities = [...prev];
      newQuantities[index] += 1;
      return newQuantities;
    });
  };

  const decrementQ = (index) => {
    setQuantities((prev) => {
      const newQuantities = [...prev];
      if (newQuantities[index] > 1) {
        newQuantities[index] -= 1;
      } else {
        newQuantities[index] = 1;
        setShowQuantity((prev) => {
          const newShowQuantity = [...prev];
          newShowQuantity[index] = false;
          return newShowQuantity;
        });
      }
      return newQuantities;
    });
  };

  return (
    <div className='flex flex-col w-1/3 searchbar-container'>
      <div className='flex bg-white searchbar-sdw w-full h-10 rounded-lg p-3'>
        <div className='flex flex-row items-center gap-5 w-full'>
          <img src='/searchicon.svg' alt='search_icon' style={{ height: '24px', width: '24px' }} />
          <input
            placeholder='Search for products...'
            className='bg-transparent h-full w-full border-none text-lg text-black focus:outline-none'
            onChange={handleChange}
            value={searchTerm}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
      </div>

      {searchTerm && (
        <div className="filtered-results w-full bg-white mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
          <div className=''>
            <div className='bg-gray-300 p-1 text-black text-start text0'>
              <span className='ml-2'><span className='text-gray-700'>Showing results for</span> '{searchTerm}'</span>
            </div>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <React.Fragment key={product.id}>
                  <div className='flex flex-row items-center gap-4 hover:bg-gray-200 cursor-pointer px-3 py-2'>
                    <img 
                      src="https://images.unsplash.com/photo-1674296115670-8f0e92b1fddb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                      alt='product_image' 
                      style={{width: '15%', height: 'auto'}}
                      className='w-full h-full object-contain rounded-lg'    
                    />
                    <div className='flex flex-row items-center justify-between w-full text-md'>
                      <div>{product.name}</div>
                      <div>{product.quantity}</div>
                      <Separator orientation="vertical" />
                      <div>₹{product.price}</div>
                      <div className='text-green-500'>{product.discount}% off</div>
                      
                      {!showQuantity[index] && (
                        <button
                          onClick={() => handleAddToCart(index)}
                          className="text-center text-md w-1/5 h-[30px] rounded-lg bg-transparent border-2 border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 transition-colors duration-[20s] ease-in-out"
                        >
                          <span className="font-bold transition-colors duration-300 ease-in-out">Add</span>
                        </button>
                      )}

                      {showQuantity[index] && (
                        <div className='flex flex-row gap-1 text-lg justify-center items-center rounded-lg w-1/5 h-[30px] bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-[20s] ease-in-out'>
                          <button onClick={() => decrementQ(index)} className="w-1/3 h-full flex items-center justify-center">-</button>
                          <button className="w-1/3 h-full flex items-center justify-center">
                            <span className="font-bold">{quantities[index]}</span>
                          </button>
                          <button onClick={() => incrementQ(index)} className="w-1/3 h-full flex items-center justify-center">+</button>
                        </div>
                      )}

                    </div>
                  </div>
                  {index < filteredProducts.length - 1 && <Separator orientation ="horizontal" className="my-2" />}
                </React.Fragment>
              ))  
            ) : (
              <div className="p-2 text-gray-500">No products found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 