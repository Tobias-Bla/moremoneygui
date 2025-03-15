"use client";

import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from "chart.js";
import Link from "next/link";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

interface NewsItem {
  headline: string;
  source: string;
  timestamp: string;
  snippet: string;
  url: string;
}

interface SectorPerformance {
  sector: string;
  performance: number; // percentage change
}

interface TrendingStock {
  symbol: string;
  company: string;
  currentPrice: number;
  changePercentage: number;
  sparklineData: { x: Date; y: number }[];
}

export default function MarketTrendsPage() {
  // Dummy data state
  const [news, setNews] = useState<NewsItem[]>([]);
  const [sectors, setSectors] = useState<SectorPerformance[]>([]);
  const [trendingStocks, setTrendingStocks] = useState<TrendingStock[]>([]);

  useEffect(() => {
    // Dummy News Data
    setNews([
      {
        headline: "Market rallies on positive earnings",
        source: "Reuters",
        timestamp: new Date().toISOString(),
        snippet: "Stocks surged today on the back of better-than-expected earnings...",
        url: "#",
      },
      {
        headline: "Tech stocks lead market gains",
        source: "Bloomberg",
        timestamp: new Date().toISOString(),
        snippet: "Tech companies saw significant increases as the market reacted positively...",
        url: "#",
      },
      {
        headline: "Global markets mixed amid economic data",
        source: "CNBC",
        timestamp: new Date().toISOString(),
        snippet: "Investors remain cautious as fresh economic data was released this morning...",
        url: "#",
      },
    ]);

    // Dummy Sector Performance Data
    setSectors([
      { sector: "Technology", performance: 2.5 },
      { sector: "Healthcare", performance: -1.2 },
      { sector: "Finance", performance: 1.0 },
      { sector: "Energy", performance: -0.5 },
      { sector: "Consumer Discretionary", performance: 3.2 },
    ]);

    // Dummy Trending Stocks Data
    setTrendingStocks([
      {
        symbol: "AAPL",
        company: "Apple Inc.",
        currentPrice: 150,
        changePercentage: 1.2,
        sparklineData: [
          { x: new Date(Date.now() - 5 * 3600 * 1000), y: 148 },
          { x: new Date(Date.now() - 4 * 3600 * 1000), y: 149 },
          { x: new Date(Date.now() - 3 * 3600 * 1000), y: 150 },
          { x: new Date(Date.now() - 2 * 3600 * 1000), y: 151 },
          { x: new Date(Date.now() - 1 * 3600 * 1000), y: 150 },
        ],
      },
      {
        symbol: "GOOGL",
        company: "Alphabet Inc.",
        currentPrice: 2800,
        changePercentage: -0.8,
        sparklineData: [
          { x: new Date(Date.now() - 5 * 3600 * 1000), y: 2820 },
          { x: new Date(Date.now() - 4 * 3600 * 1000), y: 2810 },
          { x: new Date(Date.now() - 3 * 3600 * 1000), y: 2805 },
          { x: new Date(Date.now() - 2 * 3600 * 1000), y: 2800 },
          { x: new Date(Date.now() - 1 * 3600 * 1000), y: 2800 },
        ],
      },
      {
        symbol: "AMZN",
        company: "Amazon.com Inc.",
        currentPrice: 3400,
        changePercentage: 0.5,
        sparklineData: [
          { x: new Date(Date.now() - 5 * 3600 * 1000), y: 3380 },
          { x: new Date(Date.now() - 4 * 3600 * 1000), y: 3390 },
          { x: new Date(Date.now() - 3 * 3600 * 1000), y: 3400 },
          { x: new Date(Date.now() - 2 * 3600 * 1000), y: 3410 },
          { x: new Date(Date.now() - 1 * 3600 * 1000), y: 3400 },
        ],
      },
    ]);
  }, []);

  // Bar chart data and options for Sector Analysis
  const sectorChartData = {
    labels: sectors.map((s) => s.sector),
    datasets: [
      {
        label: "Performance (%)",
        data: sectors.map((s) => s.performance),
        backgroundColor: sectors.map((s) =>
          s.performance >= 0 ? "rgba(75, 192, 192, 0.6)" : "rgba(255, 99, 132, 0.6)"
        ),
      },
    ],
  };

  const sectorChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Sector Performance" },
    },
  };

  // Sparkline chart options for Trending Stocks
  const sparklineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: { radius: 0 },
      line: { tension: 0.3 },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div className="p-6 bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Market Trends</h1>

      {/* Real-Time Market News Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Latest Market News</h2>
        {/* News Ticker */}
        <div className="overflow-hidden whitespace-nowrap bg-blue-50 p-2 rounded">
          <div className="animate-marquee inline-block">
            {news.map((item, index) => (
              <span key={index} className="mx-4">
                {item.headline}
              </span>
            ))}
          </div>
        </div>
        {/* News Feed */}
        <div className="mt-4 space-y-4">
          {news.map((item, index) => (
            <div key={index} className="p-4 bg-white rounded shadow">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-lg font-bold hover:underline">
                {item.headline}
              </a>
              <p className="text-sm text-gray-600">
                {item.source} • {new Date(item.timestamp).toLocaleTimeString()}
              </p>
              <p>{item.snippet}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sector Analysis Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Sector Analysis</h2>
        <div className="bg-white p-4 rounded shadow">
          <Bar data={sectorChartData} options={sectorChartOptions} />
        </div>
      </section>

      {/* Trending Stocks Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Trending Stocks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trendingStocks.map((stock, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-bold text-lg">{stock.symbol}</h3>
                  <p className="text-sm text-gray-600">{stock.company}</p>
                </div>
                <div className={stock.changePercentage >= 0 ? "text-green-600" : "text-red-600"}>
                  {stock.changePercentage >= 0 ? `+${stock.changePercentage}%` : `${stock.changePercentage}%`}
                </div>
              </div>
              <div className="h-16">
                <Line
                  data={{ datasets: [{ data: stock.sparklineData, borderColor: "#4F46E5", fill: false }] }}
                  options={sparklineOptions}
                />
              </div>
              <p className="mt-2 text-lg font-semibold">${stock.currentPrice.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
