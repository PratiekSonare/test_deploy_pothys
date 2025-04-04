"use client"
import React, { useEffect, useState, useRef } from 'react'
import QRCodeScanner from './QRCode'
import HeaderParent from '@/app/cart/HeaderParent'
import '../../styles.css'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useCart } from '@/app/cart/CartContext'
import { Separator } from '@/components/ui/separator'
import CartProducts from './CartProducts'
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'
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
import CartParent from './CartParent'
import SearchBarParent from './SearchBarParent'


const page = () => {
    const [qrResult, setQrResult] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { cartItems, addToCart, incrementQ, decrementQ, calculateTotal } = useCart();
    const [loading, setLoading] = useState(false);
    const [hsnInput, setHsnInput] = useState('');

    const router = useRouter();
    const total_amount = calculateTotal();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products`);
                const data = await response.json();
                const availabledata = data.filter(product => product.quantity > 0);
                setProducts(availabledata);
                setFilteredProducts(availabledata);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    // useEffect(() => {
    //     if (typeof window !== "undefined") { // Ensure it's client-side
    //       const adminToken = localStorage.getItem("adminToken");
    
    //       if (!adminToken) {
    //         console.log("No token found, redirecting...");
    //         router.push("/admin/admin-login");
    //       } else {
    //         setToken(adminToken);
    //         fetchTransactions(); // Fetch data only after token is set
    //       }
    //     }
    //   }, [router]); 

    const handleChange = (e) => {
        const value = e.target.value.toLowerCase().trim();
        setSearchTerm(value);

        const regex = /(\D+)?(\d+)?/; // Matches optional text followed by optional number
        const match = value.match(regex);
        const productName = match[1] ? match[1].trim() : '';
        const quantityValue = match[2] ? Number(match[2]) : null;

        const filtered = products.filter(product => {
            const nameMatch = productName
                ? product.name.toLowerCase().includes(productName) || product.brand.toLowerCase().includes(productName)
                : true; // If no name is provided, don't filter by name

            const quantityMatch = quantityValue !== null
                ? product.quantity === quantityValue || product.quantity.toString().includes(quantityValue)
                : true; // If no quantity is provided, don't filter by quantity

            return nameMatch && quantityMatch;
        });

        setFilteredProducts(filtered);
    };


    const form = useForm({
        defaultValues: {
            customer_name: "",
            phone: "",
            address: "",
        },
    });

    const handleTransactionSuccess = async (transactionData) => {
        // Assuming transactionData is the response from your transaction API
        const { transaction_id, date_time, payment_method, total_amount, cartItems, customer } = transactionData;

        // Call the function to generate the invoice
        generateInvoice(transaction_id, date_time, payment_method, total_amount, cartItems, customer);
    };

    const handleTransaction = async (data) => {
        console.log("Customer data:", data); // Debugging line
        console.log("Cart Items:", cartItems);
        console.log("Total Amount:", total_amount);

        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/transactions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cartItems,
                    total_amount,
                    payment_method: "UPI",
                    customer: data, // Pass the form data here
                    status: "success",
                    delivery_status: "pending"
                })
            });

            const result = await response.json();

            // Log the parsed result
            console.log("Response data:", result); // Log the response data

            if (result.success) {
                alert(`Transaction successful! Transaction ID: ${result.transaction_id}`);

                // Call handleTransactionSuccess with the transaction data
                handleTransactionSuccess({
                    transaction_id: result.transaction_id,
                    date_time: new Date(), // You can adjust this based on your backend response
                    payment_method: "UPI", // Assuming this is static for now
                    total_amount,
                    cartItems,
                    customer: data
                });

                // Open a new tab with the invoice URL, passing the transaction ID
                const invoiceUrl = `/invoice?transaction_id=${result.transaction_id}`; // Adjust the URL as needed
                window.open(invoiceUrl, '_blank'); // Open the invoice in a new tab

                router.push('/'); // Redirect to home
                clearCart();
            } else {
                alert(`Transaction failed. Reason: ${result.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Transaction failed: ', error);
            alert('An error occurred while processing the transaction.');
        } finally {
            setLoading(false);
        }
    };

    const handleHsnChange = (e) => {
        setHsnInput(e.target.value);
    };

    const handleHsnSearch = async () => {
        if (!hsnInput.trim()) {
            alert("Please enter an HSN number.");
            return;
        }
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products/hsn/${hsnInput}`);
            if (!response.ok) {
                throw new Error("Product not found");
            }
    
            const product = await response.json();
            console.log('Product with given HSN Number', product);

        // Ensure product is an object, not an array
        const selectedProduct = Array.isArray(product) ? product[0] : product;

        if (selectedProduct && selectedProduct.name) {
            addToCart({
                ...selectedProduct,
                quantityType: `${selectedProduct?.quantity} ${selectedProduct?.unit}`
            });

            // alert(`Added ${selectedProduct.name} to cart.`);
        } else {
                alert("No product found with this HSN number.");
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleScan = async (scannedValue) => {

        setHsnInput(scannedValue);
        // Fetch the product corresponding to the scanned HSN number
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/products/hsn/${scannedValue}`);
            if (!response.ok) {
                throw new Error("Failed to fetch product data.");
            }
            const product = await response.json();
    
            // Ensure product is an object, not an array
            const selectedProduct = Array.isArray(product) ? product[0] : product;


            if (selectedProduct && selectedProduct.name) {
                addToCart({
                    ...selectedProduct, // Assuming you want to add the first product found
                    quantityType: `${selectedProduct?.quantity} ${selectedProduct?.unit}`
                });
    
                // alert(`Added ${selectedProduct.name} to cart.`);
            } else {
                alert('No product found with this HSN number.');
            }
        } catch (error) {
            console.error("Error fetching product data:", error);
            alert(`Error fetching product data. Please try again. - ${error}`);
        }
    };

    return (
        <div className='overflow-x-hidden w-screen'>
            {/* header */}
            <div className='top-0 header-sdw w-full'>
                <HeaderParent />
            </div>

            <div className='my-10'></div>

            <div className='px-5'>

                <div className='grid grid-cols-1 md:grid-cols-2 md:gap-10'>
                    {/* barcode scanner */}
                    <div className='border-2 border-black rounded-lg p-10 text0'>
                        <div className='flex flex-col'>
                            <span className='text3 text-xl md:text-4xl'>Scan QR/Barcode</span>
                            <QRCodeScanner onScan={(value) => handleScan(value)} />
                            {/* {qrResult && <p>Scanned Result: {qrResult}</p>} */}
                        </div>
                    </div>

                    {/* manual addition of products */}
                    <div className='border-2 border-black rounded-lg p-10 text0'>
                        <span className='text3 text-xl md:text-4xl'>Add Products Manually</span>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-10'>
                            <div>
                                <span className='text-lg'>Search by HSN</span>
                                <div className='flex flex-row space-x-2'>
                                    <Input 
                                    type="HSN" 
                                    placeholder="HSN" 
                                    className='bg-white searchbar-sdw'
                                    value={hsnInput}
                                    onChange={handleHsnChange}
                                    />
                                    <Button
                                        type="submit"
                                        onClick={handleHsnSearch}
                                        className='flex flex-row justify-center items-center rounded-lg h-[40px] bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-[20s] ease-in-out'
                                    >
                                        Search
                                    </Button>
                                </div>

                            </div>

                            <SearchBarParent />
                        </div>
                    </div>
                    
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 md:gap-10 mt-10'>
                    {/* customer info */}
                    <div className='border-2 border-black rounded-lg p-10'>
                        <div className='flex flex-col'>
                            <span className='text3 text-xl md:text-4xl'>Customer Details</span>
                            <div className='space-y-5 text0 w-11/12 md:w-full md:block md:mt-10'>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleTransaction)} className='space-y-5 text0'>
                                        <FormField
                                            control={form.control}
                                            name="customer_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Customer Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Customer Name" required {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="Phone Number (+91)" required {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Address</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="403, Shanti Niketan, Puducherry - 400000" required {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div>
                                            <Button
                                                className='flex flex-row justify-center items-center rounded-lg h-[40px] bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-[20s] ease-in-out'
                                                type="submit"
                                                disabled={loading}
                                            >
                                                {loading ? 'Processing...' : 'Complete Transaction'}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        </div>
                    </div>

                    {/* added cart items */}
                    <div className='border-2 border-black rounded-lg md:p-10 p-5 text0'>
                        <span className='text3 text-xl md:text-4xl'>Cart Items</span>
                        <CartParent />
                    </div>
                </div>
            </div>

            <div className='my-10'></div>

        </div>
    )
}

export default page