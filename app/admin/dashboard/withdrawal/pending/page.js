// "use client";

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { CheckCircle, Loader2, Search, XCircle } from "lucide-react";
// import { useCallback, useEffect, useState } from "react";

// // api connection
// const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";
// const token =
//   typeof window !== "undefined" ? localStorage.getItem("token") : null;

// // 🔄 Reusable Component
// function WithdrawTable({ type }) {
//   const [withdraws, setWithdraws] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [actionLoading, setActionLoading] = useState(null);
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // Debounce Search
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(search);
//       setPage(1);
//     }, 500);
//     return () => clearTimeout(handler);
//   }, [search]);

//   const fetchWithdraws = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${API_BASE}/${type}withdrawal?search=${debouncedSearch}&page=${page}&limit=5`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setWithdraws(res.data.withdraws || []);
//       setTotalPages(res.data.totalPages || 1);
//     } catch (err) {
//       console.error("Error loading withdraws:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [debouncedSearch, page, type]);

//   useEffect(() => {
//     fetchWithdraws();
//   }, [fetchWithdraws]);

//   // Highlight
//   const highlight = (text) => {
//     if (!debouncedSearch) return text;
//     const regex = new RegExp(`(${debouncedSearch})`, "gi");
//     return text.split(regex).map((part, i) =>
//       part.toLowerCase() === debouncedSearch.toLowerCase() ? (
//         <mark
//           key={i}
//           className="bg-yellow-300 dark:bg-yellow-600 dark:text-black"
//         >
//           {part}
//         </mark>
//       ) : (
//         part
//       )
//     );
//   };

//   // Approve / Reject
//   const handleAction = async (id, action) => {
//     setActionLoading(id + action);
//     try {
//       const endpoint =
//         action === "approve"
//           ? `${API_BASE}/approvewithdraw/${id}`
//           : `${API_BASE}/rejectwithdraw/${id}`;

//       const res = await axios.patch(
//         endpoint,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert(res.data.message || `${action} successful`);
//       fetchWithdraws();
//     } catch (error) {
//       console.error(`${action} error:`, error);
//       alert(error.response?.data?.message || "Server error");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   return (
//     <div className="text-gray-900 dark:text-gray-100">
//       {/* Search */}
//       <div className="flex items-center mb-4">
//         <div className="relative w-full max-w-md">
//           <input
//             type="text"
//             placeholder="Search by name, email, phone, account..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full rounded-xl border px-4 py-2 pl-10 shadow-sm 
//                        focus:outline-none focus:ring-2 focus:ring-blue-500 
//                        bg-white dark:bg-gray-800 dark:text-gray-100 
//                        dark:border-gray-700 dark:placeholder-gray-400"
//           />
//           <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//         </div>
//       </div>

