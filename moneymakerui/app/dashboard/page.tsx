"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  BarElement,
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
  Legend,
  ArcElement,
  CategoryScale,
  BarElement
);

interface StockPrice {
  symbol: string;
  timestamp: string;
  price: string; // Prisma Decimal returns as string
}

interface PortfolioItem {
  symbol: string;
  quantity: number;
}

const timeSpanOptions: { label: string; value: string }[] = [
  { label: "All Time", value: "ALL" },
  { label: "Last 1 Day", value: "1D" },
  { label: "Last 1 Week", value: "1W" },
  { label: "Last 1 Month", value: "1M" },
  { label: "Last 3 Months", value: "3M" },
  { label: "Last 1 Year", value: "1Y" },
];

function getTimeUnit(span: string): "minute" | "hour" | "day" | "week" | "month" | "year" {
  switch (span) {
    case "1D":
      return "hour";
    case "1W":
      return "day";
    case "1M":
      return "day";
    case "3M":
      return "week";
    case "1Y":
      return "month";
    default:
      return "year";
  }
}

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
      return new Date(0);
  }
}

// Use a more distinct color palette
function getColorForSymbol(symbol: string): string {
  const colors = [
    "rgba(255, 99, 132, 0.8)",   // Red
    "rgba(54, 162, 235, 0.8)",   // Blue
    "rgba(255, 206, 86, 0.8)",   // Yellow
    "rgba(75, 192, 192, 0.8)",   // Green
    "rgba(153, 102, 255, 0.8)",  // Purple
    "rgba(255, 159, 64, 0.8)",   // Orange
    "rgba(199, 199, 199, 0.8)",  // Gray
  ];
  const index = Math.abs(hashCode(symbol)) % colors.length;
  return colors[index];
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export default function StockDashboard() {
  const [stockPrices, setStockPrices] = useState<StockPrice[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [timeSpan, setTimeSpan] = useState<string>("ALL");

  // Fetch stock prices
  useEffect(() => {
    axios
      .get<StockPrice[]>("/api/stock_prices")
      .then((res) => {
        console.log("✅ Fetched stock prices:", res.data);
        setStockPrices(res.data);
      })
      .catch((error) => console.error("Error fetching stock prices:", error));
  }, []);

  // Fetch portfolio data
  useEffect(() => {
    axios
      .get<PortfolioItem[]>("/api/portfolio", { withCredentials: true })
      .then((res) => {
        console.log("✅ Fetched portfolio:", res.data);
        setPortfolio(res.data);
      })
      .catch((error) => console.error("Error fetching portfolio:", error));
  }, []);

  // Group stock prices by symbol
  const groupedData = stockPrices.reduce((acc: { [key: string]: StockPrice[] }, curr) => {
    if (!acc[curr.symbol]) {
      acc[curr.symbol] = [];
    }
    acc[curr.symbol].push(curr);
    return acc;
  }, {} as { [key: string]: StockPrice[] });

  // Initialize selectedSymbols with all available symbols if none selected
  useEffect(() => {
    const allSymbols = Object.keys(groupedData);
    if (selectedSymbols.length === 0 && allSymbols.length > 0) {
      setSelectedSymbols(allSymbols);
    }
  }, [groupedData, selectedSymbols.length]);

  const toggleSymbol = (symbol: string) => {
    setSelectedSymbols((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const startDate = getStartDateForTimeSpan(timeSpan);
  const timeUnit = getTimeUnit(timeSpan);

  // Prepare datasets for the line chart (price over time)
  const lineDatasets = selectedSymbols.map((symbol) => {
    const dataForSymbol = (groupedData[symbol] || [])
      .filter((dp) => new Date(dp.timestamp) >= startDate)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
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
  const lineChartData = { datasets: lineDatasets };
  const lineChartOptions = {
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: timeUnit,
          tooltipFormat: "PPpp",
        },
        title: { display: true, text: "Timestamp" },
      },
      y: { title: { display: true, text: "Price ($)" } },
    },
  };

  // Prepare data for portfolio overview (bar chart)
  const barLabels = portfolio.map((item) => item.symbol);
  // Compute latest price per symbol from groupedData
  const latestPriceBySymbol: { [key: string]: number } = {};
  for (const symbol in groupedData) {
    const sorted = groupedData[symbol].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    if (sorted.length > 0) {
      latestPriceBySymbol[symbol] = parseFloat(sorted[sorted.length - 1].price);
    }
  }
  const barData = portfolio.map((item) => {
    const latestPrice = latestPriceBySymbol[item.symbol] || 0;
    return item.quantity * latestPrice;
  });
  const barChartData = {
    labels: barLabels,
    datasets: [
      {
        label: "Portfolio Value ($)",
        data: barData,
        backgroundColor: barLabels.map((symbol) => getColorForSymbol(symbol)),
      },
    ],
  };
  const barChartOptions = {
    scales: {
      y: { title: { display: true, text: "Value ($)" } },
      x: { title: { display: true, text: "Stock Symbol" } },
    },
  };

  // Prepare data for portfolio composition (pie chart)
  const pieData = {
    labels: portfolio.map((item) => item.symbol),
    datasets: [
      {
        label: "Portfolio Composition",
        data: portfolio.map((item) => item.quantity),
        backgroundColor: portfolio.map((item) => getColorForSymbol(item.symbol)),
        borderColor: portfolio.map((item) => getColorForSymbol(item.symbol)),
        borderWidth: 1,
      },
    ],
  };

  // Compute portfolio overview for display in cards and grand total
  const portfolioOverview = portfolio.map((item) => {
    const latestPrice = latestPriceBySymbol[item.symbol] || 0;
    return {
      symbol: item.symbol,
      quantity: item.quantity,
      latestPrice,
      total: item.quantity * latestPrice,
    };
  });
  const grandTotal = portfolioOverview.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Stock Prices Dashboard</h1>
      
      {/* Portfolio Overview Cards */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-white">Portfolio Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {portfolioOverview.map((item) => (
            <div key={item.symbol} className="bg-gray-800 rounded-lg shadow-lg p-4">
              <h3 className="text-xl font-bold text-white">{item.symbol}</h3>
              <p className="text-gray-300">Quantity: {item.quantity}</p>
              <p className="text-gray-300">
                Latest Price: ${item.latestPrice.toFixed(2)}
              </p>
              <p className="text-gray-300">
                Total: ${item.total.toFixed(2)}
              </p>
            </div>
          ))}
          <div className="bg-gray-700 rounded-lg shadow-lg p-4 flex flex-col items-center">
            <h3 className="text-2xl font-bold text-white">Grand Total</h3>
            <p className="text-gray-300 text-xl">${grandTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Charts Row: Bar Chart (Portfolio Value) and Pie Chart (Portfolio Composition) */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/2">
          <h2 className="text-xl font-semibold mb-2 text-white">Portfolio Value</h2>
          {portfolio.length > 0 ? (
            <Bar data={barChartData} options={barChartOptions} />
          ) : (
            <p className="text-gray-400">No portfolio data available.</p>
          )}
        </div>
        <div className="md:w-1/2">
          <h2 className="text-xl font-semibold mb-2 text-white">Portfolio Composition</h2>
          {portfolio.length > 0 ? (
            <Pie data={pieData} />
          ) : (
            <p className="text-gray-400">No portfolio data available.</p>
          )}
        </div>
      </div>

      {/* Line Chart for Stock Prices */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Stock Prices Over Time</h2>
        {selectedSymbols.length > 0 ? (
          <Line data={lineChartData} options={lineChartOptions} />
        ) : (
          <p className="text-gray-400">No symbols selected.</p>
        )}
      </div>

      {/* Time Span Selection */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-white">Select Time Span</h2>
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
        <h2 className="text-xl font-semibold mb-2 text-white">Select Symbols</h2>
        <div className="flex flex-wrap gap-4">
          {Object.keys(groupedData).map((symbol) => (
            <label key={symbol} className="flex items-center space-x-2 text-white">
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
    </div>
  );
}
