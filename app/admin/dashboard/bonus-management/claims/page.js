// "use client";

// import axios from "axios";
// import {
//   ChevronLeft,
//   ChevronRight
// } from "lucide-react";

// import Image from "next/image";
// import React, { useCallback, useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";

// // Status Badge UI
// function StatusBadge({ status }) {
//   const map = {
//     pending: "bg-yellow-100 text-yellow-800",
//     processing: "bg-orange-100 text-orange-800",
//     shipped: "bg-blue-100 text-blue-800",
//     delivered: "bg-green-100 text-green-800",
//     cancelled: "bg-red-100 text-red-800",
//     rejected: "bg-rose-100 text-rose-800",
//   };
//   const cls = map[status] || "bg-gray-100 text-gray-800";
//   return (
//     <span className={`px-2 py-1 rounded-md text-xs font-semibold ${cls}`}>
//       {status}
//     </span>
//   );
// }

// export default function AdminClaimsPage() {
//   const [claims, setClaims] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(12);
//   const [total, setTotal] = useState(0);
//   const [statusFilter, setStatusFilter] = useState("");

//   const [selected, setSelected] = useState(null);
//   const [actionLoading, setActionLoading] = useState(false);

//   const [showShipForm, setShowShipForm] = useState(false);
//   const [shipData, setShipData] = useState({ trackingNumber: "", courier: "" });

//   const [showModal, setShowModal] = useState(false);

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   // Fetch Claims
//   const fetchClaims = useCallback(
//     async (opts = {}) => {
//       setLoading(true);
//       try {
//         const params = {
//           page: opts.page ?? page,
//           limit,
//           status: opts.status ?? statusFilter,
//         };

//         const res = await axios.get(`${API_BASE}/claims`, {
//           headers: { Authorization: `Bearer ${token}` },
//           params,
//         });

//         setClaims(res.data.claims || []);
//         setTotal(res.data.total || 0);
//         setPage(Number(params.page));
//       } catch (err) {
//         toast.error("Failed to load claims");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [page, statusFilter, token, limit]
//   );

//   useEffect(() => {
//     fetchClaims({ page: 1 });
//   }, [fetchClaims]);

//   // Open Details Modal
//   const openDetails = (claim) => {
//     setSelected(claim);
//     setShowShipForm(false);
//     setShowModal(true);
//   };

//   // Generic Action
//   async function doAction(url, data = {}) {
//     if (!selected) return;
//     setActionLoading(true);

//     try {
//       const res = await axios.put(`${API_BASE}${url}/${selected._id}`, data, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success(res.data.message || "Success");
//       setShowModal(false);
//       await fetchClaims({ page });
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Action failed");
//     } finally {
//       setActionLoading(false);
//     }
//   }

//   // Action handlers
//   const approveClaim = async () => {
//     if (!confirm("Approve this claim?")) return;
//     await doAction("/claimsapprove");
//   };

//   const rejectClaim = async () => {
//     const note = prompt("Reject reason:", "");
//     if (note === null) return;
//     await doAction("/claimsreject", { adminNote: note });
//   };

//   const cancelClaim = async () => {
//     const note = prompt("Cancel reason:", "");
//     if (note === null) return;
//     await doAction("/claimscancel", { adminNote: note });
//   };

//   const shipped = async () => {
//     if (!shipData.trackingNumber || !shipData.courier) {
//       toast.error("Tracking & courier required");
//       return;
//     }
//     if (!confirm("Mark as shipped?")) return;
//     await doAction("/claimsshipped", shipData);
//     setShowShipForm(false);
//   };

//   const delivered = async () => {
//     if (!confirm("Mark as delivered?")) return;
//     await doAction("/claimsdelivered");
//   };

//   // Pagination
//   const totalPages = Math.max(1, Math.ceil(total / limit));
//   const gotoPage = (p) => fetchClaims({ page: p });

//   return (
//     <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
//       <Toaster />

//       <div className="max-w-7xl mx-auto space-y-4">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
//           <h1 className="text-2xl font-bold">🎁 Reward Claims</h1>

//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-3 py-2 rounded bg-white border"
//           >
//             <option value="">All</option>
//             <option value="pending">Pending</option>
//             <option value="processing">Processing</option>
//             <option value="shipped">Shipped</option>
//             <option value="delivered">Delivered</option>
//             <option value="cancelled">Cancelled</option>
//             <option value="rejected">Rejected</option>
//           </select>
//         </div>

