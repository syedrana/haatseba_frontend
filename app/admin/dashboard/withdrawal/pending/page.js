"use client";

import { motion } from "framer-motion";
import { CheckCircle, Loader2, Search, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function PendingWithdrawPage() {
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // store id when approving/rejecting
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchWithdraws = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/withdraws/pending?search=${search}&page=${page}&limit=10`);
      const data = await res.json();
      setWithdraws(data.withdraws || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error loading withdraws:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWithdraws();
  }, [search, page]);

  // highlight function
  const highlight = (text) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-yellow-300">{part}</mark> : part
    );
  };

  // 🟢 Approve / 🔴 Reject handlers
  const handleAction = async (id, action) => {
    setActionLoading(id + action);
    try {
      const res = await fetch(`/api/admin/withdraws/${id}/${action}`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || `${action} successful`);
        fetchWithdraws(); // refresh
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(`${action} error:`, error);
      alert("Server error");
    }
    setActionLoading(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🟡 Pending Withdrawals</h1>

      {/* Search bar */}
      <div className="flex items-center mb-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by name, email, phone, account..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border px-4 py-2 pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Method</th>
              <th className="px-4 py-2">Account</th>
              <th className="px-4 py-2">Requested At</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  <Loader2 className="animate-spin h-6 w-6 mx-auto text-gray-400" />
                </td>
              </tr>
            ) : withdraws.length > 0 ? (
              withdraws.map((w) => (
                <motion.tr
                  key={w._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-2">
                    <div className="font-semibold">{highlight(w.userId.firstName + " " + w.userId.lastName)}</div>
                    <div className="text-gray-500">{highlight(w.userId.email)}</div>
                    <div className="text-gray-400 text-xs">{highlight(w.userId.phone)}</div>
                  </td>
                  <td className="px-4 py-2 font-bold text-red-500">৳ {w.amount}</td>
                  <td className="px-4 py-2">{highlight(w.method)}</td>
                  <td className="px-4 py-2">{highlight(w.accountNumber)}</td>
                  <td className="px-4 py-2 text-gray-500">
                    {new Date(w.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => handleAction(w._id, "approve")}
                      disabled={actionLoading === w._id + "approve"}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                    >
                      {actionLoading === w._id + "approve" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(w._id, "reject")}
                      disabled={actionLoading === w._id + "reject"}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      {actionLoading === w._id + "reject" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      Reject
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No pending withdrawals found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg border disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 rounded-lg border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
