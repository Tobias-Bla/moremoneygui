"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Autosuggest from "react-autosuggest";

interface Stock {
  symbol: string;
  price: number;
  timestamp: string;
}

export default function StocksPage() {
  const { data: session } = useSession();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [symbol, setSymbol] = useState<string>("");
  const [suggestions, setSuggestions] = useState<{ symbol: string }[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Fetch user-specific stocks on page load
  useEffect(() => {
    if (session?.user?.email) {
      axios
        .get(`/api/user-stocks?email=${session.user.email}`)
        .then((res) => setStocks(res.data))
        .catch((error) => console.error("Error fetching user stocks:", error));
    }
  }, [session]);

  // Fetch stock suggestions while typing
  const fetchSuggestions = async (value: string) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get<{ symbol: string }[]>(
        `/api/stock-suggestions?query=${value.toUpperCase()}`
      );
      setSuggestions(response.data || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  // Handle input change with adjusted event type
  const onChange = (
    _event: React.FormEvent<HTMLElement>,
    { newValue }: { newValue: string }
  ) => {
    setSymbol(newValue.toUpperCase()); // Ensures uppercase
    setErrorMessage(""); // Clear errors
  };

  // Handle suggestions fetching
  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    fetchSuggestions(value);
  };

  // Clear suggestions when input is cleared
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  // Add stock
  const addStock = async () => {
    if (!symbol) return;

    try {
      const res = await axios.post("/api/user-stocks", { symbol });
      setStocks([...stocks, res.data]); // Update UI with the new stock
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

  // Remove stock
  const removeStock = async (symbol: string) => {
    await axios.delete("/api/user-stocks", {
      data: { symbol },
    });
    setStocks(stocks.filter((s) => s.symbol !== symbol));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center mb-6 text-white">
          My Stocks
        </h1>

        {/* Auto-complete Input Field */}
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={(suggestion) => suggestion.symbol}
          renderSuggestion={(suggestion) => (
            <div className="p-2 hover:bg-gray-700 cursor-pointer text-white">
              {suggestion.symbol}
            </div>
          )}
          inputProps={{
            placeholder: "Enter stock symbol...",
            value: symbol,
            onChange,
            className: "border p-2 w-full rounded-md bg-gray-700 text-white",
          }}
        />

        {/* Error Message */}
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

        {/* Add Stock Button */}
        <button
          onClick={addStock}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
        >
          Add Stock
        </button>

        {/* List of Added Stocks */}
        <ul className="space-y-3 mt-4">
          {stocks.length > 0 ? (
            stocks.map((stock) => (
              <li
                key={stock.symbol}
                className="flex justify-between items-center p-4 bg-gray-700 rounded shadow"
              >
                <div>
                  <p className="text-white font-medium">{stock.symbol}</p>
                  <p className="text-gray-400 text-sm">
                    Price: ${stock.price.toFixed(2)} | Updated:{" "}
                    {new Date(stock.timestamp).toLocaleString()}
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
            <p className="text-gray-400 text-center">No stocks added yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
