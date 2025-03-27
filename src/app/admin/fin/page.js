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
import Header from './Header';
import { useRouter } from 'next/navigation';

const FinanceDashboard = () => {

    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [monthlyRevenue, setMonthlyRevenue] = useState(0);
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
        },
        delivery_status: 'pending'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('date_time');
    const [sortOrder, setSortOrder] = useState('desc');
    const [dailyRevenue, setDailyRevenue] = useState({});
    const [timeFrame, setTimeFrame] = useState('daily'); // 'daily' or 'monthly'

    // New state for date filters
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    //token
    const [token, setToken] = useState(null);

    //pending transactions
    const [pendingTransactions, setPendingTransactions] = useState([]);

    const prepareData = (transactions) => {
        const revenueData = {};
    
        transactions.forEach(txn => {
            const date = new Date(txn.date_time);
            const key = timeFrame === 'monthly' ? 
                date.toLocaleString('default', { month: 'long', year: 'numeric' }) : 
                date.toLocaleDateString('en-GB'); // Use 'en-GB' for dd/mm/yyyy format
    
            if (!revenueData[key]) {
                revenueData[key] = { total: 0, count: 0 };
            }
            revenueData[key].total += txn.total_amount;
            revenueData[key].count += 1;
        });
    
        const preparedData = Object.keys(revenueData).map(key => ({
            date: key,
            total: revenueData[key].total,
            count: revenueData[key].count,
            dateObject: new Date(key.split('/').reverse().join('-')), // Convert dd/mm/yyyy to yyyy-mm-dd for correct parsing
        }));
    
        // Sort the data in ascending order
        preparedData.sort((a, b) => a.dateObject - b.dateObject);
    
        return preparedData;
    };

    useEffect(() => {
        if (typeof window !== "undefined") { // Ensure it's client-side
          const adminToken = localStorage.getItem("adminToken");
    
          if (!adminToken) {
            console.log("No token found, redirecting...");
            router.push("/admin/adminlogin");
          } else {
            console.log("Token found:", adminToken);
            setToken(adminToken);
            fetchTransactions(); // Fetch data only after token is set
          }
        }
      }, [router]); // Run once when the component mounts

    const fetchTransactions = async () => {

        const adminToken = localStorage.getItem("adminToken");

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/transactions`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`, // Include the token in the Authorization header
                },
            });
            console.log('Token: ', adminToken);
            console.log('fetched transactions successfully.')
            setTransactions(response.data.transactions);
            
            // Calculate total revenue
            const revenue = response.data.transactions.reduce((total, txn) => total + txn.total_amount, 0);
            setTotalRevenue(revenue);

            // Calculate monthly revenue
            const currentMonth = new Date().getMonth();
            const monthlyRevenue = response.data.transactions.reduce((total, txn) => {
                const txnDate = new Date(txn.date_time);
                return txnDate.getMonth() === currentMonth ? total + txn.total_amount : total;
            }, 0);
            setMonthlyRevenue(monthlyRevenue);

            // Prepare daily revenue data
            const dailyRevenue = {};
            response.data.transactions.forEach(txn => {
                const date = new Date(txn.date_time).toLocaleDateString();
                if (!dailyRevenue[date]) {
                    dailyRevenue[date] = { total: 0, count: 0 };
                }
                dailyRevenue[date].total += txn.total_amount;
                dailyRevenue[date].count += 1;
            });
            error
            // Set dailyRevenue state
            setDailyRevenue(dailyRevenue);

            // Convert dailyRevenue object to array
            const dailyArray = Object.keys(dailyRevenue).map(date => ({
                date,
                total: dailyRevenue[date].total,
                count: dailyRevenue[date].count,
            }));

            setDailyData(dailyArray);

        // Prepare revenue data based on the selected time frame
        const preparedData = prepareData(response.data.transactions);
        setDailyData(preparedData);

        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const fetchPendingDelivery = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/transactions?delivery_status=pending`,{ 
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }) 

            setPendingTransactions(response.data.transactions);
        } catch (error) {
            console.error('Error fetching pending transactions', error);
        }
    }

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
    };

    const filteredTransactions = transactions
        .filter(txn => {
            const txnDate = new Date(txn.date_time);
            const isWithinDateRange = (!startDate || txnDate >= new Date(startDate)) && (!endDate || txnDate <= new Date(endDate));
            return (
                (txn.customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                txn.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())) &&
                isWithinDateRange
            );
        })
        .sort((a, b) => {
            const aValue = sortField === 'date_time' ? new Date(a.date_time) : a[sortField];
            const bValue = sortField === 'date_time' ? new Date(b.date_time) : b[sortField];
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        });

    const currentDate = new Date().toLocaleDateString();
    const todayRevenue = dailyRevenue[currentDate] ? dailyRevenue[currentDate].total : 0;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <>
        
        <header className="top-0 header-sdw">
            <Header />
        </header>

        <div className="container mx-auto p-4">

            <div className='my-10'>
                <h1 className="text3 text-3xl font-bold mb-4">Finance Dashboard</h1>
                <div className='flex flex-row justify-around'>

                    <div className='flex flex-col gap-2 border-[1px] border-black p-5 rounded-lg'>
                        <h2 className="text1 text-xl text-gray-600">Total Revenue: </h2>
                        <span className='text3 text-2xl text-black'>{formatCurrency(totalRevenue)}</span>
                    </div>
                    <div className='flex flex-col gap-2 border-[1px] border-black p-5 rounded-lg'>
                        <h2 className="text1 text-xl text-gray-600">This Month's Revenue: </h2>
                        <span className='text3 text-2xl text-black'>{formatCurrency(monthlyRevenue)}</span>
                    </div>
                    <div className='flex flex-col gap-2 border-[1px] border-black p-5 rounded-lg'>
                        <h2 className="text1 text-xl text-gray-600">Today's Revenue: </h2>
                        <span className='text3 text-2xl text-black'>{formatCurrency(todayRevenue)}</span>
                    </div>
                </div>
            </div>


            <div className='text0 bg-white shadow-lg p-5 rounded-lg my-10'>

                <div className='flex flex-row justify-between gap-2'>
                    {/* Revenue or Transaction Count Chart */}
                    <h2 className="text-xl text3 mb-2">{showRevenue ? 'Daily Revenue' : 'Number of Transactions'}</h2>
                    {/* Button to toggle between revenue and transaction count */}
                    <div className='flex flex-row gap-2'>
                        <div className="mb-4">
                            <Button onClick={() => setShowRevenue(true)} className={`mr-2 ${showRevenue ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                                Show Revenue
                            </Button>
                            <Button onClick={() => setShowRevenue(false)} className={`mr-2 ${!showRevenue ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                                Show Transactions
                            </Button>
                        </div>
    
                        <div className="mb-4">
                            <Button onClick={() => { setTimeFrame('daily'); fetchTransactions(); }} className={`mr-2 ${timeFrame === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                                <span className='text-xs'>Daily</span>
                            </Button>
                            <Button onClick={() => { setTimeFrame('monthly'); fetchTransactions(); }} className={`mr-2 ${timeFrame === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                                <span className='text-xs'>Monthly</span>
                            </Button>
                        </div>
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
                <div className='flex flex-row gap-2 items-center justify-between my-5'>
                    <div className="flex flex-col items-start w-full">
                        <span className='text0 text-lg text-gray-600'>Filter:</span>
                        <input
                            type="text"
                            placeholder="Search by Customer Name or Transaction ID"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="text0 border p-2 w-full text-base"
                        />
                    </div>
    
                    <div className="flex flex-row gap-2">
                        <div className='flex flex-col'>
                            <span className='text0 text-lg text-gray-600'>Start Date</span>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border p-2"
                            />
                        </div>
                        <div className='flex flex-col'>
                            <span className='text0 text-lg text-gray-600'>End Date</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border p-2"
                            />
                        </div>
                    </div>
                </div>


                <span className='text0 text-lg text-gray-600'>Click on the header for sorting:</span>
                {/* Transactions Table */}
                <div className='h-1/3 overflow-y-scroll'>
                    <Table className="w-full border border-gray-300 bg-white rounded-lg">
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
                            <TableHead className="p-2 border cursor-pointer" style={{ width: '50px' }} onClick={() => handleSort('payment_method')}>
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
                            <TableHead className="p-2 border cursor-pointer" style={{ width: '100px' }} onClick={() => handleSort('date_time')}>
                                <div className='flex flex-row justify-between items-center'>
                                    <span>Customer Name</span>
                                </div>
                            </TableHead>
                            <TableHead className="p-2 border cursor-pointer" style={{ width: '150px' }} onClick={() => handleSort('date_time')}>
                                <div className='flex flex-row justify-between items-center'>
                                    <span>Delivery Address</span>
                                </div>
                            </TableHead>
                            <TableHead className="p-2 border" style={{ width: '10px' }} >Customer Info</TableHead>
                            <TableHead className="p-2 border" style={{ width: '10px' }} >Cart Items</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.map((txn) => (
                                <TableRow key={txn.transaction_id}>
                                    <TableCell className="border p-2">{txn.transaction_id}</TableCell>
                                    <TableCell className="border p-2">₹ {txn.total_amount.toFixed(2)}</TableCell>
                                    <TableCell className="border p-2">{txn.payment_method}</TableCell>
                                    <TableCell className="border p-2">{new Date(txn.date_time).toLocaleString()}</TableCell>
                                    <TableCell className="border p-2">{txn.customer.customer_name.toLocaleString()}</TableCell>
                                    <TableCell className="border p-2">{txn.customer.address.toLocaleString()}</TableCell>
                                    <TableCell className="border p-2">
                                        <Dialog>
                                            <DialogTrigger>
                                                <img src='/report.svg' style={{width: '25%'}} alt='report'></img>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Customer Information</DialogTitle>
                                                    <DialogDescription>
                                                        <li>Name: {txn.customer.customer_name}</li>
                                                        <li>Phone: {txn.customer.phone}</li>
                                                        <li>Address: {txn.customer.address}</li>
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                    <TableCell className="border p-2">
                                        <Dialog>
                                            <DialogTrigger>
                                                <img src='/shoppingcart.svg' style={{width: '60%'}} alt='report'></img>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Cart Items</DialogTitle>
                                                    <DialogDescription>
                                                            {txn.cartItems.map(item => (
                                                                <li key={item._id}>
                                                                    {item.name} - {item.quantity} x ₹{item.price.toFixed(2)}
                                                                </li>
                                                            ))}
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

                <div className='my-20'></div>

                <span className='text0 text-3xl'>Pending Deliveries</span>
                <div className='h-1/3 overflow-y-scroll'>
                    <Table className="w-full border border-gray-300 bg-white rounded-lg">
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
                            <TableHead className="p-2 border cursor-pointer" style={{ width: '50px' }} onClick={() => handleSort('payment_method')}>
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
                            <TableHead className="p-2 border cursor-pointer" style={{ width: '100px' }} onClick={() => handleSort('date_time')}>
                                <div className='flex flex-row justify-between items-center'>
                                    <span>Customer Name</span>
                                </div>
                            </TableHead>
                            <TableHead className="p-2 border cursor-pointer" style={{ width: '150px' }} onClick={() => handleSort('date_time')}>
                                <div className='flex flex-row justify-between items-center'>
                                    <span>Delivery Address</span>
                                </div>
                            </TableHead>
                            <TableHead className="p-2 border" style={{ width: '10px' }} >Customer Info</TableHead>
                            <TableHead className="p-2 border" style={{ width: '10px' }} >Cart Items</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingTransactions.map((txn) => (
                                <TableRow key={txn.transaction_id}>
                                    <TableCell className="border p-2">{txn.transaction_id}</TableCell>
                                    <TableCell className="border p-2">₹ {txn.total_amount.toFixed(2)}</TableCell>
                                    <TableCell className="border p-2">{txn.payment_method}</TableCell>
                                    <TableCell className="border p-2">{new Date(txn.date_time).toLocaleString()}</TableCell>
                                    <TableCell className="border p-2">{txn.customer.customer_name.toLocaleString()}</TableCell>
                                    <TableCell className="border p-2">{txn.customer.address.toLocaleString()}</TableCell>
                                    <TableCell className="border p-2">
                                        <Dialog>
                                            <DialogTrigger>
                                                <img src='/report.svg' style={{width: '25%'}} alt='report'></img>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Customer Information</DialogTitle>
                                                    <DialogDescription>
                                                        <li>Name: {txn.customer.customer_name}</li>
                                                        <li>Phone: {txn.customer.phone}</li>
                                                        <li>Address: {txn.customer.address}</li>
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                    <TableCell className="border p-2">
                                        <Dialog>
                                            <DialogTrigger>
                                                <img src='/shoppingcart.svg' style={{width: '60%'}} alt='report'></img>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Cart Items</DialogTitle>
                                                    <DialogDescription>
                                                            {txn.cartItems.map(item => (
                                                                <li key={item._id}>
                                                                    {item.name} - {item.quantity} x ₹{item.price.toFixed(2)}
                                                                </li>
                                                            ))}
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
        </div>
    </>
       
    );
};

export default FinanceDashboard;