"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

interface Stock {
  symbol: string;
  quantity: number;
  price?: number; // Price is optional, may not be provided.
  timestamp: string;
}

const stockSymbols = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"];

export default function PortfolioPage() {
  const { data: session } = useSession();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch user-specific stocks on page load
  useEffect(() => {
    if (session?.user?.email) {
      setLoading(true);
      axios
        .get("/api/portfolio", { withCredentials: true })
        .then((res) => {
          console.log("✅ Fetched Stocks:", res.data);
          setStocks(res.data);
        })
        .catch((error) => {
          console.error("Error fetching user portfolio:", error);
          setErrorMessage("Failed to load portfolio");
        })
        .finally(() => setLoading(false));
    }
  }, [session]);

  // Add stock to portfolio
  const addStock = async () => {
    if (!selectedSymbol || !quantity) {
      alert("Please select a stock and enter a valid quantity.");
      return;
    }

    try {
      const res = await axios.post(
        "/api/portfolio",
        {
          symbol: selectedSymbol,
          quantity: Number(quantity),
        },
        { withCredentials: true }
      );

      if (!res.data || !res.data.symbol || !res.data.quantity) {
        throw new Error("Invalid API response structure");
      }

      // Update UI: If stock exists, update it; otherwise, add a new one.
      setStocks((prev) => {
        const idx = prev.findIndex((s) => s.symbol === res.data.symbol);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = res.data;
          return updated;
        }
        return [...prev, res.data];
      });
      setSelectedSymbol("");
      setQuantity("");
    } catch (error) {
      console.error("❌ Error adding stock:", error);
      setErrorMessage("Failed to add stock");
    }
  };

  // Remove stock from portfolio
  const removeStock = async (symbol: string) => {
    try {
      await axios.delete("/api/portfolio", {
        data: { symbol },
        withCredentials: true,
      });
      setStocks((prev) => prev.filter((s) => s.symbol !== symbol));
    } catch (error) {
      console.error("❌ Error removing stock:", error);
      setErrorMessage("Failed to remove stock");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-900">
          My Portfolio
        </h1>

        {/* Stock Selection */}
        <div className="flex flex-col gap-2 mt-4">
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="p-2 bg-gray-200 text-gray-900 rounded"
          >
            <option value="">Select Stock</option>
            {stockSymbols.map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter Quantity"
            className="p-2 bg-gray-200 text-gray-900 rounded"
          />
          <button
            onClick={addStock}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Add to Portfolio
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

        {/* Loading Indicator */}
        {loading && <p className="text-gray-900 mt-4">Loading portfolio...</p>}

        {/* Portfolio Overview */}
        <ul className="space-y-3 mt-4">
          {stocks.length > 0 ? (
            stocks.map((stock) => (
              <li
                key={stock.symbol}
                className="flex justify-between items-center p-4 bg-white rounded shadow"
              >
                <div>
                  <p className="text-gray-900 font-medium">
                    {stock.symbol} ({stock.quantity} shares)
                  </p>
                  <p className="text-gray-600 text-sm">
                    Price: $
                    {stock.price !== undefined
                      ? stock.price.toFixed(2)
                      : "N/A"}{" "}
                    | Updated: {new Date(stock.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => removeStock(stock.symbol)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
                >
                  Remove
                </button>
              </li>
            ))
          ) : (
            !loading && (
              <p className="text-gray-600 text-center mt-4">
                No stocks added yet.
              </p>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
