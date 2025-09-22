"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";
const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

// helper: highlight search matches
function highlightText(text, search) {
  if (!search) return text;
  const regex = new RegExp(`(${search})`, "gi");
  const parts = String(text).split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-300 text-black dark:bg-yellow-500 dark:text-gray-900">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch Transactions
  const fetchTransactions = useCallback(
    async (page = 1) => {
      setLoading(true);

      const query = new URLSearchParams({
        page,
        limit: 10,
        search,
        type,
        category,
        status,
        startDate,
        endDate,
      });

      const res = await axios.get(
        `${API_BASE}/transaction?${query.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTransactions(res.data.data);
      setPagination(res.data.pagination);
      setLoading(false);
    },
    [search, type, category, status, startDate, endDate]
  );

  useEffect(() => {
    fetchTransactions(1);
  }, [fetchTransactions]);

  const applyFilters = () => {
    fetchTransactions(1);
  };

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Transactions</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 mb-4">
        <input
          type="text"
          placeholder="Search anything"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        >
          <option value="">All Types</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        >
          <option value="">All Categories</option>
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
          <option value="bonus">Bonus</option>
          <option value="transfer">Transfer</option>
          <option value="refund">Refund</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
      </div>

      <button
        onClick={applyFilters}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 dark:hover:bg-blue-500 transition"
      >
        Apply Filters
      </button>

      {/* Data */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-center">No transactions found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actor</th>
                    <th className="px-4 py-2">Balance</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition"
                      onClick={() => setSelected(tx)}
                    >
                      <td className="px-4 py-2">
                        {highlightText(
                          `${tx.userId?.firstName || ""} ${tx.userId?.lastName || ""}`,
                          search
                        )}
                      </td>
                      <td className="px-4 py-2 font-medium">
                        {highlightText(tx.amount, search)}
                      </td>
                      <td className="px-4 py-2">
                        {highlightText(tx.type, search)}
                      </td>
                      <td className="px-4 py-2">
                        {highlightText(tx.category, search)}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            tx.status === "completed"
                              ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                              : tx.status === "pending"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
                              : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                          }`}
                        >
                          {highlightText(tx.status, search)}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {highlightText(tx.actor, search)}
                      </td>
                      <td className="px-4 py-2">
                        {highlightText(tx.runningBalance, search)}
                      </td>
                      <td className="px-4 py-2">
                        {highlightText(
                          new Date(tx.createdAt).toLocaleString(),
                          search
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {transactions.map((tx) => (
              <div
                key={tx._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition cursor-pointer"
                onClick={() => setSelected(tx)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    {highlightText(
                      `${tx.userId?.firstName || ""} ${tx.userId?.lastName || ""}`,
                      search
                    )}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      tx.status === "completed"
                        ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                        : tx.status === "pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
                        : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                    }`}
                  >
                    {highlightText(tx.status, search)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {highlightText(tx.type, search)} • {highlightText(tx.category, search)}
                </p>
                <p className="text-lg font-bold mt-2">
                  {highlightText(tx.amount, search)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {highlightText(new Date(tx.createdAt).toLocaleString(), search)}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="flex flex-wrap gap-2 mt-4">
        {Array.from({ length: pagination.pages || 0 }, (_, i) => i + 1).map(
          (p) => (
            <button
              key={p}
              onClick={() => fetchTransactions(p)}
              className={`px-3 py-1 rounded-lg text-sm ${
                pagination.page === p
                  ? "bg-blue-600 text-white dark:bg-blue-500"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-gray-100"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded-xl w-11/12 max-w-md relative shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                onClick={() => setSelected(null)}
              >
                ✕
              </button>
              <h2 className="text-lg font-semibold mb-4">Transaction Details</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <b>User:</b> {selected.userId?.firstName} {selected.userId?.lastName}
                </p>
                <p>
                  <b>Amount:</b> {selected.amount}
                </p>
                <p>
                  <b>Type:</b> {selected.type}
                </p>
                <p>
                  <b>Category:</b> {selected.category}
                </p>
                <p>
                  <b>Status:</b> {selected.status}
                </p>
                <p>
                  <b>Actor:</b> {selected.actor}
                </p>
                <p>
                  <b>Description:</b> {selected.description || "N/A"}
                </p>
                <p>
                  <b>Processed At:</b>{" "}
                  {selected.processedAt
                    ? new Date(selected.processedAt).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  <b>IdempotencyKey:</b> {selected.idempotencyKey || "N/A"}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
