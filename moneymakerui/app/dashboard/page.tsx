"use client";

import { useEffect, useState, ChangeEvent, ReactNode } from "react";
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
  price: string;
}

interface PortfolioItem {
  symbol: string;
  quantity: number;
}

interface CardProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  children: ReactNode;
}

const Card = ({ title, subtitle, onClose, children }: CardProps) => (
  <section className="relative rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-black/40 backdrop-blur-md">
    {onClose && (
      <button
        type="button"
        aria-label="Remove widget"
        className="absolute right-3 top-3 text-xs font-medium text-slate-500 transition hover:text-rose-400"
        onClick={onClose}
      >
        ✕
      </button>
    )}
    <header className="mb-4 space-y-1">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
        {title}
      </h2>
      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </header>
    {children}
  </section>
);

const timeSpanOptions: { label: string; value: string }[] = [
  { label: "All Time", value: "ALL" },
  { label: "Last 1 Day", value: "1D" },
  { label: "Last 1 Week", value: "1W" },
  { label: "Last 1 Month", value: "1M" },
  { label: "Last 3 Months", value: "3M" },
  { label: "Last 1 Year", value: "1Y" },
];

function getTimeUnit(
  span: string
): "minute" | "hour" | "day" | "week" | "month" | "year" {
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
    "rgba(239, 68, 68, 0.9)",
    "rgba(59, 130, 246, 0.9)",
    "rgba(234, 179, 8, 0.9)",
    "rgba(16, 185, 129, 0.9)",
    "rgba(129, 140, 248, 0.9)",
    "rgba(249, 115, 22, 0.9)",
    "rgba(148, 163, 184, 0.9)",
  ];
  const index = Math.abs(hashCode(symbol)) % colors.length;
  return colors[index];
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

// konfigurierbare Widgets (ohne StockValueSummary)
const dashboardComponents = [
  { label: "Portfolio Overview", value: "portfolioOverview" },
  { label: "Portfolio Value", value: "portfolioValue" },
  { label: "Portfolio Composition", value: "portfolioComposition" },
  { label: "Stock Prices Over Time", value: "stockPrices" },
];

