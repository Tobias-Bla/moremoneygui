"use client";

import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stockData, setStockData] = useState([]);

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
      {/* Main Content */}
      <div className="flex-1 p-6">
        

        {/* Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Superset Chart 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Stock Price Chart 1</h2>
            <iframe
              src="http://localhost:8088/superset/explore/p/1ZMv3XBNAar/" // Replace with your Superset dashboard URL
              width="100%"
              height="400"
              frameBorder="0"
            ></iframe>
          </div>

          {/* Superset Chart 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Stock Price Chart 2</h2>
            <iframe
              src="http://localhost:8088/superset/dashboard/12/" // Replace with your Superset dashboard URL
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