//       {/* Desktop Table */}
//       <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow-md">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-100 dark:bg-gray-800 text-left">
//             <tr>
//               <th className="px-4 py-2">User</th>
//               <th className="px-4 py-2">Amount</th>
//               <th className="px-4 py-2">Method</th>
//               <th className="px-4 py-2">Account</th>
//               <th className="px-4 py-2">Requested At</th>
//               <th className="px-4 py-2 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="6" className="text-center py-6">
//                   <Loader2 className="animate-spin h-6 w-6 mx-auto text-gray-400" />
//                 </td>
//               </tr>
//             ) : withdraws.length > 0 ? (
//               withdraws.map((w) => (
//                 <motion.tr
//                   key={w._id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
//                 >
//                   <td className="px-4 py-2">
//                     <div className="font-semibold">
//                       {highlight(w.userId.firstName + " " + w.userId.lastName)}
//                     </div>
//                     <div className="text-gray-500 dark:text-gray-400">
//                       {highlight(w.userId.email)}
//                     </div>
//                     <div className="text-gray-400 text-xs">
//                       {highlight(w.userId.phone)}
//                     </div>
//                   </td>
//                   <td className="px-4 py-2 font-bold text-red-500">
//                     ৳ {w.amount}
//                   </td>
//                   <td className="px-4 py-2">{highlight(w.method)}</td>
//                   <td className="px-4 py-2">{highlight(w.accountNumber)}</td>
//                   <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
//                     {new Date(w.createdAt).toLocaleString()}
//                   </td>
//                   <td className="px-4 py-2 text-center flex gap-2 justify-center">
//                     {type === "pending" && (
//                       <>
//                         <button
//                           onClick={() => handleAction(w._id, "approve")}
//                           disabled={actionLoading === w._id + "approve"}
//                           className="flex items-center gap-1 px-3 py-1 rounded-lg 
//                                      bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
//                         >
//                           {actionLoading === w._id + "approve" ? (
//                             <Loader2 className="h-4 w-4 animate-spin" />
//                           ) : (
//                             <CheckCircle className="h-4 w-4" />
//                           )}
//                           Approve
//                         </button>
//                         <button
//                           onClick={() => handleAction(w._id, "reject")}
//                           disabled={actionLoading === w._id + "reject"}
//                           className="flex items-center gap-1 px-3 py-1 rounded-lg 
//                                      bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
//                         >
//                           {actionLoading === w._id + "reject" ? (
//                             <Loader2 className="h-4 w-4 animate-spin" />
//                           ) : (
//                             <XCircle className="h-4 w-4" />
//                           )}
//                           Reject
//                         </button>
//                       </>
//                     )}
//                   </td>
//                 </motion.tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="6"
//                   className="text-center py-6 text-gray-500 dark:text-gray-400"
//                 >
//                   No {type} withdrawals found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Cards */}
//       <div className="grid gap-4 md:hidden">
//         {loading ? (
//           <div className="flex justify-center py-6">
//             <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
//           </div>
//         ) : withdraws.length > 0 ? (
//           withdraws.map((w) => (
//             <motion.div
//               key={w._id}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="rounded-xl border p-4 bg-white dark:bg-gray-900 dark:border-gray-700 shadow"
//             >
//               <div className="font-semibold">
//                 {highlight(w.userId.firstName + " " + w.userId.lastName)}
//               </div>
//               <div className="text-gray-500 dark:text-gray-400">
//                 {highlight(w.userId.email)}
//               </div>
//               <div className="text-gray-400 text-xs mb-2">
//                 {highlight(w.userId.phone)}
//               </div>

//               <div className="flex justify-between text-sm mb-2">
//                 <span className="font-bold text-red-500">৳ {w.amount}</span>
//                 <span>{highlight(w.method)}</span>
//               </div>
//               <div className="text-gray-500 text-xs">
//                 Acc: {highlight(w.accountNumber)}
//               </div>
//               <div className="text-gray-400 text-xs mb-3">
//                 {new Date(w.createdAt).toLocaleString()}
//               </div>

//               {type === "pending" && (
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleAction(w._id, "approve")}
//                     disabled={actionLoading === w._id + "approve"}
//                     className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg 
//                                bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
//                   >
//                     {actionLoading === w._id + "approve" ? (
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                     ) : (
//                       <CheckCircle className="h-4 w-4" />
//                     )}
//                     Approve
//                   </button>
//                   <button
//                     onClick={() => handleAction(w._id, "reject")}
//                     disabled={actionLoading === w._id + "reject"}
//                     className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg 
//                                bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
//                   >
//                     {actionLoading === w._id + "reject" ? (
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                     ) : (
//                       <XCircle className="h-4 w-4" />
//                     )}
//                     Reject
//                   </button>
//                 </div>
//               )}
//             </motion.div>
//           ))
//         ) : (
//           <div className="text-center py-6 text-gray-500 dark:text-gray-400">
//             No {type} withdrawals found
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => setPage((p) => Math.max(1, p - 1))}
//           disabled={page === 1}
//           className="px-4 py-2 rounded-lg border dark:border-gray-700 disabled:opacity-50 
//                      bg-white dark:bg-gray-800"
//         >
//           Prev
//         </button>
//         <span className="text-gray-700 dark:text-gray-300">
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//           disabled={page === totalPages}
//           className="px-4 py-2 rounded-lg border dark:border-gray-700 disabled:opacity-50 
//                      bg-white dark:bg-gray-800"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// export default function WithdrawPage() {
//   return (
//     <div className="p-4 md:p-6 text-gray-900 dark:text-gray-100">
//       <h1 className="text-2xl font-bold mb-6">💳 Withdrawals</h1>
//       <Tabs defaultValue="pending" className="w-full">
//         <TabsList className="grid grid-cols-3 max-w-md mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl">
//           <TabsTrigger value="pending">🟡 Pending</TabsTrigger>
//           <TabsTrigger value="approved">🟢 Approved</TabsTrigger>
//           <TabsTrigger value="rejected">🔴 Rejected</TabsTrigger>
//         </TabsList>

