"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, Search, XCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";



// api connection
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";
const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

// 🔄 Reusable Component
function WithdrawTable({ type }) {
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  // ✅ Safe highlight function
  const highlight = (text) => {
    if (text === null || text === undefined) return "";
    if (!debouncedSearch) return text;
    const regex = new RegExp(`(${debouncedSearch})`, "gi");
    return text.toString().split(regex).map((part, i) =>
      part.toLowerCase() === debouncedSearch.toLowerCase() ? (
        <mark
          key={i}
          className="bg-yellow-300 dark:bg-yellow-600 dark:text-black"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchWithdraws = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint =
        type === "pending"
          ? `${API_BASE}/pendingusers`
          : type === "approved"
          ? `${API_BASE}/approvedusers`
          : `${API_BASE}/rejectedusers`;

      const res = await axios.get(
        `${endpoint}?search=${debouncedSearch}&page=${page}&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWithdraws(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error loading withdraws:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, type]);

  useEffect(() => {
    fetchWithdraws();
  }, [fetchWithdraws]);

  // Approve / Reject
  const handleAction = async (id, action) => {
    setActionLoading(id + action);
    try {
      const endpoint =
        action === "approve"
          ? `${API_BASE}/approveuser/${id}`
          : `${API_BASE}/rejectuser/${id}`;

      const res = await axios.patch(
        endpoint,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || `${action} successful`);
      fetchWithdraws();
    } catch (error) {
      console.error(`${action} error:`, error);
      alert(error.response?.data?.message || "Server error");
    } finally {
      setActionLoading(null);
    }
  };

  // Row background for Approved / Rejected
  const rowBgClass = (type) => {
    if (type === "approved") return "bg-green-50 dark:bg-green-900/50";
    if (type === "rejected") return "bg-red-50 dark:bg-red-900/50";
    return "";
  };

  

  return (
    <div className="text-gray-900 dark:text-gray-100">
      {/* Search */}
      <div className="flex items-center mb-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by name, email, phone, account..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border px-4 py-2 pl-10 shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       bg-white dark:bg-gray-800 dark:text-gray-100 
                       dark:border-gray-700 dark:placeholder-gray-400"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-left">
            <tr>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Requested At</th>
              <th className="px-4 py-2">Referral</th>
              <th className="px-4 py-2">Position</th>
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
                  className={`border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 ${rowBgClass(type)}`}
                >
                  <td className="px-4 py-2 flex items-center gap-2">
                    {/* Avatar */}
                    <div className="w-8 h-8 relative rounded-full overflow-hidden shadow-md dark:shadow-gray-700 transform transition-transform duration-300 hover:scale-110">
                      <Image
                        src={w?.image || "/default-avatar.png"}
                        alt={w?.firstName || "User"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold">
                        {highlight(`${w?.firstName || ""} ${w?.lastName || ""}`)}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {highlight(w?.email)}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {highlight(w?.phone)}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">
                        {highlight(
                          w?.isEmailVerified
                            ? "✅ Email verification completed."
                            : "⚠️ Email verification not completed."
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">{highlight(w?.address)}</td>
                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(w?.createdAt))}
                  </td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <div className="w-8 h-8 relative rounded-full overflow-hidden shadow-md dark:shadow-gray-700 transform transition-transform duration-300 hover:scale-110">
                      <Image
                        src={w?.parentId?.image || "/default-avatar.png"}
                        alt={w?.parentId?.firstName || "Parent"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold">
                        {highlight(
                          `${w?.parentId?.firstName || ""} ${w?.parentId?.lastName || ""}`
                        )}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {highlight(w?.parentId?.email || "")}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {highlight(w?.parentId?.phone || "")}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {highlight(w?.parentId?.placementPosition || "")}
                  </td>
                  <td className="px-4 py-2 text-center flex gap-2 justify-center">
                    {type === "pending" ? (
                      <>
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
                      </>
                    ): type === "approved" ? (
                      <>
                        {/* 🧾 Details Button */}
                        <button
                          onClick={() => router.push(`/admin/dashboard/details/${w._id}`)}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Details
                        </button>

                        {/* 🌳 Tree Button */}
                        <button
                          onClick={() => router.push(`/admin/dashboard/tree/${w._id}`)}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500 text-white hover:bg-amber-600"
                        >
                          🌳 Tree
                        </button>
                      </>
                    ) : null}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No {type} users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
          </div>
        ) : withdraws.length > 0 ? (
          withdraws.map((w) => (
            <motion.div
              key={w._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border p-4 bg-white dark:bg-gray-900 dark:border-gray-700 shadow ${rowBgClass(type)}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 relative rounded-full overflow-hidden shadow-md dark:shadow-gray-700 transform transition-transform duration-300 hover:scale-110">
                  <Image
                    src={w.image || "/default-avatar.png"}
                    alt={w.firstName || "User"}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <div className="font-semibold">{highlight(`${w.firstName || ""} ${w.lastName || ""}`)}</div>
                  <div className="text-gray-500 dark:text-gray-400">{highlight(w.email || "")}</div>
                  <div className="text-gray-400 text-xs">{highlight(w.phone || "")}</div>
                  <div className="text-gray-500 text-xs dark:text-gray-400">{highlight(w.address || "")}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 relative rounded-full overflow-hidden shadow-md dark:shadow-gray-700 transform transition-transform duration-300 hover:scale-110">
                  <Image
                    src={w.parentId?.image || "/default-avatar.png"}
                    alt={w.parentId?.firstName || "Parent"}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <div className="font-semibold">{highlight(`${w.parentId?.firstName || ""} ${w.parentId?.lastName || ""}`)}</div>
                  <div className="text-gray-500 dark:text-gray-400">{highlight(w.parentId?.email || "")}</div>
                  <div className="text-gray-400 text-xs">{highlight(w.parentId?.phone || "")}</div>
                </div>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span>Position :</span> <span className="font-bold text-red-500">{highlight(w.parentId?.placementPosition || "")}</span>
              </div>
              <div className="text-gray-500 text-xs mb-1">
                {highlight(
                  w.isEmailVerified
                    ? "✅ Email verification completed."
                    : "⚠️ Email verification not completed."
                )}
              </div>
              <div className="text-gray-400 text-xs mb-3">
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(w.createdAt))}
              </div>

              {/* {type === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(w._id, "approve")}
                    disabled={actionLoading === w._id + "approve"}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
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
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {actionLoading === w._id + "reject" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    Reject
                  </button>
                </div>
              )} */}
              {type === "pending" ? (
                <>
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
                </>
              ): type === "approved" ? (
                <>
                  {/* 🧾 Details Button */}
                  <button
                    onClick={() => router.push(`/admin/dashboard/details/${w._id}`)}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Details
                  </button>

                  {/* 🌳 Tree Button */}
                  <button
                    onClick={() => router.push(`/admin/dashboard/tree/${w._id}`)}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500 text-white hover:bg-amber-600"
                  >
                    🌳 Tree
                  </button>
                </>
              ) : null}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            No {type} users found
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg border dark:border-gray-700 disabled:opacity-50 bg-white dark:bg-gray-800"
        >
          Prev
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 rounded-lg border dark:border-gray-700 disabled:opacity-50 bg-white dark:bg-gray-800"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function WithdrawPage() {
  return (
    <div className="p-4 md:p-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">💳 Withdrawals</h1>
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid grid-cols-3 max-w-md mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <WithdrawTable type="pending" />
        </TabsContent>
        <TabsContent value="approved">
          <WithdrawTable type="approved" />
        </TabsContent>
        <TabsContent value="rejected">
          <WithdrawTable type="rejected" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
