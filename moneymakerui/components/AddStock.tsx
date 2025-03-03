"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Stock {
  symbol: string;
}

export default function AddStock() {
  const [symbol, setSymbol] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Stock[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Fetch stock suggestions while typing
  const fetchSuggestions = async (value: string) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get<Stock[]>(`/api/stock-suggestions?query=${value.toUpperCase()}`);
      setSuggestions(response.data || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  // Handle input change and fetch suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setSymbol(value);
    fetchSuggestions(value);
    setErrorMessage(""); // Clear previous errors
  };

  // Handle dropdown selection
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSymbol(e.target.value);
  };

  // Submit function
  const addStock = async () => {
    if (!symbol) return;
    try {
      await axios.post("/api/user-stocks", { symbol });
      setSymbol("");
      setSuggestions([]); // Clear suggestions
      setErrorMessage(""); // Clear errors
      alert("Stock added!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.error || "Error adding stock");
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Stock</h2>

      {/* Input field for typing */}
      <input
        type="text"
        placeholder="Enter stock symbol..."
        value={symbol}
        onChange={handleInputChange}
        className="border p-2 w-full rounded-md"
      />

      {/* Dropdown for suggestions */}
      {suggestions.length > 0 && (
        <select
          onChange={handleSelectChange}
          className="border p-2 w-full mt-2 rounded-md cursor-pointer"
        >
          <option value="">Select a stock</option>
          {suggestions.map((stock) => (
            <option key={stock.symbol} value={stock.symbol}>
              {stock.symbol}
            </option>
          ))}
        </select>
      )}

      {/* Error Message */}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      {/* Add Stock Button */}
      <button
        onClick={addStock}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
      >
        Add Stock
      </button>
    </div>
  );
}
