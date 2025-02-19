"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function AdminDashboard() {
    const { register, handleSubmit, reset } = useForm();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
    };

    const onSubmit = async (data) => {
        try {
            // Concatenate quantity and unit
            const formattedData = {
                ...data,
                avail: data.avail === "true", // Convert string to boolean
            };
            
            console.log("Submitting Data:", formattedData); // Debugging log
    
            // Send POST request
            const response = await axios.post("http://localhost:5000/api/products", formattedData);
            
            console.log("Response:", response.data); // Debugging log
            fetchProducts();
            reset();
        } catch (error) {
            console.error("Error adding product:", error.response?.data || error.message);
        }
    };
    

    const deleteProduct = async (id) => {
        try {
            await axios.delete("http://localhost:5000/api/products", { data: { _id: id } });
            fetchProducts();
            console.log("Product removed successfully!");
        } catch (error) {
            console.error("Error removing product:", error);
        }
    };
    
    // Categories List
    const categories = [
        "Fruits and Vegetables",
        "Beverages",
        "Daily Staples",
        "Cleaning and Household",
        "Beauty and Hygiene",
        "Home and Kitchen",
        "Foodgrains, Oil and Masala",
        "Eggs, Meat and Fish",
        "Bakery, Cakes and Dairy",
    ];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>

            {/* Add Product Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mb-6 bg-white p-6 rounded-lg shadow-md space-y-4 text-black">
                <h2 className="text-xl font-semibold text-gray-700">Add Product</h2>

                <div className="grid grid-cols-2 gap-4">
                    <input {...register("name")} placeholder="Product Name" required className="border p-2 rounded w-full" />
                    <input {...register("price")} type="number" placeholder="Price" required className="border p-2 rounded w-full" />
                    <div className="flex space-x-2">
                        <input {...register("quantity")} type="number" placeholder="Quantity" required className="border p-2 rounded w-2/3" />
                        <select {...register("unit")} required className="border p-2 rounded w-1/3">
                            <option value="kg">kg</option>
                            <option value="litre">litre</option>
                            <option value="unit">units</option>
                        </select>
                    </div>                    
                    <input {...register("discount")} type="number" placeholder="Discount (%)" className="border p-2 rounded w-full" />
                    <input {...register("discounted_price")} type="number" placeholder="Discounted Price" className="border p-2 rounded w-full" />
                    <input {...register("rating")} type="number" step="0.1" placeholder="Rating (1-5)" className="border p-2 rounded w-full" />
                    <input {...register("quantity_ordered")} type="number" placeholder="Quantity Ordered" className="border p-2 rounded w-full" />
                    <input {...register("barcode")} type="text" placeholder="Barcode" className="border p-2 rounded w-full" />
                    <input {...register("codenum")} type="text" placeholder="Code Number" className="border p-2 rounded w-full" />

                    {/* Category Dropdown */}
                    <select {...register("category")} required className="border p-2 rounded w-full">
                        <option value="">Select Category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    {/* Availability Dropdown */}
                    <select {...register("avail")} required className="border p-2 rounded w-full">
                        <option value="true">Available</option>
                        <option value="false">Out of Stock</option>
                    </select>
                </div>

                <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700 transition">
                    Add Product
                </button>
            </form>

            {/* Product List */}
            <div className="bg-white p-6 rounded-lg shadow-md text-black">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Product List</h2>

                <table className="w-full border border-gray-300 rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Price</th>
                            <th className="p-2 border">Quantity</th>
                            <th className="p-2 border">Unit</th>
                            <th className="p-2 border">Discount</th>
                            <th className="p-2 border">Discounted Price</th>
                            <th className="p-2 border">Rating</th>
                            <th className="p-2 border">Quantity Ordered</th>
                            <th className="p-2 border">Barcode</th>
                            <th className="p-2 border">Availability</th>
                            <th className="p-2 border">Category</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id} className="text-center">
                                <td className="p-2 border">{product.name}</td>
                                <td className="p-2 border">₹{product.price}</td>
                                <td className="p-2 border">{product.quantity}</td>
                                <td className="p-2 border">{product.unit}</td>
                                <td className="p-2 border">{product.discount}%</td>
                                <td className="p-2 border">₹{product.discounted_price}</td>
                                <td className="p-2 border">{product.rating} ⭐</td>
                                <td className="p-2 border">{product.quantity_ordered}</td>
                                <td className="p-2 border">{product.barcode}</td>
                                <td className="p-2 border">{product.avail ? "✅ Available" : "❌ Out of Stock"}</td>
                                <td className="p-2 border">{product.category}</td>
                                <td className="p-2 border">
                                    <button onClick={() => deleteProduct(product._id)} className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
