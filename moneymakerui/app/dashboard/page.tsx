"use client";

import { useEffect, useState, ChangeEvent } from "react";
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

function getColorForSymbol(symbol: string): string {
  const colors = [
    "rgba(255, 99, 132, 0.8)", // Red
    "rgba(54, 162, 235, 0.8)", // Blue
    "rgba(255, 206, 86, 0.8)", // Yellow
    "rgba(75, 192, 192, 0.8)", // Green
    "rgba(153, 102, 255, 0.8)", // Purple
    "rgba(255, 159, 64, 0.8)", // Orange
    "rgba(199, 199, 199, 0.8)", // Gray
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

// All available dashboard components.
const dashboardComponents = [
  { label: "Portfolio Overview", value: "portfolioOverview" },
  { label: "Portfolio Value", value: "portfolioValue" },
  { label: "Portfolio Composition", value: "portfolioComposition" },
  { label: "Stock Prices Over Time", value: "stockPrices" },
  { label: "Stock Value Summary", value: "stockValueSummary" },
];

export default function StockDashboard() {
  const [stockPrices, setStockPrices] = useState<StockPrice[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [timeSpan, setTimeSpan] = useState<string>("ALL");
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);

  // Load saved dashboard settings or default to all components once.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboardSelectedCharts");
      if (saved) {
        setSelectedCharts(JSON.parse(saved));
      } else {
        setSelectedCharts(dashboardComponents.map((c) => c.value));
      }
    }
  }, []);

  // Persist settings whenever they change.
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboardSelectedCharts", JSON.stringify(selectedCharts));
    }
  }, [selectedCharts]);

  // Only list dropdown options that are not already selected.
  const availableComponents = dashboardComponents.filter(
    (c) => !selectedCharts.includes(c.value)
  );

  // Add component (no duplicates allowed).
  const addDashboardComponent = (componentValue: string) => {
    if (!selectedCharts.includes(componentValue)) {
      setSelectedCharts((prev) => [...prev, componentValue]);
    }
  };

  // Remove a component by its index.
  const removeDashboardComponent = (indexToRemove: number) => {
    setSelectedCharts((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Fetch stock prices.
  useEffect(() => {
    axios
      .get<StockPrice[]>("/api/stock_prices")
      .then((res) => setStockPrices(res.data))
      .catch((error) => console.error("Error fetching stock prices:", error));
  }, []);

  // Fetch portfolio data.
  useEffect(() => {
    axios
      .get<PortfolioItem[]>("/api/portfolio", { withCredentials: true })
      .then((res) => setPortfolio(res.data))
      .catch((error) => console.error("Error fetching portfolio:", error));
  }, []);

  // Group stock prices by symbol.
  const groupedData = stockPrices.reduce((acc: { [key: string]: StockPrice[] }, curr) => {
    if (!acc[curr.symbol]) {
      acc[curr.symbol] = [];
    }
    acc[curr.symbol].push(curr);
    return acc;
  }, {} as { [key: string]: StockPrice[] });

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

  // Chart settings for "Stock Prices Over Time"
  const startDate = getStartDateForTimeSpan(timeSpan);
  const timeUnit = getTimeUnit(timeSpan);
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
        time: { unit: timeUnit, tooltipFormat: "PPpp" },
        title: { display: true, text: "Timestamp" },
      },
      y: { title: { display: true, text: "Price ($)" } },
    },
  };

  // Compute latest price per symbol.
  const latestPriceBySymbol: { [key: string]: number } = {};
  for (const symbol in groupedData) {
    const sorted = groupedData[symbol].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    if (sorted.length > 0) {
      latestPriceBySymbol[symbol] = parseFloat(sorted[sorted.length - 1].price);
    }
  }

  // Portfolio Value (bar chart) data.
  const barLabels = portfolio.map((item) => item.symbol);
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

  // Portfolio Composition (pie chart) data.
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

  // Redesigned Portfolio Overview:
  const miniChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
  };
  const miniStartDate = getStartDateForTimeSpan("1D");
  const portfolioOverview = portfolio.map((item) => {
    const symbolData = (groupedData[item.symbol] || [])
      .filter((dp) => new Date(dp.timestamp) >= miniStartDate)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map((dp) => ({
        x: new Date(dp.timestamp),
        y: parseFloat(dp.price),
      }));
    const latestPrice = latestPriceBySymbol[item.symbol] || 0;
    const total = item.quantity * latestPrice;
    return { ...item, miniData: symbolData, latestPrice, total };
  });
  const grandTotal = portfolioOverview.reduce((acc, curr) => acc + curr.total, 0);

  // Stock Value Summary:
  const stockValueData = portfolio.map((item) => {
    const dataForStock = (groupedData[item.symbol] || [])
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map((dp) => ({
        x: new Date(dp.timestamp),
        y: item.quantity * parseFloat(dp.price),
      }));
    return { symbol: item.symbol, data: dataForStock };
  });
  const stockValueSummaryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: true, title: { display: true, text: "Time" } },
      y: { display: true, title: { display: true, text: "Value ($)" } },
    },
  };

  // Render a component based on its type.
  const renderComponent = (component: string, index: number) => {
    switch (component) {
      case "portfolioOverview":
        return (
          <div className="bg-gray-200 rounded-lg p-3 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={() => removeDashboardComponent(index)}
            >
              X
            </button>
            <h2 className="text-2xl font-semibold mb-3">Portfolio Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {portfolioOverview.map((item) => (
                <div key={item.symbol} className="bg-gray-100 rounded-lg p-3 flex flex-col gap-1">
                  <div className="font-bold text-lg">{item.symbol}</div>
                  <div>Qty: {item.quantity}</div>
                  <div>Price: ${item.latestPrice.toFixed(2)}</div>
                  <div>Total: ${item.total.toFixed(2)}</div>
                  <div className="w-full h-16">
                    <Line
                      data={{
                        datasets: [
                          {
                            label: item.symbol,
                            data: item.miniData,
                            fill: false,
                            borderColor: getColorForSymbol(item.symbol),
                          },
                        ],
                      }}
                      options={miniChartOptions}
                    />
                  </div>
                </div>
              ))}
              <div className="bg-gray-300 rounded-lg p-3 flex flex-col items-center">
                <h3 className="text-2xl font-bold">Grand Total</h3>
                <p className="text-lg">${grandTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        );
      case "portfolioValue":
        return (
          <div className="bg-gray-200 rounded-lg p-3 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={() => removeDashboardComponent(index)}
            >
              X
            </button>
            <h2 className="text-xl font-semibold mb-2">Portfolio Value</h2>
            {portfolio.length > 0 ? (
              <Bar data={barChartData} options={barChartOptions} />
            ) : (
              <p className="text-gray-500">No portfolio data available.</p>
            )}
          </div>
        );
      case "portfolioComposition":
        return (
          <div className="bg-gray-200 rounded-lg p-3 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={() => removeDashboardComponent(index)}
            >
              X
            </button>
            <h2 className="text-xl font-semibold mb-2">Portfolio Composition</h2>
            {portfolio.length > 0 ? (
              <div className="w-full h-100">
                <Pie data={pieData} />
              </div>
            ) : (
              <p className="text-gray-500">No portfolio data available.</p>
            )}
          </div>
        );
      case "stockPrices":
        return (
          <div className="bg-gray-200 rounded-lg p-3 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={() => removeDashboardComponent(index)}
            >
              X
            </button>
            <h2 className="text-xl font-semibold mb-3">Stock Prices Over Time</h2>
            <div className="mb-3 p-3 border rounded bg-white">
              <h3 className="text-lg font-semibold mb-2">Chart Settings</h3>
              <div className="flex flex-col md:flex-row gap-3">
                <div>
                  <label className="block mb-1">Time Span</label>
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
                <div>
                  <label className="block mb-1">Symbols</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(groupedData).map((symbol) => (
                      <label key={symbol}>
                        <input
                          type="checkbox"
                          checked={selectedSymbols.includes(symbol)}
                          onChange={() => toggleSymbol(symbol)}
                          className="mr-1"
                        />
                        {symbol}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {selectedSymbols.length > 0 ? (
              <Line data={lineChartData} options={lineChartOptions} />
            ) : (
              <p className="text-gray-500">No symbols selected.</p>
            )}
          </div>
        );
      case "stockValueSummary":
        return (
          <div className="bg-gray-200 rounded-lg p-3 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={() => removeDashboardComponent(index)}
            >
              X
            </button>
            <h2 className="text-xl font-semibold mb-3">Stock Value Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stockValueData.map((stock) => (
                <div key={stock.symbol} className="bg-gray-100 rounded-lg p-3">
                  <h3 className="font-bold mb-2">{stock.symbol}</h3>
                  <div className="w-full h-32">
                    <Line
                      data={{
                        datasets: [
                          {
                            label: stock.symbol,
                            data: stock.data,
                            fill: false,
                            borderColor: getColorForSymbol(stock.symbol),
                          },
                        ],
                      }}
                      options={stockValueSummaryOptions}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Stock Prices Dashboard</h1>
        <div className="mt-4 sm:mt-0">
          {availableComponents.length > 0 ? (
            <select
              defaultValue=""
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                if (e.target.value) {
                  addDashboardComponent(e.target.value);
                }
              }}
              className="border p-2 rounded-md bg-gray-700 text-white"
            >
              <option value="" disabled>
                Add Component...
              </option>
              {availableComponents.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-600">All components added.</p>
          )}
        </div>
      </div>
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {selectedCharts.map((comp, index) => (
          <div key={index}>{renderComponent(comp, index)}</div>
        ))}
      </div>
    </div>
  );
}
