"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";

interface Stock {
  symbol: string;
  isin: string;
  quantity: number;
  price?: number;
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

  const fetchPortfolio = async () => {
    if (!session?.user?.email) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await axios.get("/api/portfolio", { withCredentials: true });

      // Falls deine API { stocks: [...] } zurückgibt, hier anpassen:
      const data = Array.isArray(res.data) ? res.data : res.data.stocks;

      setStocks(data || []);
    } catch (error) {
      console.error("Error fetching user portfolio:", error);
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.error || "Failed to load portfolio"
        );
      } else {
        setErrorMessage("Failed to load portfolio");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email]);

  const addStock = async () => {
    if (!selectedSymbol || !quantity) {
      alert("Please select a stock and enter a valid quantity.");
      return;
    }

    try {
      setErrorMessage("");
      await axios.post(
        "/api/portfolio",
        {
          symbol: selectedSymbol,
          quantity: Number(quantity),
        },
        { withCredentials: true }
      );

      // Statt auf die Response-Struktur zu vertrauen, einfach neu laden:
      await fetchPortfolio();

      setSelectedSymbol("");
      setQuantity("");
    } catch (error) {
      console.error("Error adding stock:", error);
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.error || "Failed to add stock"
        );
      } else {
        setErrorMessage("Failed to add stock");
      }
    }
  };

  const removeStock = async (symbol: string) => {
    try {
      setErrorMessage("");
      await axios.delete("/api/portfolio", {
        data: { symbol },
        withCredentials: true,
      });

      // Entweder lokal updaten...
      setStocks((prev) => prev.filter((s) => s.symbol !== symbol));
      // ...oder sauber:
      // await fetchPortfolio();
    } catch (error) {
      console.error("Error removing stock:", error);
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.error || "Failed to remove stock"
        );
      } else {
        setErrorMessage("Failed to remove stock");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6">
      <div className="w-full max-w-2xl bg-card text-card-foreground p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center mb-6">
          My Portfolio
        </h1>

        <div className="flex flex-col gap-2 mt-4">
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="p-2 bg-input text-foreground rounded"
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
            className="p-2 bg-input text-foreground rounded"
          />
          <button
            onClick={addStock}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Add to Portfolio
          </button>
        </div>

        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        {loading && (
          <p className="text-muted-foreground mt-4">
            Loading portfolio...
          </p>
        )}

        <ul className="space-y-3 mt-4">
          {stocks.length > 0 ? (
            stocks.map((stock) => (
              <li
                key={stock.symbol}
                className="flex justify-between items-center p-4 bg-card text-card-foreground rounded shadow"
              >
                <div>
                  <p className="font-medium">
                    {stock.symbol} ({stock.quantity} shares)
                  </p>
                  <p className="text-muted-foreground text-sm">
                    ISIN:{" "}
                    <Link
                      href={`/securities/${stock.isin}`}
                      className="underline hover:text-blue-600"
                    >
                      {stock.isin}
                    </Link>
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Price: $
                    {stock.price !== undefined
                      ? stock.price.toFixed(2)
                      : "N/A"}{" "}
                    | Updated:{" "}
                    {stock.timestamp
                      ? new Date(stock.timestamp).toLocaleString()
                      : "N/A"}
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
              <p className="text-muted-foreground text-center mt-4">
                No stocks added yet.
              </p>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
