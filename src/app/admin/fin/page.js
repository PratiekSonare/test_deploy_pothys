"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

const FinanceDashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [dailyData, setDailyData] = useState([]);
    const [showRevenue, setShowRevenue] = useState(true); // State to toggle between revenue and transaction count

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/transactions");
                setTransactions(response.data);
                
                // Calculate total revenue
                const revenue = response.data.reduce((total, txn) => total + txn.totalAmount, 0);
                setTotalRevenue(revenue);

                // Prepare daily data for the graph
                const dailyRevenue = {};
                response.data.forEach(txn => {
                    const date = new Date(txn.createdAt).toLocaleDateString();
                    if (!dailyRevenue[date]) {
                        dailyRevenue[date] = { total: 0, count: 0 };
                    }
                    dailyRevenue[date].total += txn.totalAmount;
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

        fetchTransactions();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Finance Dashboard</h1>
            <h2 className="text-xl mb-4">Total Revenue: ${totalRevenue.toFixed(2)}</h2>

            {/* Button to toggle between revenue and transaction count */}
            <div className="mb-4">
                <Button onClick={() => setShowRevenue(true)} className={`mr-2 ${showRevenue ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    Show Revenue
                </Button>
                <Button onClick={() => setShowRevenue(false)} className={`mr-2 ${!showRevenue ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    Show Transactions
                </Button>
            </div>

            {/* Revenue or Transaction Count Chart */}
            <h2 className="text-xl mb-2">{showRevenue ? 'Daily Revenue' : 'Number of Transactions'}</h2>
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

            {/* Transactions Table */}
            <Table className="min-w-full border-collapse border border-gray-300 mb-4">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Transaction ID</th>
                        <th className="border border-gray-300 p-2">Total Amount</th>
                        <th className="border border-gray-300 p-2">Payment Method</th>
                        <th className="border border-gray-300 p-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((txn) => (
                        <tr key={txn.transactionId}>
                            <td className="border border-gray-300 p-2">{txn.transactionId}</td>
                            <td className="border border-gray-300 p-2">${txn.totalAmount.toFixed(2)}</td>
                            <td className="border border-gray-300 p-2">{txn.paymentMethod}</td>
                            <td className="border border-gray-300 p-2">{new Date(txn.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default FinanceDashboard;