//         {/* Claim List */}
//         <div className="bg-white shadow rounded-lg p-4 space-y-3">
//           {loading ? (
//             <div className="text-center p-5">Loading…</div>
//           ) : claims.length === 0 ? (
//             <div className="text-center p-5 text-gray-500">No claims found</div>
//           ) : (
//             claims.map((c) => (
//               <div
//                 key={c._id}
//                 className="p-3 bg-gray-50 rounded-md border flex justify-between items-center"
//               >
//                 <div>
//                   <div className="w-20 h-20 relative rounded-full overflow-hidden shadow-md dark:shadow-gray-700 transform transition-transform duration-300 hover:scale-110">
//                     <Image
//                       src={c.userId?.image || "/default-avatar.png"}
//                       alt={c.userId?.firstName || "User"}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <div className="font-medium">
//                     {c.userId?.firstName} {c.userId?.lastName}
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     {c.userId?.phone}
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     {c.userId?.email}
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     {c.bonusId?.bonusAmount || "Product Reward"}
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     Level: {c.bonusId?.level}
//                   </div>
//                 </div>
                
//                 <StatusBadge status={c.status} />

//                 <button
//                   onClick={() => openDetails(c)}
//                   className="px-2 py-1 bg-gray-200 rounded"
//                 >
//                   Details
//                 </button>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-center gap-3 items-center">
//           <button
//             disabled={page <= 1}
//             onClick={() => gotoPage(page - 1)}
//             className="px-2 py-1 bg-white border rounded disabled:opacity-40"
//           >
//             <ChevronLeft size={16} />
//           </button>

//           <span className="text-sm">
//             Page {page} / {totalPages}
//           </span>

//           <button
//             disabled={page >= totalPages}
//             onClick={() => gotoPage(page + 1)}
//             className="px-2 py-1 bg-white border rounded disabled:opacity-40"
//           >
//             <ChevronRight size={16} />
//           </button>
//         </div>
//       </div>

//       {/* MODAL */}
//       {showModal && selected && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg shadow-lg relative">

//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-2 right-2 text-xl"
//             >
//               ✖
//             </button>

//             <h2 className="text-xl font-bold mb-3">Claim Details</h2>

//             {/* User Info */}
//             <div className="flex items-start gap-4">
//               <div className="w-20 h-20 relative rounded-full overflow-hidden shadow-md dark:shadow-gray-700 transform transition-transform duration-300 hover:scale-110">
//                 <Image
//                   src={selected.userId?.image || "/default-avatar.png"}
//                   alt={selected.userId?.firstName || "User"}
//                   fill
//                   className="object-cover"
//                 />
//               </div>

//               <div className="text-sm space-y-1">
//                 <div>
//                   <b>Name:</b> {selected.userId?.firstName} {selected.userId?.lastName}
//                 </div>
//                 <div>
//                   <b>Email:</b> {selected.userId?.email || "N/A"}
//                 </div>
//                 <div>
//                   <b>Phone:</b> {selected.userId?.phone || "N/A"}
//                 </div>
//                 <div>
//                   <b>Bonus:</b> {selected.bonusId?.bonusAmount}
//                 </div>
//               </div>
              
//             </div>

//             <hr className="my-4" />

//               {/* SHIPPING INFO */}
//               <h3 className="font-semibold mb-1">📦 Shipping Information</h3>

//               <p><b>Shipping Name:</b> {selected.shippingName}</p>
//               <p><b>Shipping Phone:</b> {selected.shippingPhone}</p>
//               <p><b>Shipping Address:</b> {selected.shippingAddress}</p>

//               <hr className="my-4" />

//               {/* BONUS INFO */}
//               <h3 className="font-semibold mb-1">🎁 Bonus Information</h3>
//               <p><b>Level:</b> {selected.bonusId?.level}</p>
//               <p><b>Reward Type:</b> {selected.bonusId?.rewardType}</p>
//               <p><b>Bonus Amount:</b> {selected.bonusId?.bonusAmount}</p>

//               <hr className="my-4" />

//               {selected.trackingNumber && (
//                 <>
//                   <hr className="my-4" />
//                   <h3 className="font-semibold mb-1">🚚 Shipping Tracking</h3>
//                   <p><b>Tracking Number:</b> {selected.trackingNumber}</p>
//                   <p><b>Courier:</b> {selected.courier}</p>
//                 </>
//               )}

//               {selected.adminNote && (
//                 <>
//                   <hr className="my-4" />
//                   <h3 className="font-semibold mb-1">📝 Admin Note</h3>
//                   <p>{selected.adminNote}</p>
//                 </>
//               )}

//               <hr className="my-4" />

//               <h3 className="font-semibold mb-1">⏱ Time Log</h3>
//               <p><b>Claimed At:</b> {new Date(selected.claimedAt).toLocaleString()}</p>

//               {selected.processedAt && (
//                 <p><b>Processed At:</b> {new Date(selected.processedAt).toLocaleString()}</p>
//               )}

//               {selected.deliveredAt && (
//                 <p><b>Delivered At:</b> {new Date(selected.deliveredAt).toLocaleString()}</p>
//               )}

