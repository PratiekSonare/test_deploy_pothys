"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import ConfirmationPopup from '../ConfirmationPopup'; // Import the ConfirmationPopup component
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    useFormField,
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
}
    from '@/components/ui/form';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"

import ShadcnCard from '../ShadcnCard';
import { useRouter } from "next/navigation";
import Header from "../../cart/Header";
import '../../styles.css'
import dotenv from 'dotenv'
dotenv.config();

export default function AdminDashboard() {

    const router = useRouter();
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
    const [multipleUpdate, setMultipleUpdate] = useState(false); // State for bulk discount
    const [token, setToken] = useState(null);
    //date and time
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") { // Ensure it's client-side
            const adminToken = localStorage.getItem("adminToken");

            if (!adminToken) {
                console.log("No token found, redirecting...");
                router.push("/admin/admin-login");
            } else {
                // console.log("Token found:", adminToken); 
                setToken(adminToken);
                fetchProducts(); // Fetch data only after token is set
            }
        }
    }, [router]); // Run once when the component mounts

    const fetchProducts = async () => {
        const adminToken = localStorage.getItem("adminToken");

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`, // Include the token in the Authorization header
                },
            });
            // console.log('Token: ', adminToken);
            console.log('fetched producst successfully.')
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
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
        const adminToken = localStorage.getItem("adminToken");

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products`, data, {
                headers: {
                    Authorization: `Bearer ${adminToken}`, // Include the token in the Authorization header
                },
            });
            console.log("Response:", response.data);
            fetchProducts();
            reset();
            setEditingProduct(null);
        } catch (error) {
            console.error("Error adding product:", error.response?.data || error.message);
        }
    };

    const updateProductData = async (data) => {
        const adminToken = localStorage.getItem("adminToken");

        // Ensure the _id is included in the updated data
        const updatedData = { ...editingProduct, ...data, _id: editingProduct._id }; // Prepare updated data
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products`, updatedData, {
                headers: {
                    Authorization: `Bearer ${adminToken}`, // Include the token in the Authorization header
                },
            });
            console.log('PUT Request successful!', response.data);
            fetchProducts(); // Refresh the product list
            reset(); // Reset the form to default values
            setEditingProduct(null); // Clear editing state
            setShowPopup(true); // Show confirmation popup
        } catch (error) {
            console.error("Error updating product:", error.response ? error.response.data : error.message);
            alert("Failed to update product. Please try again.");
        }
    };

    const updateProduct = (product) => {
        console.log("Editing Product:", product); // Debugging line
        setEditingProduct(product);
        reset({
            hsn: product.hsn,
            brand: product.brand,
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            discount: product.discount,
            unit: product.unit,
            product_feature: product.product_feature,
            product_tags: product.product_tags,
            imageURL: product.imageURL,
            category: product.category,
            dow: product.dow.toString(),
            avail: product.avail.toString(),
        });
    };
    
    const multipleupdateProductData = () => {
        setMultipleUpdate(true)
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
                await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products`, { data: selectedProducts }, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    },
                });
                fetchProducts(); // Refresh the product list
                console.log("Products removed successfully!");
            } else {
                await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products`, { data: { _id: productIdToDelete } }, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    },
                });
                fetchProducts();
                console.log("Product removed successfully!");
            }
        } catch (error) {
            console.error("Error removing product:", error);
        }
        setShowPopup(false);
        setSelectedProducts([]); // Clear selected products after deletion
    };


    const handleCSVUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setCsvFile(file); // Store the uploaded file in state
        setShowConfirmUpload(true); // Show confirmation popup
    };

    const confirmCSVUpload = async () => {
        const adminToken = localStorage.getItem("adminToken");

        const formData = new FormData();
        formData.append("file", csvFile);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${adminToken}`, // Include the token in the Authorization header
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
            product.name.toLowerCase().includes(value.toLowerCase()) ||
            product.brand.toLowerCase().includes(value.toLowerCase())
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

    const form = useForm({
        defaultValues: {
            hsn: "",
            brand: "",
            name: "",
            price: "",
            discount: "",
            discounted_price: "",
            quantity: "",
            unit: "",
            product_feature: "",
            product_tags: "",
            imageURL: "",
            category: "",
            dow: "false", // default value for Deal of the Week
            avail: "true", // default value for Availability
            csv: null, // for file upload
        },
    });

    const watchForm = form.watch();
    const price = form.watch("price") || 0;
    const discount = form.watch("discount") || 0;
    const discountedPrice = price - (price * discount) / 100;

    useEffect(() => {
        const discountedPrice = price - (price * discount) / 100;
        form.setValue("discounted_price", discountedPrice.toFixed(2));
    }, [price, discount]);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const formattedTime = now.toLocaleTimeString(); // HH:MM:SS
            const formattedDate = now.toLocaleDateString(); // DD/MM/YYYY or MM/DD/YYYY based on locale

            setCurrentTime(`${formattedTime}`);
            setCurrentDate(`${formattedDate}`);
        };

        updateTime(); // Set initial value immediately
        const interval = setInterval(updateTime, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (

        <>
            <header className="top-0 header-sdw">
                <Header />
            </header>

            < div className="container mx-auto p-2" >
                <div className='flex flex-row justify-between items-center mt-10'>

                    <div className='flex flex-col'>
                        <span className='text-4xl text3'>Inventory Dashboard</span>
                        <div className='bg-blue-500 rounded-lg self-start'><span className="text2 text-2xl font-bold mb-5 text-gray-300 px-3 py-2">Admin Access</span></div>
                    </div>

                    <div className='flex flex-row items-start gap-5 mr-5'>
                        <div className='flex flex-col bg-green-500 px-5 py-2 rounded-lg'>
                            <span className='text-lg text0 self-end text-green-300'>Time</span>
                            <span className='text-2xl text2'>{currentTime}</span>
                        </div>
                        <div className='flex flex-col bg-green-500 px-5 py-2 rounded-lg'>
                            <span className='text-lg text0 self-end text-green-300'>Date</span>
                            <span className='text-2xl text2'>{currentDate}</span>
                        </div>
                    </div>

                </div>

                <div className="my-10"></div>

                <div className="grid grid-cols-[4fr_1fr] space-x-5">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)} 
                            className="mb-6 bg-white p-6 rounded-lg shadow-md space-y-4 text-black">
                            <h2 className="text-xl font-semibold text-gray-700">{editingProduct ? "Edit Product" : "Add Product"}</h2>

                            <div className="grid grid-cols-2 gap-4">

                                <FormField
                                    control={form.control}
                                    name="hsn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>HSN</FormLabel>
                                            <FormControl>
                                                <Input placeholder="HSN" required {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="brand"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Brand</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Product Brand" required {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Product Name" required {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Quantity" required {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-[4fr_2fr_4fr] space-x-5">

                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product Price</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="Price" required {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="discount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Discount (%)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="Discount (%)" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Discounted Price - Read-Only */}
                                    <FormItem>
                                        <FormLabel>Discounted Price</FormLabel>
                                        <FormControl>
                                            <Input type="number" value={discountedPrice.toFixed(2)} readOnly />
                                        </FormControl>
                                    </FormItem>

                                </div>

                                <FormField
                                    control={form.control}
                                    name="unit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Unit</FormLabel>
                                            <FormControl>
                                                <select {...field} required className="border p-2 rounded w-full">
                                                    <option value="kg">kg</option>
                                                    <option value="g">g</option>
                                                    <option value="ml">ml</option>
                                                    <option value="litre">L</option>
                                                    <option value="pcs">pcs</option>
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="product_feature"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Feature</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Product Feature" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="product_tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Tags</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Product Tags" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="imageURL"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image URL</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Image URL" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex flex-row items-center space-x-5 w-full">
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Select Category</FormLabel>
                                                <FormControl>
                                                    <select {...field} required className="border p-2 rounded w-full">
                                                        {categories.map((category, index) => (
                                                            <option key={index} value={category}>
                                                                {category}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="dow"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Deal of the Week</FormLabel>
                                                <FormControl>
                                                    <select {...field} required className="border p-2 rounded w-full">
                                                        <option value="true">True</option>
                                                        <option value="false">False</option>
                                                    </select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="avail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Availability</FormLabel>
                                                <FormControl>
                                                    <select {...field} required className="border p-2 rounded w-full">
                                                        <option value="true">Available</option>
                                                        <option value="false">Out of Stock</option>
                                                    </select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="csv"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Upload Inventory CSV</FormLabel>
                                            <FormControl>
                                                <Input type="file" accept=".csv" onChange={handleCSVUpload} className="border p-2 rounded w-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700 transition">
                                {editingProduct ? "Update Product" : "Add Product"}
                            </Button>
                        </form>
                    </Form>

                    <div className="p-5 bg-white rounded-lg shadow-md flex flex-col justify-center items-center">
                        <div className="">
                            <h1 className="mb-5 -mt-10 text-xl font-semibold text-gray-700">Product Card</h1>
                            <ShadcnCard product={watchForm} />
                            <div className="-mb-16"></div>
                        </div>
                    </div>
                </div>

                {
                    csvFile && (
                        <div className="mb-4">
                            <button
                                onClick={() => (true)}
                                className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                            >
                                Confirm Upload
                            </button>
                        </div>
                    )
                }

                {
                    showConfirmUpload && (
                        <ConfirmationPopup
                            message="Are you sure you want to upload this CSV file?"
                            onConfirm={confirmCSVUpload}
                            onCancel={() => setShowConfirmUpload(false)}
                        />
                    )
                }


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
                                    placeholder="Search by Product Name / Brand"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <Button
                                variant="outline"
                                onClick={confirmDelete}
                                className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition my-4"
                                disabled={selectedProducts.length === 0}
                            >
                                Delete Selected Products
                            </Button>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="my-4">
                                        <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 transition p-2 rounded text-white">
                                            Update Multiple Products
                                        </Button>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">Update Multiple Products</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Configure the settings for updating multiple products.
                                            </p>
                                        </div>
                                        <div className="grid gap-2">
                                            {/* Add your input fields or any other content here */}
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="discount">Discount (%)</Label>
                                                <Input
                                                    id="discount"
                                                    defaultValue="0"
                                                    className="col-span-2 h-8"
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="quantity">Quantity</Label>
                                                <Input
                                                    id="quantity"
                                                    defaultValue="1"
                                                    className="col-span-2 h-8"
                                                />
                                            </div>
                                            {/* Add more fields as needed */}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="" style={{ height: '500px', overflowY: 'auto' }}>
                        <Table className="w-full border border-gray-300 rounded-lg">
                            <TableHeader className="bg-gray-200">
                                <TableRow>
                                    <TableHead className="p-2 border">
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
                                    </TableHead>
                                    <TableHead className="p-2 border">ID</TableHead>
                                    <TableHead className="p-2 border">HSN</TableHead>
                                    <TableHead className="p-2 border">Brand</TableHead>
                                    <TableHead className="p-2 border">Name</TableHead>
                                    <TableHead className="p-2 border">Price</TableHead>
                                    <TableHead className="p-2 border">Quantity</TableHead>
                                    <TableHead className="p-2 border">Unit</TableHead>
                                    <TableHead className="p-2 border">Discount</TableHead>
                                    <TableHead className="p-2 border">Discounted Price</TableHead>
                                    <TableHead className="p-2 border">Product Feature</TableHead>
                                    <TableHead className="p-2 border">Product Tags</TableHead>
                                    <TableHead className="p-2 border">Availability</TableHead>
                                    <TableHead className="p-2 border">Category</TableHead>
                                    <TableHead className="p-2 border">Image URL</TableHead>
                                    <TableHead className="p-2 border">DOW</TableHead>
                                    <TableHead className="p-2 border">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product, index) => (
                                    <TableRow key={product._id} className={index % 2 === 0 ? "bg-white" : "bg-white"}>
                                        <TableCell className="p-2 border">
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
                                        </TableCell>
                                        <TableCell className="p-2 border">{product._id}</TableCell>
                                        <TableCell className="p-2 border">{product.hsn}</TableCell>
                                        <TableCell className="p-2 border">{product.brand}</TableCell>
                                        <TableCell className="p-2 border">{product.name}</TableCell>
                                        <TableCell className="p-2 border">₹{product.price}</TableCell>
                                        <TableCell className="p-2 border">{product.quantity}</TableCell>
                                        <TableCell className="p-2 border">{product.unit}</TableCell>
                                        <TableCell className="p-2 border">{product.discount}%</TableCell>
                                        <TableCell className="p-2 border">₹{product.discounted_price}</TableCell>
                                        <TableCell className="p-2 border">{product.product_feature}</TableCell>
                                        <TableCell className="p-2 border">{product.product_tags}</TableCell>
                                        <TableCell className="p-2 border">{product.avail ? "✅ Available" : " ❌ Out of Stock"}</TableCell>
                                        <TableCell className="p-2 border">{product.category}</TableCell>
                                        <TableCell className="p-2 border">{product.imageURL}</TableCell>
                                        <TableCell className="p-2 border">{product.dow ? "Yes" : "No"}</TableCell>
                                        <TableCell className="p-2 border">
                                            <div className="flex flex-col space-y-2">
                                                <button onClick={() => updateProduct(product)} className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition">
                                                    Update/Edit
                                                </button>
                                                <button onClick={() => deleteProduct(product._id)} className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition">
                                                    Delete
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {
                    showPopup && (
                        <ConfirmationPopup
                            message={actionType === "delete" ? "Are you sure you want to delete this product?" : "Are you sure you want to update this product?"}
                            onConfirm={actionType === "delete" ? confirmDelete : updateProductData}
                            onCancel={() => setShowPopup(false)}
                        />
                    )
                }



            </div >
        </>
    );
}