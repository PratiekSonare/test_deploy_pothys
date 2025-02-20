"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import ConfirmationPopup from './ConfirmationPopup'; // Import the ConfirmationPopup component

export default function AdminDashboard() {
    const { register, handleSubmit, reset, watch } = useForm();
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showDealOfWeek, setShowDealOfWeek] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showPopup, setShowPopup] = useState(false); // State for confirmation popup
    const [actionType, setActionType] = useState(""); // To track the action type (add, update, delete)
    const [productIdToDelete, setProductIdToDelete] = useState(null); // To store the ID of the product to delete
    const [csvFile, setCsvFile] = useState(null); // State to store the uploaded CSV file
    const [showConfirmUpload, setShowConfirmUpload] = useState(false); // State to control the confirmation popup for CSV upload
    const [selectedProducts, setSelectedProducts] = useState([]); // State to track selected products for deletion
    const [filterOption, setFilterOption] = useState(""); // State for filter option

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/products");
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
            avail: data.avail === "true",
        };

        if (editingProduct) {
            // Directly call the update function without showing a popup
            await updateProductData(formattedData);
        } else {
            // If adding a new product, proceed directly
            await addProduct(formattedData);
        }
    };

    const addProduct = async (data) => {
        try {
            const response = await axios.post("http://localhost:5000/api/products", data);
            console.log("Response:", response.data);
            fetchProducts();
            reset();
            setEditingProduct(null);
        } catch (error) {
            console.error("Error adding product:", error.response?.data || error.message);
        }
    };

    const updateProductData = async (data) => {
        const updatedData = { ...editingProduct, ...data }; // Prepare updated data
        try {
            await axios.put('http://localhost:5000/api/products', updatedData); // Send updated data in the body
            console.log('PUT Request successful!');
            fetchProducts(); // Refresh the product list
            reset(); // Reset the form
            setEditingProduct(null); // Clear editing state
            setShowPopup(true); // Show confirmation popup if needed
        } catch (error) {
            console.error("Error updating product:", error.response ? error.response.data : error.message);
        }
    };

    const deleteProduct = async (id) => {
        setProductIdToDelete(id);
        setActionType("delete");
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        try {
            if (selectedProducts.length > 0) {
                // Send the array of selected product IDs to the server
                await axios.delete("http://localhost:5000/api/products", { data: selectedProducts });
                fetchProducts(); // Refresh the product list
                console.log("Products removed successfully!");
            } else {
                await axios.delete("http://localhost:5000/api/products", { data: { _id: productIdToDelete } });
                fetchProducts();
                console.log("Product removed successfully!");
            }
        } catch (error) {
            console.error("Error removing product:", error);
        }
        setShowPopup(false);
        setSelectedProducts([]); // Clear selected products after deletion
    };

    const updateProduct = (product) => {
        setEditingProduct(product);
        reset({
            name: product.name || "", 
            price: product.price || 0, 
            quantity: product.quantity || 0, 
            unit: product.unit || "kg", 
            discount: product.discount || 0, 
            discounted_price: product.discounted_price || 0, 
            rating: product.rating || 0, 
            quantity_ordered: product.quantity_ordered || 0, 
            barcode: product.barcode || "",
            imageURL: product.imageURL || "", 
            codenum: product.codenum || "", 
            category: product.category || "", 
            avail: product.avail !== undefined ? product.avail.toString() : "false", 
            dow: product.dow !== undefined ? product.dow.toString() : "false", 
        });
    };

    const handleCSVUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setCsvFile(file); // Store the uploaded file in state
        setShowConfirmUpload(true); // Show confirmation popup
    };

    const confirmCSVUpload = async () => {
        const formData = new FormData();
        formData.append("file", csvFile);

        try {
            const response = await axios.post("http://localhost:5000/api/products/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Products uploaded successfully:", response.data);
            fetchProducts(); // Refresh the product list
        } catch (error) {
            console.error("Error uploading CSV:", error);
        } finally {
            setShowConfirmUpload(false); // Close the confirmation popup
            setCsvFile(null); // Clear the uploaded file
        }
    };

    const price = watch("price");
    const discount = watch("discount");
    const discountedPrice = watch("discounted_price");

    const [calculatedDiscountedPrice, setCalculatedDiscountedPrice] = useState(0);
    const [calculatedDiscount, setCalculatedDiscount] = useState(0);
    
    useEffect(() => {
        if (price && discount) {
            const newDiscountedPrice = price - (price * (discount / 100));
            setCalculatedDiscountedPrice(newDiscountedPrice);
        }
    }, [price, discount]);
    
    useEffect(() => {
        if (discountedPrice && price) {
            const newDiscount = ((price - discountedPrice) / price) * 100;
            setCalculatedDiscount(newDiscount);
        }
    }, [discountedPrice, price]);

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

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
        setShowDealOfWeek(false);
        if (category) {
            setFilteredProducts(products.filter(product => product.category === category));
        } else {
            setFilteredProducts(products);
        }
    };

    const handleDealOfWeekFilter = () => {
        setShowDealOfWeek(!showDealOfWeek);
        setSelectedCategory("");
        if (!showDealOfWeek) {
            setFilteredProducts(products.filter(product => product.dow));
        } else {
            setFilteredProducts(products);
        }
    };

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleFilterChange = (event) => {
        const value = event.target.value;
        setFilterOption(value);
        if (value === "available") {
            setFilteredProducts(products.filter(product => product.avail));
        } else if (value === "outOfStock") {
            setFilteredProducts(products.filter(product => !product.avail));
        } else if (value === "dealOfTheDay") {
            setFilteredProducts(products.filter(product => product.dow));
        } else {
            setFilteredProducts(products); // Reset to all products
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="mb-6 bg-white p-6 rounded-lg shadow-md space-y-4 text-black">
                <h2 className="text-xl font-semibold text-gray-700">{editingProduct ? "Edit Product" : "Add Product"}</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-start justify-center flex-grow">
                        <span>Product Name</span>
                        <input {...register("name")} placeholder="Product Name" required className=" border p-2 rounded w-full" />
                    </div>                    

                    <div className="flex flex-col items-start justify-center flex-grow">
                        <span>Product Price</span>
                        <input {...register("price")} type="number" placeholder="Price" required className="border p-2 rounded w-full" />
                    </div>

                   <div className="flex space-x-2 ">
                        <div className="flex flex-col items-start justify-center flex-grow">
                            <span>Product Name</span>
                            <input {...register("quantity")} type="number" placeholder="Quantity" required className="flex flex-grow border p-2 rounded w-2/3" />
                        </div>
                        <div className="flex flex-col items-start justify-center flex-grow">
                            <span>Unit</span>
                            <select {...register("unit")} required className="flex flex-grow border p-2 rounded w-1/3">
                                <option value="kg">kg</option>
                                <option value="litre">litre</option>
                                <option value="unit">units</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4"> {/* Use gap for spacing between columns */}
                    <div className="flex flex-col">
                        <label className="mb-1">Product Name</label> {/* Use label for accessibility */}
                        <input 
                            {...register("discount")} 
                            type="number" 
                            placeholder="Discount (%)" 
                            className="border p-2 rounded w-full" 
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1">Product Rating</label> {/* Use label for accessibility */}
                        <input 
                            {...register("rating")} 
                            type="number" 
                            step="0.1" 
                            placeholder="Rating (1-5)" 
                            className="border p-2 rounded w-full" 
                        />
                    </div>
                </div>
                   <div className="flex flex-col items-start justify-center flex-grow">
                        <span>Quantity Ordered</span>   
                        <input {...register("quantity_ordered")} type="number" placeholder="Quantity Ordered" className="border p-2 rounded w-full" />
                    </div>
                    <div className="flex flex-col items-start justify-center flex-grow">
                        <span>Barcode</span>   
                        <input {...register("barcode")} type="text" placeholder="Barcode" className="border p-2 rounded w-full" />
                    </div>
                    <div className="flex flex-col items-start justify-center flex-grow">
                        <span>Code Number</span>   
                        <input {...register("codenum")} type="text" placeholder="Code Number" className="border p-2 rounded w-full" />
                    </div>

                    <div className="flex flex-col items-start justify-center flex-grow">
                        <span>Image URL</span>   
                        <input {...register("imageURL")} type="text" placeholder="Image URL" className="border p-2 rounded w-full" />
                    </div>

                    <div className="flex flex-row items-center space-x-5 w-full">
                        <div className="flex flex-col items-start justify-center flex-grow">
                            <span>Select Category</span>
                            <select {...register("category")} required className="border p-2 rounded w-full">
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>   
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col items-start justify"> 
                            <span>Deal of the Week</span>
                            <select {...register("dow")} required className="border p-2 rounded w-full">
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </select>
                        </div>
                        <div className="flex flex-col items-start justify-center flex-grow">
                            <span>Availability</span>
                            <select {...register("avail")} required className="border p-2 rounded w-full">
                                <option value="true">Available</option>
                                <option value="false">Out of Stock</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-center flex-grow">
                        <span>Upload Inventory CSV</span>
                        <input type="file" accept=".csv" placeholder="Upload Inventory" onChange={handleCSVUpload} className="border p-2 rounded w-full" />
                    </div>
                </div>

                <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700 transition">
                    {editingProduct ? "Update Product" : "Add Product"}
                </button>
            </form>

            {csvFile && (
                <div className="mb-4">
                    <button 
                        onClick={() => (true)} 
                        className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                    >
                        Confirm Upload
                    </button>
                </div>
            )}

            {showConfirmUpload && (
                <ConfirmationPopup
                    message="Are you sure you want to upload this CSV file?"
                    onConfirm={confirmCSVUpload}
                    onCancel={() => setShowConfirmUpload(false)}
                />
            )}


            <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Filter Products</h2>
                <div className="flex space-x-4 mb-4">
                    <select onChange={handleFilterChange} className="border p-2 rounded text-black">
                        <option value="">Select Filter</option>
                        <option value="available">Available Stock</option>
                        <option value="outOfStock">Out of Stock</option>
                        <option value="dealOfTheDay">Deal of the Week</option>
                    </select>
                    <button onClick={() => handleCategoryFilter("")} className={`border p-2 rounded ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}>
                        All Categories
                    </button>
                    {categories.map((category, index) => (
                        <button key={index} onClick={() => handleCategoryFilter(category)} className={`border p-2 rounded ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}>
                            {category}
                        </button>
                    ))}
                    <button onClick={handleDealOfWeekFilter} className={`border p-2 rounded ${showDealOfWeek ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}>
                        Deal of the Week
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-black">
                <div className="flex flex-row space-x-10 justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Product List</h2>
                    <div className="flex flex-row mb-4 space-x-10 text-black">
                        <div className="flex my-4 flex-grow">
                            <input 
                                type="text" 
                                placeholder="Search by Product Name" 
                                value={searchTerm} 
                                onChange={handleSearchChange} 
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <button 
                            onClick={confirmDelete} 
                            className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition my-4"
                            disabled={selectedProducts.length === 0}
                        >
                            Delete Selected Products
                        </button>
                    </div>         
                </div>    
                <div style={{ height: '500px', overflowY: 'auto' }}>
                    <table className="w-full border border-gray-300 rounded-lg">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2 border">
                                    <input 
                                        type="checkbox" 
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedProducts(products.map(product => product._id));
                                            } else {
                                                setSelectedProducts([]);
                                            }
                                        }} 
                                    />
                                </th>
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
                                <th className="p-2 border">Image URL</th>
                                <th className="p-2 border">DOW</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product, index) => (
                                <tr key={product._id} className={index % 2 === 0 ? "bg-[#dbdbdb]" : "bg-white"}>
                                    <td className="p-2 border">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedProducts.includes(product._id)} 
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedProducts([...selectedProducts, product._id]);
                                                } else {
                                                    setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                                                }
                                            }} 
                                        />
                                    </td>
                                    <td className="p-2 border">{product.name}</td>
                                    <td className="p-2 border">₹{product.price}</td>
                                    <td className="p-2 border">{product.quantity}</td>
                                    <td className="p-2 border">{product.unit}</td>
                                    <td className="p-2 border">{product.discount}%</td>
                                    <td className="p-2 border">₹{product.discounted_price}</td>
                                    <td className="p-2 border">{product.rating} ⭐</td>
                                    <td className="p-2 border">{product.quantity_ordered}</td>
                                    <td className="p-2 border">{product.barcode}</td>
                                    <td className="p-2 border">{product.avail ? "✅ Available" : " ❌ Out of Stock"}</td>
                                    <td className="p-2 border">{product.category}</td>
                                    <td className="p-2 border">{product.imageURL}</td>
                                    <td className="p-2 border">{product.dow ? "Yes" : "No"}</td>
                                    <td className="p-2 border">
                                        <div className="flex flex-col space-y-2">
                                            <button onClick={() => updateProduct(product)} className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition">
                                                Update/Edit
                                            </button>
                                            <button onClick={() => deleteProduct(product._id)} className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showPopup && (
                <ConfirmationPopup
                    message={actionType === "delete" ? "Are you sure you want to delete this product?" : "Are you sure you want to update this product?"}
                    onConfirm={actionType === "delete" ? confirmDelete : updateProductData}
                    onCancel={() => setShowPopup(false)}
                />
            )}
        </div>
    );
}