//             <div className="my-3">
//               <StatusBadge status={selected.status} />
//             </div>

//             {/* Ship Form */}
//             {showShipForm && (
//               <div className="space-y-2 mb-3">
//                 <input
//                   placeholder="Tracking Number"
//                   className="border px-2 py-1 rounded w-full"
//                   value={shipData.trackingNumber}
//                   onChange={(e) =>
//                     setShipData({
//                       ...shipData,
//                       trackingNumber: e.target.value,
//                     })
//                   }
//                 />

//                 <input
//                   placeholder="Courier"
//                   className="border px-2 py-1 rounded w-full"
//                   value={shipData.courier}
//                   onChange={(e) =>
//                     setShipData({
//                       ...shipData,
//                       courier: e.target.value,
//                     })
//                   }
//                 />

//                 <button
//                   disabled={actionLoading}
//                   onClick={shipped}
//                   className="px-4 py-2 bg-blue-600 text-white rounded w-full"
//                 >
//                   Mark Shipped
//                 </button>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="grid grid-cols-2 gap-2">

//               {selected.status === "pending" && (
//                 <>
//                   <button
//                     onClick={approveClaim}
//                     className="px-3 py-2 bg-green-600 text-white rounded"
//                   >
//                     Approve
//                   </button>

//                   <button
//                     onClick={rejectClaim}
//                     className="px-3 py-2 bg-red-600 text-white rounded"
//                   >
//                     Reject
//                   </button>
//                 </>
//               )}

//               {selected.status === "processing" && (
//                 <button
//                   onClick={() => setShowShipForm(true)}
//                   className="px-3 py-2 bg-blue-600 text-white rounded col-span-2"
//                 >
//                   Mark as Shipped
//                 </button>
//               )}

//               {selected.status === "shipped" && (
//                 <button
//                   onClick={delivered}
//                   className="px-3 py-2 bg-green-600 text-white rounded col-span-2"
//                 >
//                   Mark Delivered
//                 </button>
//               )}

//               {(selected.status === "pending" ||
//                 selected.status === "processing") && (
//                 <button
//                   onClick={cancelClaim}
//                   className="px-3 py-2 bg-gray-700 text-white rounded col-span-2"
//                 >
//                   Cancel Claim
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }










"use client";

import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";

function StatusBadge({ status }) {
  const map = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-orange-100 text-orange-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    rejected: "bg-rose-100 text-rose-800",
  };
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${map[status]}`}>
      {status}
    </span>
  );
}

export default function AdminClaimsPage() {
  const router = useRouter();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchClaims = useCallback(
    async (opts = {}) => {
      setLoading(true);
      try {
        const params = {
          page: opts.page ?? page,
          limit,
          status: opts.status ?? statusFilter,
        };

        const res = await axios.get(`${API_BASE}/claims`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        setClaims(res.data.claims || []);
        setTotal(res.data.total || 0);
        setPage(Number(params.page));
      } catch (err) {
        toast.error("Failed to load claims");
      } finally {
        setLoading(false);
      }
    },
    [page, statusFilter, token, limit]
  );

  useEffect(() => {
    fetchClaims({ page: 1 });
  }, [fetchClaims]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <Toaster />

      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <h1 className="text-2xl font-bold">🎁 Reward Claims</h1>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded bg-white border"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="bg-white shadow rounded-lg p-4 space-y-3">
          {loading ? (
            <div className="text-center p-5">Loading…</div>
          ) : claims.length === 0 ? (
            <div className="text-center p-5 text-gray-500">No claims found</div>
          ) : (
            claims.map((c) => (
              <div
                key={c._id}
                className="p-3 bg-gray-50 rounded-md border flex justify-between items-center"
              >
                <div>
                  <div className="w-20 h-20 relative rounded-full overflow-hidden shadow-md">
                    <Image
                      src={c.userId?.image || "/default-avatar.png"}
                      alt={c.userId?.firstName || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="font-medium">
                    {c.userId?.firstName} {c.userId?.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{c.userId?.phone}</div>
                  <div className="text-xs text-gray-500">{c.userId?.email}</div>
                  <div className="text-xs text-gray-500">
                    {c.bonusId?.bonusAmount}
                  </div>
                  <div className="text-xs text-gray-500">
                    Level: {c.bonusId?.level}
                  </div>
                </div>

                <StatusBadge status={c.status} />

                <button
                  onClick={() => router.push(`/admin/dashboard/bonus-management/claims/${c._id}`)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  Details
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-3 items-center">
          <button
            disabled={page <= 1}
            onClick={() => fetchClaims({ page: page - 1 })}
            className="px-2 py-1 bg-white border rounded disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-sm">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => fetchClaims({ page: page + 1 })}
            className="px-2 py-1 bg-white border rounded disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
