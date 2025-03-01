"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';

const CartPage = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const addToCart = (product) => {
        const existingProduct = cart.find(item => item._id === product._id);
        if (existingProduct) {
            setCart(cart.map(item => 
                item._id === product._id ? { ...existingProduct, quantity: existingProduct.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const updateCartQuantity = (productId, quantity) => {
        if (quantity < 1) return; // Prevent negative quantities
        setCart(cart.map(item => 
            item._id === productId ? { ...item, quantity } : item
        ));
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item._id !== productId));
    };

    const calculateTotalCost = () => {
        const total = cart.reduce((sum, item) => {
            return sum + (item.discounted_price || item.price) * item.quantity;
        }, 0);
        setTotalCost(total);
    };

    const handlePurchase = async (cartItems, paymentMethod) => {
        try {
            const response = await axios.post("http://localhost:5000/api/transactions", {
                products: cartItems.map(item => ({
                    productId: item._id,
                    quantity: item.quantity,
                    price: item.price,
                    discounted_price: item.discounted_price,
                })),
                paymentMethod,
            });
            console.log('Transaction successful:', response.data);
        } catch (error) {
            console.error('Error processing transaction:', error);
        }
    };

    const updateProductData = async (data) => {
        try {
            await axios.put('http://localhost:5000/api/products', data);
            console.log('PUT Request successful!');
        } catch (error) {
            console.error("Error updating product:", error.response ? error.response.data : error.message);
        }
    };
    
    const updateInventory = async (cartItems) => {
        try {
            await Promise.all(cartItems.map(item => {
                const updatedData = {
                    _id: item._id,
                    quantity: item.quantity - 1,
                };
                return updateProductData(updatedData);
            }));
        } catch (error) {
            console.error('Error updating inventory:', error);
        }
    };
    
    const submitPurchase = async () => {
        await handlePurchase(cart, 'credit_card');
        await updateInventory(cart);
        setCart([]);
        setTotalCost(0);
    };

    useEffect(() => {
        calculateTotalCost();
    }, [cart]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
            {/* Display all products */}
            <h2 className="text-xl font-bold mb-2">Available Products</h2>
            <Table className="min-w-full border-collapse border border-gray-300 mb-4">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">Product Name</th>
                        <th className="border border-gray-300 p-2">Price</th>
                        <th className="border border-gray-300 p-2">Add to Cart</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id} className="hover:bg-gray-100">
                            <td className="border border-gray-300 p-2">{product.name}</td>
                            <td className="border border-gray-300 p-2">${product.discounted_price || product.price}</td>
                            <td className="border border-gray-300 p-2">
                                <Button onClick={() => addToCart(product)}>Add to Cart</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Display cart items */}
            <h2 className="text-xl font-bold mb-2">Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <Table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2">Product Name</th>
                            <th className="border border-gray-300 p-2">Price</th>
                            <th className="border border-gray-300 p-2">Quantity</th>
                            <th className="border border-gray-300 p-2">Total</th>
                            <th className="border border-gray-300 p-2">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map(item => (
                            <tr key={item._id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 p-2">{item.name}</td>
                                <td className="border border-gray-300 p-2">${item.discounted_price || item.price}</td>
                                <td className="border border-gray-300 p-2">
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateCartQuantity(item._id, parseInt(e.target.value))}
                                        className="border border-gray-300 p-1 w-16"
                                    />
                                </td>
                                <td className="border border-gray-300 p-2">${((item.discounted_price || item.price) * item.quantity).toFixed(2)}</td>
                                <td className="border border-gray-300 p-2">
                                    <Button onClick={() => removeFromCart(item._id)}>Remove</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            <h2 className="text-xl font-bold mt-4">Total Cost: ${totalCost.toFixed(2)}</h2>
            <Button onClick={submitPurchase} disabled={cart.length === 0} className="mt-4">
                Complete Purchase
            </Button>
        </div>
    );
};

export default CartPage;