export default function StockDashboard() {
  const [stockPrices, setStockPrices] = useState<StockPrice[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [timeSpan, setTimeSpan] = useState<string>("ALL");
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboardSelectedCharts");
      if (saved) {
        const parsed: string[] = JSON.parse(saved);
        const sanitized = parsed.filter((c) => c !== "stockValueSummary");
        if (sanitized.length === 0) {
          setSelectedCharts([
            "portfolioOverview",
            "stockPrices",
            "portfolioValue",
            "portfolioComposition",
          ]);
        } else {
          setSelectedCharts(sanitized);
        }
      } else {
        setSelectedCharts([
          "portfolioOverview",
          "stockPrices",
          "portfolioValue",
          "portfolioComposition",
        ]);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "dashboardSelectedCharts",
        JSON.stringify(selectedCharts)
      );
    }
  }, [selectedCharts]);

  const availableComponents = dashboardComponents.filter(
    (c) => !selectedCharts.includes(c.value)
  );

  const addDashboardComponent = (componentValue: string) => {
    if (!selectedCharts.includes(componentValue)) {
      setSelectedCharts((prev) => [...prev, componentValue]);
    }
  };

  const removeDashboardComponent = (indexToRemove: number) => {
    setSelectedCharts((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  useEffect(() => {
    axios
      .get<StockPrice[]>("/api/stock_prices")
      .then((res) => setStockPrices(res.data))
      .catch((error) => console.error("Error fetching stock prices:", error));
  }, []);

  useEffect(() => {
    axios
      .get<PortfolioItem[]>("/api/portfolio", { withCredentials: true })
      .then((res) => setPortfolio(res.data))
      .catch((error) => console.error("Error fetching portfolio:", error));
  }, []);

  const groupedData = stockPrices.reduce(
    (acc: { [key: string]: StockPrice[] }, curr) => {
      if (!acc[curr.symbol]) {
        acc[curr.symbol] = [];
      }
      acc[curr.symbol].push(curr);
      return acc;
    },
    {} as { [key: string]: StockPrice[] }
  );

  const availableSymbols = portfolio
    .map((p) => p.symbol)
    .filter((symbol, index, self) => self.indexOf(symbol) === index)
    .filter((symbol) => groupedData[symbol] && groupedData[symbol].length > 0);

  useEffect(() => {
    setSelectedSymbols((prev) => {
      if (availableSymbols.length === 0) return prev;
      if (prev.length === 0) return availableSymbols;
      const stillValid = prev.filter((s) => availableSymbols.includes(s));
      return stillValid.length === 0 ? availableSymbols : stillValid;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolio, stockPrices]);

  const toggleSymbol = (symbol: string) => {
    setSelectedSymbols((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const startDate = getStartDateForTimeSpan(timeSpan);
  const timeUnit = getTimeUnit(timeSpan);

  const lineDatasets = selectedSymbols.map((symbol) => {
    const dataForSymbol = (groupedData[symbol] || [])
      .filter((dp) => new Date(dp.timestamp) >= startDate)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
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
        grid: { color: "rgba(148, 163, 184, 0.2)" },
      },
      y: {
        title: { display: true, text: "Price ($)" },
        grid: { color: "rgba(15, 23, 42, 0.8)" },
      },
    },
    plugins: {
      legend: {
        labels: { color: "#e5e7eb" },
      },
    },
  };

  const latestPriceBySymbol: { [key: string]: number } = {};
  for (const symbol in groupedData) {
    const sorted = groupedData[symbol].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    if (sorted.length > 0) {
      latestPriceBySymbol[symbol] = parseFloat(sorted[sorted.length - 1].price);
    }
  }

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
      y: {
        title: { display: true, text: "Value ($)" },
        grid: { color: "rgba(15, 23, 42, 0.8)" },
      },
      x: {
        title: { display: true, text: "Stock Symbol" },
        grid: { display: false },
        ticks: { color: "#cbd5f5" },
      },
    },
    plugins: {
      legend: {
        labels: { color: "#e5e7eb" },
      },
    },
  };

  const pieData = {
    labels: portfolio.map((item) => item.symbol),
    datasets: [
      {
        label: "Portfolio Composition",
        data: portfolio.map((item) => item.quantity),
        backgroundColor: portfolio.map((item) => getColorForSymbol(item.symbol)),
        borderColor: "rgba(15, 23, 42, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Mini-Chart für spätere Erweiterung (z. B. kleine Sparkline)
  const miniChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };
  const miniStartDate = getStartDateForTimeSpan("1M");
  const portfolioOverview = portfolio.map((item) => {
    const symbolData = (groupedData[item.symbol] || [])
      .filter((dp) => new Date(dp.timestamp) >= miniStartDate)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
      .map((dp) => ({
        x: new Date(dp.timestamp),
        y: parseFloat(dp.price),
      }));
    const latestPrice = latestPriceBySymbol[item.symbol] || 0;
    const total = item.quantity * latestPrice;
    return { ...item, miniData: symbolData, latestPrice, total };
  });
  const grandTotal = portfolioOverview.reduce(
    (acc, curr) => acc + curr.total,
    0
  );

  // KPI: Tagesperformance (nur, wenn mind. 2 Datenpunkte pro Symbol)
  let dailyPrev = 0;
  let dailyCurr = 0;
  portfolio.forEach((item) => {
    const data = (groupedData[item.symbol] || []).sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    if (data.length === 0) return;
    const last = parseFloat(data[data.length - 1].price);
    const prev =
      data.length > 1
        ? parseFloat(data[data.length - 2].price)
        : parseFloat(data[data.length - 1].price);
    dailyCurr += item.quantity * last;
    dailyPrev += item.quantity * prev;
  });
  const dailyDiff = dailyCurr - dailyPrev;
  const dailyPct =
    dailyPrev > 0 ? (dailyDiff / dailyPrev) * 100 : dailyCurr > 0 ? 100 : 0;

  const positionsCount = portfolio.length;

  const renderComponent = (component: string, index: number) => {
    switch (component) {
      case "portfolioOverview":
        return (
          <Card
            title="Portfolio Overview"
            subtitle="Bestand deines Depots"
            onClose={() => removeDashboardComponent(index)}
          >
            {portfolioOverview.length === 0 ? (
              <p className="text-sm text-slate-500">
                No portfolio data available.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
                  <table className="min-w-full text-sm text-slate-200">
                    <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">
                          Name
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          Stück
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          Akt. Kurs
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          Wert
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          Gewichtung
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          Chart
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioOverview.map((item) => {
                        const weight =
                          grandTotal > 0
                            ? (item.total / grandTotal) * 100
                            : 0;
                        return (
                          <tr
                            key={item.symbol}
                            className="border-t border-slate-800/80 hover:bg-slate-900/60"
                          >
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold">
                                  {item.symbol}
                                </span>
                                <span className="text-xs text-slate-500">
                                  Stock • {item.symbol}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right align-middle">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-right align-middle">
                              <span className="font-medium text-emerald-400">
                                ${item.latestPrice.toFixed(2)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right align-middle">
                              <span className="font-semibold">
                                ${item.total.toFixed(2)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right align-middle">
                              <span className="text-xs text-slate-300">
                                {weight.toFixed(2)} %
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right align-middle">
                              <div className="ml-auto h-8 w-24">
                                {item.miniData.length > 1 && (
                                  <Line
                                    data={{
                                      datasets: [
                                        {
                                          label: item.symbol,
                                          data: item.miniData,
                                          fill: false,
                                          borderColor: getColorForSymbol(
                                            item.symbol
                                          ),
                                        },
                                      ],
                                    }}
                                    options={miniChartOptions}
                                  />
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-between text-xs text-slate-400">
                  <span>Depotbestand</span>
                  <span className="text-sm font-semibold text-slate-50">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </Card>
        );
      case "portfolioValue":
        return (
          <Card
            title="Portfolio Value"
            subtitle="Wert deiner einzelnen Positionen"
            onClose={() => removeDashboardComponent(index)}
          >
            {portfolio.length > 0 ? (
              <div className="h-72">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No portfolio data available.
              </p>
            )}
          </Card>
        );
      case "portfolioComposition":
        return (
          <Card
            title="Portfolio Composition"
            subtitle="Gewichtung nach Symbol"
            onClose={() => removeDashboardComponent(index)}
          >
            {portfolio.length > 0 ? (
              <div className="mx-auto h-72 w-full max-w-md">
                <Pie data={pieData} />
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No portfolio data available.
              </p>
            )}
          </Card>
        );
      case "stockPrices":
        return (
          <Card
            title="Stock Prices Over Time"
            subtitle="Kursentwicklung deiner Portfolio-Werte"
            onClose={() => removeDashboardComponent(index)}
          >
            <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-200">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Time Span
                  </p>
                  <select
                    value={timeSpan}
                    onChange={(e) => setTimeSpan(e.target.value)}
                    className="w-40 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 outline-none ring-0 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  >
                    {timeSpanOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="max-w-sm">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Symbols (Portfolio)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableSymbols.map((symbol) => (
                      <label
                        key={symbol}
                        className="flex items-center gap-1 rounded-full bg-slate-900/70 px-2 py-1"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSymbols.includes(symbol)}
                          onChange={() => toggleSymbol(symbol)}
                          className="h-3 w-3 rounded border-slate-600 bg-slate-900 text-sky-500"
                        />
                        <span className="text-[11px] text-slate-200">
                          {symbol}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {selectedSymbols.length > 0 ? (
              <div className="h-80">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No symbols selected or no data for portfolio symbols.
              </p>
            )}
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:px-8">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-400/80">
              moremoney
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
              Stock Prices Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Live-Überblick über Depotwert, Verteilung und Kursverlauf deiner
              beobachteten Aktien.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 text-sm md:items-end">
            {availableComponents.length > 0 ? (
              <>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Widgets
                </span>
                <select
                  defaultValue=""
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    if (e.target.value) {
                      addDashboardComponent(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="w-48 rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none ring-0 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                >
                  <option value="" disabled>
                    Add Component
                  </option>
                  {availableComponents.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <p className="text-xs text-slate-500">All components added.</p>
            )}
          </div>
        </header>

        {/* KPI Cards */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-slate-900 to-slate-900 px-5 py-4 shadow-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200/80">
              Depotbestand
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {grandTotal > 0 ? `$${grandTotal.toFixed(2)}` : "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/80 px-5 py-4 shadow-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/80">
              Tagesperformance
            </p>
            {dailyPrev === 0 && dailyCurr === 0 ? (
              <p className="mt-2 text-sm text-slate-500">Keine Daten</p>
            ) : (
              <>
                <p
                  className={`mt-2 text-lg font-semibold ${
                    dailyDiff >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {dailyDiff >= 0 ? "+" : ""}
                  ${dailyDiff.toFixed(2)}
                </p>
                <p className="text-xs text-slate-400">
                  {dailyDiff >= 0 ? "+" : ""}
                  {dailyPct.toFixed(2)} %
                  {dailyPrev === 0 && dailyCurr > 0 ? " (seit Start)" : ""}
                </p>
              </>
            )}
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 px-5 py-4 shadow-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              Positionen
            </p>
            <p className="mt-2 text-2xl font-semibold">{positionsCount}</p>
          </div>
        </section>

        {/* Widgets */}
        <section className="grid gap-6 md:grid-cols-2">
          {selectedCharts.map((comp, index) => {
            const fullWidth =
              comp === "portfolioOverview" || comp === "stockPrices";
            const colClass = fullWidth ? "md:col-span-2" : "";
            return (
              <div key={comp + index} className={colClass}>
                {renderComponent(comp, index)}
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
