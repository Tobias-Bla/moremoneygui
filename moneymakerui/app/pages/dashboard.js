"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";

export default function HomePage() {
  const { data: session } = useSession();

  // Fetch stock data from your API
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get("/api/stock-prices");
        setStockData(response.data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">MoneyMaker</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <a href="#" className="block p-2 hover:bg-gray-700 rounded">Home</a>
            </li>
            <li className="mb-2">
              <a href="#" className="block p-2 hover:bg-gray-700 rounded">Dashboard</a>
            </li>
            <li>
              <button
                onClick={() => signOut()}
                className="block w-full text-left p-2 hover:bg-gray-700 rounded"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center">
            <span className="mr-2">Welcome, {session?.user?.name}</span>
            <img
              src={session?.user?.image}
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </header>

        {/* Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Superset Chart 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Stock Price Chart 1</h2>
            <iframe
              src="http://localhost:8088/superset/dashboard/1/" // Replace with your Superset dashboard URL
              width="100%"
              height="400"
              frameBorder="0"
            ></iframe>
          </div>

          {/* Superset Chart 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Stock Price Chart 2</h2>
            <iframe
              src="http://localhost:8088/superset/dashboard/2/" // Replace with your Superset dashboard URL
              width="100%"
              height="400"
              frameBorder="0"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}