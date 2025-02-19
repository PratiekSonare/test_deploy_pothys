import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

export default function AdminDashboard() {
    const { register, handleSubmit, reset } = useForm();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
    };

    const onSubmit = async (data) => {
        await axios.post('http://localhost:5000/api/products', data);
        fetchProducts();
        reset();
    };

    const deleteProduct = async (id) => {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        fetchProducts();
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            
            {/* Add Product Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
                <input {...register("name")} placeholder="Product Name" required className="border p-2" />
                <input {...register("price")} type="number" placeholder="Price" required className="border p-2" />
                <input {...register("quantity")} type="number" placeholder="Quantity" required className="border p-2" />
                <input {...register("category")} placeholder="Category" required className="border p-2" />
                <button type="submit" className="bg-blue-500 text-white p-2">Add Product</button>
            </form>

            {/* Product List */}
            <table className="w-full border">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>{product.category}</td>
                            <td>
                                <button onClick={() => deleteProduct(product._id)} className="bg-red-500 text-white p-2">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
