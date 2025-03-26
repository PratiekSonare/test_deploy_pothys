"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Assuming you're using Next.js

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError(""); 

        try {
            const response = await axios.post(`${process.env.NEXT_BACKEND_LINK}/api/admin/login`, {
                username,
                password,
            });

            // Assuming the response contains the token directly
            localStorage.setItem("adminToken", response.data.token);
            setShowPopup(true);
            setTimeout(() => {
                router.push("/admin/inv");
            }, 2000);   
        } catch (err) {
            console.error("Login error:", err);
            // Display specific error message from the server
            setError(err.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96 text-black">
                <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 rounded w-full mb-4"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded w-full mb-4"
                    required
                />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700">
                    Login
                </button>
            </form>

            {/* Popup Notification */}
            {showPopup && (
                <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg transition-opacity duration-300">
                    Login successful! Redirecting...
                </div>
            )}
        </div>
    );
}