import React, { useEffect, useMemo, useState } from "react";
// import Navbar from "./Navbar";

type Transaction = {
  id: number;
  merchant: string;
  category: string;
  amount: number;
  location: string;
  date: string; // ISO string from backend
};

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) || "http://127.0.0.1:5000";

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/transactions/recent`);
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

  const { todayTotal, todayIn, todayOut } = useMemo(() => {
    const todaysTx = transactions.filter((t) => t.date.startsWith(today));
    const total = todaysTx.reduce((acc, t) => acc + t.amount, 0);
    const incoming = todaysTx
      .filter((t) => t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0);
    const outgoing = todaysTx
      .filter((t) => t.amount < 0)
      .reduce((acc, t) => acc + t.amount, 0);

    return { todayTotal: total, todayIn: incoming, todayOut: outgoing };
  }, [transactions, today]);

  const latest20 = transactions.slice(0, 20);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* <Navbar /> */}

      <main className="flex-1 flex flex-col items-center py-6 md:py-10">
        <div className="w-[90%] md:w-[70%] mx-auto space-y-6 md:space-y-8">
          {/* Top row: welcome + high-level summary */}
          <section className="bg-white rounded-3xl shadow-lg px-5 py-6 md:px-8 md:py-7 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Overview
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold text-prussian">
                Good afternoon, Syed
              </h1>
              <p className="text-sm text-slate-600">
                Here is your campus credit snapshot for today. Review balances,
                scan transactions, and keep an eye on upcoming student events.
              </p>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-3 text-xs">
              <div className="bg-blaze/10 rounded-2xl px-3 py-3">
                <p className="text-[11px] text-blaze font-semibold uppercase tracking-[0.18em]">
                  Current Balance
                </p>
                <p className="mt-1 text-lg font-semibold text-prussian">
                  $1,658.32
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Credit limit $4,250
                </p>
              </div>
              <div className="bg-prussian/10 rounded-2xl px-3 py-3">
                <p className="text-[11px] text-prussian font-semibold uppercase tracking-[0.18em]">
                  Credit Score
                </p>
                <p className="mt-1 text-lg font-semibold text-prussian">742</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Very good – keep it up.
                </p>
              </div>
              <div className="bg-emerald-50 rounded-2xl px-3 py-3">
                <p className="text-[11px] text-emerald-600 font-semibold uppercase tracking-[0.18em]">
                  Next Payment
                </p>
                <p className="mt-1 text-lg font-semibold text-prussian">
                  Nov 28
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Minimum due: $59.00
                </p>
              </div>
            </div>
          </section>

          {/* Main grid: left summary cards, middle transactions, right daily summary */}
          <section className="grid gap-6 md:gap-8 lg:grid-cols-[1.1fr,1.8fr,1.1fr]">
            {/* Left column – 3 cards */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-md p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Security
                </p>
                <h2 className="mt-1 text-sm font-semibold text-prussian">
                  Security questions & card controls
                </h2>
                <p className="mt-1 text-xs text-slate-600">
                  Review or refresh your security questions and temporarily
                  freeze or unfreeze your campus card in one place.
                </p>
                <button className="mt-3 text-xs font-semibold text-blaze underline underline-offset-2">
                  Manage security
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Rewards
                </p>
                <h2 className="mt-1 text-sm font-semibold text-prussian">
                  Campus cashback & bonuses
                </h2>
                <p className="mt-1 text-xs text-slate-600">
                  You&apos;re on track to unlock your next on-campus bonus this
                  month. Dining, bookstore, and event purchases all count.
                </p>
                <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-blaze to-prussian" />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  75% of bonus progress reached.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  On-campus events
                </p>
                <h2 className="mt-1 text-sm font-semibold text-prussian">
                  Tonight on campus
                </h2>
                <ul className="mt-1 space-y-1 text-xs text-slate-600">
                  <li>• Movie night at Student Center – $5 with your card</li>
                  <li>• Entrepreneurship meetup – free admission</li>
                  <li>• Late night dining promo – 10% back</li>
                </ul>
                <button className="mt-3 text-xs font-semibold text-blaze underline underline-offset-2">
                  View all events
                </button>
              </div>
            </div>

            {/* Middle column – transactions table */}
            <div className="bg-white rounded-2xl shadow-md p-4 md:p-5 flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Recent activity
                  </p>
                  <h2 className="mt-1 text-sm font-semibold text-prussian">
                    Last 20 transactions
                  </h2>
                </div>
                <button className="text-xs text-blaze underline underline-offset-2">
                  Export
                </button>
              </div>

              <div className="mt-3 border-t border-slate-100" />

              <div className="mt-2 overflow-x-auto">
                {loading && (
                  <p className="text-xs text-slate-500 py-4">
                    Loading transactions...
                  </p>
                )}
                {error && !loading && (
                  <p className="text-xs text-rose-500 py-4">{error}</p>
                )}
                {!loading && !error && (
                  <table className="w-full text-xs">
                    <thead className="text-slate-500">
                      <tr className="text-left">
                        <th className="py-2 pr-2">Date</th>
                        <th className="py-2 pr-2">Merchant</th>
                        <th className="py-2 pr-2 hidden md:table-cell">
                          Category
                        </th>
                        <th className="py-2 pr-2 hidden md:table-cell">
                          Location
                        </th>
                        <th className="py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latest20.map((t) => (
                        <tr
                          key={t.id}
                          className="border-t border-slate-100 last:border-b hover:bg-slate-50/60"
                        >
                          <td className="py-2 pr-2">
                            {new Date(t.date).toLocaleDateString()}
                          </td>
                          <td className="py-2 pr-2">{t.merchant}</td>
                          <td className="py-2 pr-2 hidden md:table-cell">
                            {t.category}
                          </td>
                          <td className="py-2 pr-2 hidden md:table-cell">
                            {t.location}
                          </td>
                          <td
                            className={`py-2 text-right font-semibold ${
                              t.amount < 0
                                ? "text-rose-500"
                                : "text-emerald-600"
                            }`}
                          >
                            {t.amount < 0 ? "-" : "+"}$
                            {Math.abs(t.amount).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Right column – daily summary */}
            <div className="bg-white rounded-2xl shadow-md p-4 md:p-5 flex flex-col gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Today&apos;s summary
                </p>
                <h2 className="mt-1 text-sm font-semibold text-prussian">
                  {new Date(today).toLocaleDateString()}
                </h2>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Money in</span>
                  <span className="font-semibold text-emerald-600">
                    ${todayIn.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Money out</span>
                  <span className="font-semibold text-rose-500">
                    ${Math.abs(todayOut).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-slate-100 pt-2 mt-2 flex justify-between">
                  <span className="text-slate-700 font-semibold">
                    Net for today
                  </span>
                  <span
                    className={`font-semibold ${
                      todayTotal >= 0
                        ? "text-emerald-600"
                        : "text-rose-500"
                    }`}
                  >
                    {todayTotal >= 0 ? "+" : "-"}$
                    {Math.abs(todayTotal).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-2 rounded-2xl bg-slate-50 p-3 text-[11px] text-slate-600">
                <p>
                  Keep daily spending below your smart budget line for a higher
                  chance of bonus rewards next month.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
