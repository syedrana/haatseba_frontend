// 'use client';

// export default function DashboardHome() {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Welcome to Dashboard 🎉</h2>
//       <p className="text-gray-700">Here you can see your summary.</p>
//     </div>
//   );
// }



"use client";

import axios from "axios";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Network,
  RefreshCw,
  TrendingUp,
  Users,
  Wallet as WalletIcon
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

/**
 * ENV SETUP (frontend)
 * =====================
 * Create .env.local with
 *   NEXT_PUBLIC_API_BASE=http://localhost:7000
 * Or your deployed API base, e.g.
 *   NEXT_PUBLIC_API_BASE=https://api.yourdomain.com
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";

// ---- Helpers
const currency = (n) => new Intl.NumberFormat(undefined, { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(Number(n || 0));
const shortDate = (d) => new Date(d).toLocaleString();

// Attempt to read token (adjust this if you store token differently)
function getAccessToken() {
  try {
    // Example: localStorage.setItem("access_token", token)
    const ls = typeof window !== "undefined" ? window.localStorage : null;
    return ls?.getItem("access_token") || "";
  } catch {
    return "";
  }
}

// ---- Skeleton components
function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur p-4 shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
      <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-4" />
      <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 backdrop-blur">
      <div className="grid grid-cols-4 gap-4 p-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
        <div>Type</div>
        <div>Amount</div>
        <div>Status</div>
        <div>Date</div>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    walletBalance: 0,
    transactions: [],
    directReferrals: 0,
    downlineCount: 0,
    currentLevel: 0,
    totalBonus: 0,
  });

  async function fetchDashboard() {
  setLoading(true);
  setError("");
  try {
    const token = localStorage.getItem("token"); // বা cookies থেকে নাও
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/userdashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // axios এ res.ok নাই, সরাসরি status চেক করতে হবে
    if (res.status !== 200) {
      throw new Error(res.data?.message || `Failed to load (${res.status})`);
    }

    setData(res.data); // ✅ res.json লাগবে না
  } catch (e) {
    setError(e.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  fetchDashboard();
}, []);

  const chartData = useMemo(() => {
    // Build a simple trend from transactions (last 10 by createdAt)
    const tx = (data?.transactions || [])
      .slice()
      .reverse()
      .map((t, idx) => ({
        name: idx + 1,
        amount: Number(t?.amount || 0),
      }));
    return tx.length ? tx : [
      { name: 1, amount: 0 },
      { name: 2, amount: 0 },
      { name: 3, amount: 0 },
      { name: 4, amount: 0 },
    ];
  }, [data]);

  return (
    <div className="min-h-[calc(100vh-4rem)] md:min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 p-4 md:p-6">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Welcome back 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Here&apos;s a quick snapshot of your account today.</p>
        </div>
        <button
          onClick={fetchDashboard}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90 transition shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-6">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            {/* Wallet Balance */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur p-5 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Wallet Balance</span>
                <WalletIcon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-semibold mt-2">{currency(data.walletBalance)}</div>
              <div className="text-xs text-gray-400 mt-1">Available to use</div>
            </motion.div>

            {/* Total Bonus */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur p-5 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total Bonus</span>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-semibold mt-2">{currency(data.totalBonus)}</div>
              <div className="text-xs text-gray-400 mt-1">Lifetime earnings</div>
            </motion.div>

            {/* Direct Referrals */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur p-5 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Direct Referrals</span>
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-semibold mt-2">{data.directReferrals}</div>
              <div className="text-xs text-gray-400 mt-1">People you directly referred</div>
            </motion.div>

            {/* Network Size / Level */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur p-5 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Network</span>
                <Network className="w-5 h-5 text-gray-400" />
              </div>
              <div className="mt-2 flex items-end gap-4">
                <div>
                  <div className="text-2xl font-semibold">{data.downlineCount}</div>
                  <div className="text-xs text-gray-400">Total downline</div>
                </div>
                <div>
                  <div className="text-xl font-semibold">Lv. {data.currentLevel}</div>
                  <div className="text-xs text-gray-400">Your level</div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Chart + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-5 mb-6">
        <div className="xl:col-span-2 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 backdrop-blur p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Transactions Trend</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Based on your last activities</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ReTooltip />
                <Line type="monotone" dataKey="amount" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 backdrop-blur p-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Status</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Account Active</div>
                <div className="text-gray-500 dark:text-gray-400">You&apos;re good to go.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Last Sync</div>
                <div className="text-gray-500 dark:text-gray-400">{shortDate(new Date())}</div>
              </div>
            </div>
            {!!error && (
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Fetch Error</div>
                  <div className="text-gray-500 dark:text-gray-400">{error}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Latest Transactions</h3>
          <div className="text-xs text-gray-500 dark:text-gray-400">Showing up to 10 recent items</div>
        </div>
        {loading ? (
          <TableSkeleton />
        ) : (
          <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 backdrop-blur">
            <div className="grid grid-cols-4 gap-4 p-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
              <div>Type</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Date</div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              <AnimatePresence initial={false}>
                {(data?.transactions || []).map((t, idx) => (
                  <motion.div
                    key={t?._id || idx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-4 gap-4 p-4 text-sm"
                  >
                    <div className="flex items-center gap-2 font-medium text-gray-800 dark:text-gray-100">
                      {String(t?.type || "-")}
                      {String(t?.type || "").toLowerCase().includes("deposit") ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-rose-500" />
                      )}
                    </div>
                    <div className="text-gray-700 dark:text-gray-200">{currency(t?.amount)}</div>
                    <div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                        ${t?.status === "success" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" :
                          t?.status === "pending" ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" :
                          "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"}`}
                      >
                        {String(t?.status || "-")}
                      </span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">{shortDate(t?.createdAt)}</div>
                  </motion.div>
                ))}

                {!data?.transactions?.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No transactions found.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
