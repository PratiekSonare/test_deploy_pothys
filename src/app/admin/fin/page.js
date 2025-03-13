"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import '../../styles.css'

const FinanceDashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [dailyData, setDailyData] = useState([]);
    const [showRevenue, setShowRevenue] = useState(true);
    const [newTransaction, setNewTransaction] = useState({
        cartItems: [],
        total_amount: 0,
        payment_method: 'UPI',
        customer: {
            customer_name: '',
            phone: '',
            address: ''
        }
    });
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    
    // New state for search and filters
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('date_time'); // Default sort by date
    const [sortOrder, setSortOrder] = useState('desc'); // Default sort order
    const [dailyRevenue, setDailyRevenue] = useState({});

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/transactions");
            setTransactions(response.data.transactions);
            
            // Calculate total revenue
            const revenue = response.data.transactions.reduce((total, txn) => total + txn.total_amount, 0);
            setTotalRevenue(revenue);

            // Prepare daily data for the graph
            const dailyRevenue = {};
            response.data.transactions.forEach(txn => {
                const date = new Date(txn.date_time).toLocaleDateString();
                if (!dailyRevenue[date]) {
                    dailyRevenue[date] = { total: 0, count: 0 };
                }
                dailyRevenue[date].total += txn.total_amount;
                dailyRevenue[date].count += 1;
            });

            // Convert dailyRevenue object to array
            const dailyArray = Object.keys(dailyRevenue).map(date => ({
                date,
                total: dailyRevenue[date].total,
                count: dailyRevenue[date].count,
            }));

            setDailyData(dailyArray);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    // Function to handle sorting
    const handleSort = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
    };  

    // Filter and sort transactions based on search term and selected sort field
    const filteredTransactions = transactions
        .filter(txn => 
            txn.customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const aValue = sortField === 'date_time' ? new Date(a.date_time) : a[sortField];
            const bValue = sortField === 'date_time' ? new Date(b.date_time) : b[sortField];
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        });

        const currentDate = new Date().toLocaleDateString(); // Format the current date
        const todayRevenue = dailyRevenue[currentDate] ? dailyRevenue[currentDate].total : 0; // Get today's revenue or default to 0
        

    return (
        <div className="container mx-auto p-4">

            <div className='my-10'>
                <h1 className="text3 text-3xl font-bold mb-4">Finance Dashboard</h1>
                <h2 className="text1 text-xl">Total Revenue: <span className='text3'>₹{totalRevenue.toFixed(2)}</span></h2>
                <h2 className="text1 text-xl">Daily Revenue: <span className='text3'>₹{todayRevenue.toFixed(2)}</span></h2>
            </div>


            <div className='text0 bg-white shadow-lg p-5 rounded-lg my-10'>

                <div className='flex flex-row justify-between gap-2'>
                    {/* Revenue or Transaction Count Chart */}
                    <h2 className="text-xl text3 mb-2">{showRevenue ? 'Daily Revenue' : 'Number of Transactions'}</h2>
                    {/* Button to toggle between revenue and transaction count */}
                    <div className="mb-4">
                        <Button onClick={() => setShowRevenue(true)} className={`mr-2 ${showRevenue ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                            Show Revenue
                        </Button>
                        <Button onClick={() => setShowRevenue(false)} className={`mr-2 ${!showRevenue ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                            Show Transactions
                        </Button>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {showRevenue ? (
                            <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
                        ) : (
                            <Line type="monotone" dataKey="count" stroke="#82ca9d" activeDot={{ r: 8 }} />
                        )}
                    </LineChart>
                </ResponsiveContainer>

            </div>

            <div className=''>
                <h1 className='text2 text-2xl my-3'>Transactions</h1>

                {/* Search and Filter Section */}
                <div className="mb-4 flex flex-col items-start">
                    <span className='text0 text-lg text-gray-600'>Filter:</span>
                    <input
                        type="text"
                        placeholder="Search by Customer Name or Transaction ID"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text0 border p-2 mb-2 w-full text-base"
                    />
                </div>

                <span className='text0 text-lg text-gray-600'>Click on the header for ascending/descending order:</span>
                {/* Transactions Table */}
                <Table className="w-full border border-gray-300 rounded-lg">
                    <TableHeader className="bg-gray-200">
                    <TableRow className='text2 text-md'>
                        <TableHead className="p-2 border cursor-pointer" style={{ width: '150px' }} onClick={() => handleSort('transaction_id')}>
                            <div className='flex flex-row justify-between items-center'>
                                <span>Transaction ID</span>
                                {sortField === 'transaction_id' && (sortOrder === 'asc' ? (
                                    <img src='/asc-arrow.svg' style={{ width: '20px' }} alt='asc' />
                                ) : (
                                    <img src='/asc-arrow.svg' style={{ width: '20px', transform: 'rotate(180deg)' }} alt='desc' />
                                ))}
                            </div>
                        </TableHead>
                        <TableHead className="p-2 border cursor-pointer" style={{ width: '150px' }} onClick={() => handleSort('total_amount')}>
                            <div className='flex flex-row justify-between items-center'>
                                <span>Total Amount</span>
                                {sortField === 'total_amount' && (sortOrder === 'asc' ? (
                                    <img src='/asc-arrow.svg' style={{ width: '20px' }} alt='asc' />
                                ) : (
                                    <img src='/asc-arrow.svg' style={{ width: '20px', transform: 'rotate(180deg)' }} alt='desc' />
                                ))}
                            </div>
                        </TableHead>
                        <TableHead className="p-2 border cursor-pointer" style={{ width: '150px' }} onClick={() => handleSort('payment_method')}>
                            <div className='flex flex-row justify-between items-center'>
                                <span>Payment Method</span>
                                {sortField === 'payment_method' && (sortOrder === 'asc' ? (
                                    <img src='/asc-arrow.svg' style={{ width: '20px' }} alt='asc' />
                                ) : (
                                    <img src='/asc-arrow.svg' style={{ width: '20px', transform: 'rotate(180deg)' }} alt='desc' />
                                ))}
                            </div>
                        </TableHead>
                        <TableHead className="p-2 border cursor-pointer" style={{ width: '150px' }} onClick={() => handleSort('date_time')}>
                            <div className='flex flex-row justify-between items-center'>
                                <span>Date</span>
                                {sortField === 'date_time' && (sortOrder === 'asc' ? (
                                    <img src='/asc-arrow.svg' style={{ width: '20px' }} alt='asc' />
                                ) : (
                                    <img src='/asc-arrow.svg' style={{ width: '20px', transform: 'rotate(180deg)' }} alt='desc' />
                                ))}
                            </div>
                        </TableHead>
                        <TableHead className="p-2 border" style={{ width: '150px' }} >Customer Info</TableHead>
                        <TableHead className="p-2 border" style={{ width: '150px' }} >Cart Items</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTransactions.map((txn) => (
                            <TableRow key={txn.transaction_id}>
                                <TableCell className="border p-2">{txn.transaction_id}</TableCell>
                                <TableCell className="border p-2">₹ {txn.total_amount.toFixed(2)}</TableCell>
                                <TableCell className="border p-2">{txn.payment_method}</TableCell>
                                <TableCell className="border p-2">{new Date(txn.date_time).toLocaleString()}</TableCell>
                                <TableCell className="border p-2">
                                    <Dialog>
                                        <DialogTrigger>
                                            <span>View Customer Info</span>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Customer Information</DialogTitle>
                                                <DialogDescription>
                                                    <div className='flex flex-col'>
                                                        <span>Name: {txn.customer.customer_name}</span>
                                                        <span>Phone: {txn.customer.phone}</span>
                                                        <span>Address: {txn.customer.address}</span>
                                                    </div>
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                                <TableCell className="border p-2">
                                    <Dialog>
                                        <DialogTrigger>
                                            <span>View Cart Items</span>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Cart Items</DialogTitle>
                                                <DialogDescription>
                                                    <ul>
                                                        {txn.cartItems.map(item => (
                                                            <li key={item._id}>
                                                                {item.name} - {item.quantity} x ₹{item.price.toFixed(2)}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default FinanceDashboard;