"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";

// Register Chart.js components
ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StockPrice {
  symbol: string;
  timestamp: string;
  price: string; // Prisma Decimal returns as string
}

// Define the available time spans
const timeSpanOptions = [
  { label: "All Time", value: "ALL" },
  { label: "Last 1 Day", value: "1D" },
  { label: "Last 1 Week", value: "1W" },
  { label: "Last 1 Month", value: "1M" },
  { label: "Last 3 Months", value: "3M" },
  { label: "Last 1 Year", value: "1Y" },
];

export default function StockDashboard() {
  const [stockPrices, setStockPrices] = useState<StockPrice[]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [timeSpan, setTimeSpan] = useState<string>("ALL");

  // Fetch stock prices on mount
  useEffect(() => {
    axios
      .get("/api/stock_prices")
      .then((res) => setStockPrices(res.data))
      .catch((error) =>
        console.error("Error fetching stock prices:", error)
      );
  }, []);

  // Group stock prices by symbol
  const groupedData = stockPrices.reduce((acc: { [key: string]: StockPrice[] }, curr) => {
    if (!acc[curr.symbol]) {
      acc[curr.symbol] = [];
    }
    acc[curr.symbol].push(curr);
    return acc;
  }, {});

  // On data load, initialize selectedSymbols with all symbols if none are selected
  useEffect(() => {
    const allSymbols = Object.keys(groupedData);
    if (selectedSymbols.length === 0 && allSymbols.length > 0) {
      setSelectedSymbols(allSymbols);
    }
  }, [groupedData]);

  // Toggle symbol selection
  const toggleSymbol = (symbol: string) => {
    setSelectedSymbols((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  // Calculate the starting date based on the selected time span
  function getStartDateForTimeSpan(span: string): Date {
    const now = new Date();
    switch (span) {
      case "1D":
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case "1W":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "1M":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case "3M":
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case "1Y":
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(0); // All time
    }
  }

  const startDate = getStartDateForTimeSpan(timeSpan);

  // Prepare datasets for the chart, filtering data points by the selected time span
  const datasets = selectedSymbols.map((symbol) => {
    const dataForSymbol =
      groupedData[symbol]?.filter((dp) => new Date(dp.timestamp) >= startDate)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ) || [];
    return {
      label: symbol,
      data: dataForSymbol.map((dp) => ({
        x: new Date(dp.timestamp),
        y: parseFloat(dp.price),
      })),
      fill: false,
      borderColor: getColorForSymbol(symbol),
    };
  });

  const chartData = {
    datasets,
  };

  const options = {
    scales: {
      x: {
        type: "time" as const,
        time: {
          tooltipFormat: "PPpp",
        },
        title: {
          display: true,
          text: "Timestamp",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price",
        },
      },
    },
  };

  // Utility function: assign a consistent color for each symbol
  function getColorForSymbol(symbol: string) {
    const colors = [
      "rgba(75,192,192,1)",
      "rgba(192,75,192,1)",
      "rgba(192,192,75,1)",
      "rgba(75,75,192,1)",
      "rgba(192,75,75,1)",
      "rgba(75,192,75,1)",
    ];
    const index = Math.abs(hashCode(symbol)) % colors.length;
    return colors[index];
  }

  function hashCode(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Stock Prices Dashboard</h1>
      
      {/* Time Span Selection */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select Time Span</h2>
        <select
          value={timeSpan}
          onChange={(e) => setTimeSpan(e.target.value)}
          className="border p-2 rounded-md bg-gray-700 text-white"
        >
          {timeSpanOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Symbol Selection */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select Symbols</h2>
        <div className="flex flex-wrap gap-4">
          {Object.keys(groupedData).map((symbol) => (
            <label key={symbol} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedSymbols.includes(symbol)}
                onChange={() => toggleSymbol(symbol)}
              />
              <span>{symbol}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div>
        {selectedSymbols.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <p>No symbols selected</p>
        )}
      </div>
    </div>
  );
}
