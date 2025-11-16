import React from "react";
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

// Dummy data
const pieData = [
  { name: "Food", value: 400 },
  { name: "Books", value: 300 },
  { name: "Events", value: 300 },
  { name: "Transport", value: 200 },
  { name: "Misc", value: 150 },
];

const pieColors = ["#4f46e5", "#22c55e", "#ef4444", "#eab308", "#06b6d4"];

const currentData = Array.from({ length: 12 }).map((_, i) => ({
  month: `M${i + 1}`,
  value: Math.random() * 100,
}));

const predictionData = Array.from({ length: 12 }).map((_, i) => ({
  month: `M${i + 1}`,
  optimal: Math.random() * 100,
  budget: Math.random() * 100,
  ai: Math.random() * 100,
}));

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center py-10 md:py-16">
        <div className="w-[90%] md:w-[70%] mx-auto space-y-10 md:space-y-12">
          {/* SECTION 1: TRANSACTIONS + PIE + CURRENT */}
          <section className="bg-gradient-to-r from-blaze/5 via-white to-prussian/5 rounded-3xl shadow-lg px-5 py-8 md:px-10 md:py-10">
            <div className="flex flex-col md:flex-row gap-10">
              {/* TRANSACTIONS PANEL */}
              <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow p-5">
                <h2 className="text-xl font-semibold mb-4">Transactions</h2>

                {/* FILTER BUTTONS */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded-xl bg-slate-200 hover:bg-slate-300">
                      S
                    </button>
                    <button className="px-3 py-1 rounded-xl bg-slate-200 hover:bg-slate-300">
                      D
                    </button>
                    <button className="px-3 py-1 rounded-xl bg-slate-200 hover:bg-slate-300">
                      Y
                    </button>
                  </div>

                  <button className="px-3 py-1 rounded-xl bg-slate-200 hover:bg-slate-300">
                    Categories
                  </button>
                </div>

                {/* Dummy Transaction Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <div className="p-3 border rounded-xl flex justify-between">
                    <span>Dining Hall</span>
                    <span className="font-semibold text-red-500">-$12.50</span>
                  </div>
                  <div className="p-3 border rounded-xl flex justify-between">
                    <span>Bookstore</span>
                    <span className="font-semibold text-red-500">-$45.00</span>
                  </div>
                  <div className="p-3 border rounded-xl flex justify-between">
                    <span>Cafe Latte</span>
                    <span className="font-semibold text-red-500">-$6.25</span>
                  </div>
                  <div className="p-3 border rounded-xl flex justify-between">
                    <span>Shuttle Transport</span>
                    <span className="font-semibold text-red-500">-$2.00</span>
                  </div>
                  <div className="p-3 border rounded-xl flex justify-between">
                    <span>Campus Event</span>
                    <span className="font-semibold text-red-500">-$15.00</span>
                  </div>
                </div>

                <div className="mt-4 w-full h-28 border rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 text-sm">
                  AI Summary will appear here...
                </div>

                {/* NEW BUTTONS */}
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                    Download Data
                  </button>

                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700">
                    AI Summary
                  </button>
                </div>
              </div>

              {/* RIGHT SIDE: PIE + CURRENT GRAPH */}
              <div className="flex-1 flex flex-col items-center space-y-8">
                {/* PIE */}
                <div className="w-80 h-80 bg-white rounded-2xl shadow border p-4">
                  <h3 className="font-medium mb-2">Pie</h3>
                  <div className="w-full h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          outerRadius={80}
                          label
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={pieColors[i]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* CURRENT */}
                <div className="w-full h-72 bg-white border rounded-3xl shadow p-4">
                  <h3 className="font-medium mb-2">Current</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={currentData}
                      margin={{ top: 10, right: 20, bottom: 20, left: 0 }}
                    >
                      <XAxis dataKey="month" interval={0} />
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
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: AI + BUDGET */}
          <section className="bg-gradient-to-r from-blaze/5 via-white to-prussian/5 rounded-3xl shadow-lg px-5 py-8 md:px-10 md:py-10">
            <div className="flex flex-col md:flex-row gap-10">
              {/* AI Prediction */}
              <div className="flex-1 h-72 bg-white border rounded-3xl shadow p-4">
                <h3 className="font-medium mb-2">
                  Prediction, Optimal, Budget
                </h3>

                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={predictionData}
                    margin={{ top: 10, right: 20, bottom: 20, left: 0 }}
                  >
                    <XAxis dataKey="month" interval={0} />
                    <YAxis />
                    <Tooltip />

                    <Line
                      dataKey="optimal"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />

                    <Line
                      dataKey="budget"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />

                    <Line
                      dataKey="ai"
                      stroke="#000000"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Budget */}
              <div className="w-80 h-72 bg-white border rounded-3xl shadow p-4 flex flex-col">
                <h2 className="font-semibold mb-3">Budget</h2>
                <div className="flex-1 border rounded-xl"></div>
                <p className="text-xs mt-2 text-slate-500">
                  Set weekly/monthly $/limit
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
