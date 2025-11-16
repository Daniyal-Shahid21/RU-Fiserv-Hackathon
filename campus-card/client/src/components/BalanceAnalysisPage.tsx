import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) || "http://127.0.0.1:5000";

type Transaction = {
  id: number;
  merchant: string;
  category: string;
  amount: number;
  location: string;
  date: string; // ISO string
};

type Period = "Y" | "S" | "M";

const pieColors = [
  "#012753", // prussian
  "#fb6400", // blaze
  "#4f46e5",
  "#22c55e",
  "#ef4444",
  "#eab308",
  "#06b6d4",
];

const BalanceAnalysisPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [period, setPeriod] = useState<Period>("M");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/transactions`);
        if (!res.ok) {
          throw new Error(`Failed to fetch transactions: ${res.status}`);
        }
        const data = (await res.json()) as Transaction[];
        setTransactions(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error loading transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate: Date | null = null;

    if (period === "Y") {
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
    } else if (period === "S") {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 4);
    } else if (period === "M") {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
    }

    return transactions.filter((t) => {
      const d = new Date(t.date);
      if (startDate && d < startDate) return false;
      if (categoryFilter !== "all" && t.category !== categoryFilter) {
        return false;
      }
      return true;
    });
  }, [transactions, period, categoryFilter]);

  const selectedTransactions = useMemo(
    () => filteredTransactions.filter((t) => selectedIds.has(t.id)),
    [filteredTransactions, selectedIds]
  );

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const allVisibleSelected =
    filteredTransactions.length > 0 &&
    filteredTransactions.every((t) => selectedIds.has(t.id));

  const toggleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      if (allVisibleSelected) {
        filteredTransactions.forEach((t) => copy.delete(t.id));
      } else {
        filteredTransactions.forEach((t) => copy.add(t.id));
      }
      return copy;
    });
  };

  // ---------- Chart data (uses selected if any, else all filtered) ----------
  const categoryChartData = useMemo(() => {
    const source =
      selectedTransactions.length > 0
        ? selectedTransactions
        : filteredTransactions;

    const map = new Map<string, number>();
    source.forEach((t) => {
      const key = t.category || "Other";
      const prev = map.get(key) || 0;
      map.set(key, prev + t.amount);
    });

    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value: Math.abs(value), // absolute spend
    }));
  }, [selectedTransactions, filteredTransactions]);

  const dailyChartData = useMemo(() => {
    const source =
      selectedTransactions.length > 0
        ? selectedTransactions
        : filteredTransactions;

    const map = new Map<string, number>();

    source.forEach((t) => {
      const isoDay = t.date.slice(0, 10); // YYYY-MM-DD
      const prev = map.get(isoDay) || 0;
      map.set(isoDay, prev + t.amount);
    });

    const arr = Array.from(map.entries()).map(([isoDay, value]) => ({
      isoDay,
      label: new Date(isoDay).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      value,
    }));

    arr.sort((a, b) => (a.isoDay < b.isoDay ? -1 : 1));
    return arr;
  }, [selectedTransactions, filteredTransactions]);

  // ---------- CSV + AI actions ----------

  const handleDownloadCsv = () => {
    if (selectedTransactions.length === 0) return;

    const header = ["id", "date", "merchant", "category", "location", "amount"];
    const rows = selectedTransactions.map((t) => [
      t.id,
      new Date(t.date).toISOString(),
      t.merchant,
      t.category,
      t.location,
      t.amount,
    ]);

    const csvLines = [
      header.join(","),
      ...rows.map((r) =>
        r
          .map((v) => {
            const s = String(v ?? "");
            return `"${s.replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];

    const blob = new Blob([csvLines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "selected-transactions.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAiSummary = async () => {
    if (selectedTransactions.length === 0) return;

    setAiLoading(true);
    setAiError(null);
    setAiSummary(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions/summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions: selectedTransactions }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAiError(
          data.message || `AI summary failed with status ${res.status}`
        );
        return;
      }

      setAiSummary(data.summary || "No summary returned.");
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Error generating AI summary");
    } finally {
      setAiLoading(false);
    }
  };

  const buttonsDisabled = selectedTransactions.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1 flex flex-col items-center py-10 md:py-16">
        <div className="w-[90%] md:w-[70%] mx-auto space-y-10 md:space-y-12">
          <section className="bg-gradient-to-r from-blaze/5 via-white to-prussian/5 rounded-3xl shadow-lg px-5 py-8 md:px-10 md:py-10">
            <div className="flex flex-col md:flex-row gap-10">
              {/* LEFT: TRANSACTIONS / QUERY PANEL */}
              <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow p-5 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Transactions</h2>
                  <div className="flex gap-2">
                    {[
                      { label: "Y", value: "Y" as Period, tooltip: "Year" },
                      {
                        label: "S",
                        value: "S" as Period,
                        tooltip: "Semester (last 4 months)",
                      },
                      { label: "M", value: "M" as Period, tooltip: "Month" },
                    ].map((b) => (
                      <button
                        key={b.value}
                        type="button"
                        title={b.tooltip}
                        onClick={() => setPeriod(b.value)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                          period === b.value
                            ? "bg-prussian text-white"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-[0.18em]">
                    Filters
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Category</span>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="text-xs border border-slate-300 rounded-xl px-2 py-1 bg-white"
                    >
                      <option value="all">All</option>
                      {allCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* List */}
                <div className="border border-slate-100 rounded-2xl p-3 flex-1 flex flex-col">
                  {loading && (
                    <p className="text-xs text-slate-500 py-4">
                      Loading transactions...
                    </p>
                  )}
                  {error && !loading && (
                    <p className="text-xs text-rose-500 py-4">{error}</p>
                  )}
                  {!loading && !error && (
                    <>
                      <div className="flex items-center justify-between mb-2 text-[11px] text-slate-500">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={allVisibleSelected}
                            onChange={toggleSelectAllVisible}
                          />
                          <span>Select all</span>
                        </div>
                        <span>
                          Showing {filteredTransactions.length} of{" "}
                          {transactions.length}
                        </span>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {filteredTransactions.map((t) => (
                          <label
                            key={t.id}
                            className="flex items-center justify-between gap-2 p-2 border rounded-xl text-xs hover:bg-slate-50 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedIds.has(t.id)}
                                onChange={() => toggleSelected(t.id)}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {t.merchant}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  {t.category} •{" "}
                                  {new Date(t.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span
                                className={`font-semibold ${
                                  t.amount < 0
                                    ? "text-rose-500"
                                    : "text-emerald-600"
                                }`}
                              >
                                {t.amount < 0 ? "-" : "+"}$
                                {Math.abs(t.amount).toFixed(2)}
                              </span>
                              <div className="text-[11px] text-slate-400">
                                {t.location}
                              </div>
                            </div>
                          </label>
                        ))}
                        {filteredTransactions.length === 0 && (
                          <p className="text-xs text-slate-500 py-4">
                            No transactions match this filter.
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* AI summary box (only once used / error) */}
                {(aiLoading || aiSummary || aiError) && (
                  <div className="mt-4 w-full min-h-[96px] border rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-700">
                    {aiLoading && (
                      <p className="text-slate-500">
                        Generating AI summary of selected transactions...
                      </p>
                    )}
                    {aiError && !aiLoading && (
                      <p className="text-rose-500">{aiError}</p>
                    )}
                    {aiSummary && !aiLoading && !aiError && (
                      <div className="space-y-1">
                        {aiSummary.split("\n").map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleDownloadCsv}
                    disabled={buttonsDisabled}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border border-prussian ${
                      buttonsDisabled
                        ? "bg-prussian/40 text-white cursor-not-allowed"
                        : "bg-prussian text-white hover:bg-prussian/90"
                    }`}
                  >
                    Download Data
                  </button>
                  <button
                    type="button"
                    onClick={handleAiSummary}
                    disabled={buttonsDisabled}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border border-blaze ${
                      buttonsDisabled
                        ? "bg-blaze/40 text-white cursor-not-allowed"
                        : "bg-blaze text-white hover:bg-blaze/90"
                    }`}
                  >
                    AI Summary
                  </button>
                </div>
              </div>

              {/* RIGHT: charts driven by filtered/selected data */}
              <div className="flex-1 flex flex-col space-y-6">
                <div className="w-full h-64 bg-white rounded-3xl shadow border p-4">
                  <h3 className="font-medium mb-2 text-sm">
                    Spend by category
                  </h3>
                  {categoryChartData.length === 0 ? (
                    <p className="text-xs text-slate-500 mt-6">
                      No data to visualize for this selection.
                    </p>
                  ) : (
                    <div className="w-full h-[210px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryChartData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={80}
                            label
                          >
                            {categoryChartData.map((_, i) => (
                              <Cell
                                key={i}
                                fill={pieColors[i % pieColors.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                <div className="w-full h-64 bg-white rounded-3xl shadow border p-4">
                  <h3 className="font-medium mb-2 text-sm">Trend over time</h3>
                  {dailyChartData.length === 0 ? (
                    <p className="text-xs text-slate-500 mt-6">
                      No data to visualize for this selection.
                    </p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dailyChartData}
                        margin={{ top: 10, right: 20, bottom: 20, left: 0 }}
                      >
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#4f46e5"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BalanceAnalysisPage;