//         <TabsContent value="pending">
//           <WithdrawTable type="pending" />
//         </TabsContent>
//         <TabsContent value="approved">
//           <WithdrawTable type="approved" />
//         </TabsContent>
//         <TabsContent value="rejected">
//           <WithdrawTable type="rejected" />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }













"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, Search, XCircle } from "lucide-react";
import Image from "next/image";
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
      const res = await axios.get(
        `${API_BASE}/${type}withdrawal?search=${debouncedSearch}&page=${page}&limit=5`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWithdraws(res.data.withdraws || []);
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

  // Highlight
  const highlight = (text) => {
    if (!debouncedSearch) return text;
    const regex = new RegExp(`(${debouncedSearch})`, "gi");
    return text.split(regex).map((part, i) =>
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

  // Approve / Reject
  const handleAction = async (id, action) => {
    setActionLoading(id + action);
    try {
      const endpoint =
        action === "approve"
          ? `${API_BASE}/approvewithdraw/${id}`
          : `${API_BASE}/rejectwithdraw/${id}`;

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
                  className={`border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 ${rowBgClass(type)}`}
                >
                  <td className="px-4 py-2 flex items-center gap-2">
                    <div className="w-8 h-8 relative rounded-full overflow-hidden">
                      <Image
                        src={w.userId.image || "/default-avatar.png"}
                        alt={w.userId.firstName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold">
                        {highlight(w.userId.firstName + " " + w.userId.lastName)}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {highlight(w.userId.email)}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {highlight(w.userId.phone)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 font-bold text-red-500">৳ {w.amount}</td>
                  <td className="px-4 py-2">{highlight(w.method)}</td>
                  <td className="px-4 py-2">{highlight(w.accountNumber)}</td>
                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    {new Date(w.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-center flex gap-2 justify-center">
                    {type === "pending" && (
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
                    )}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No {type} withdrawals found
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
                <div className="w-10 h-10 relative rounded-full overflow-hidden">
                  <Image
                    src={w.userId.image || "/default-avatar.png"}
                    alt={w.userId.firstName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold">{highlight(w.userId.firstName + " " + w.userId.lastName)}</div>
                  <div className="text-gray-500 dark:text-gray-400">{highlight(w.userId.email)}</div>
                  <div className="text-gray-400 text-xs">{highlight(w.userId.phone)}</div>
                </div>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-red-500">৳ {w.amount}</span>
                <span>{highlight(w.method)}</span>
              </div>
              <div className="text-gray-500 text-xs mb-1">Acc: {highlight(w.accountNumber)}</div>
              <div className="text-gray-400 text-xs mb-3">{new Date(w.createdAt).toLocaleString()}</div>

              {type === "pending" && (
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
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            No {type} withdrawals found
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg border dark:border-gray-700 disabled:opacity-50 
                     bg-white dark:bg-gray-800"
        >
          Prev
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 rounded-lg border dark:border-gray-700 disabled:opacity-50 
                     bg-white dark:bg-gray-800"
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
          <TabsTrigger value="pending">🟡 Pending</TabsTrigger>
          <TabsTrigger value="approved">🟢 Approved</TabsTrigger>
          <TabsTrigger value="rejected">🔴 Rejected</TabsTrigger>
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
