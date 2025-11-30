// "use client";

// import axios from "axios";
// import { Info } from "lucide-react";
// import { useCallback, useEffect, useState } from "react";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// export default function ApprovedBonusesPage() {
//   const [bonuses, setBonuses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selected, setSelected] = useState(null);

//   const [page, setPage] = useState(1);
//   const limit = 20;
//   const [total, setTotal] = useState(0);

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // const fetchBonuses = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const res = await axios.get(`${API_BASE}/listapprovedbonuses`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //       params: { page, limit },
  //     });

  //     setBonuses(res.data.bonuses || []);
  //     setTotal(res.data.total || 0);
  //     setLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // }, [page, limit, token]);

  // useEffect(() => {
  //   fetchBonuses();
  // }, [fetchBonuses]);

//   const totalPages = Math.ceil(total / limit);

//   return (
//     <div className="p-4 min-h-screen bg-gray-50">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-xl md:text-2xl font-bold mb-3">Approved Bonuses</h1>
//         <p className="text-gray-500 mb-4 text-sm">
//           All bonuses that are approved & waiting to be delivered or paid.
//         </p>

//         {/* MAIN GRID */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

//           {/* LIST */}
//           <div className="lg:col-span-2 space-y-3">
//             {loading ? (
//               <div className="text-center py-6">Loading...</div>
//             ) : bonuses.length === 0 ? (
//               <div className="text-center py-6">No approved bonuses</div>
//             ) : (
//               bonuses.map((b) => (
//                 <div
//                   key={b._id}
//                   className="p-4 rounded-lg shadow bg-white hover:bg-gray-50 transition"
//                 >
//                   <div className="flex justify-between">
//                     <div>
//                       <p className="text-xs text-gray-400">User</p>
//                       <p className="font-semibold">
//                         {b.userId?.firstName} {b.userId?.lastName}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-xs text-gray-400">Level</p>
//                       <p className="font-semibold">#{b.level}</p>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 text-sm mt-2">
//                     <div>
//                       <p className="text-xs text-gray-400">Reward Type</p>
//                       <p className="font-medium">{b.rewardType}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-400">Amount</p>
//                       <p className="font-medium">BDT {b.bonusAmount}</p>
//                     </div>
//                   </div>

//                   <button
//                     onClick={() => setSelected(b)}
//                     className="mt-3 text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
//                   >
//                     Details
//                   </button>
//                 </div>
//               ))
//             )}

//             {/* Pagination */}
//             {total > limit && (
//               <div className="flex justify-center gap-2 mt-4">
//                 <button
//                   disabled={page <= 1}
//                   onClick={() => setPage((p) => p - 1)}
//                   className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
//                 >
//                   Prev
//                 </button>

//                 <button
//                   disabled={page >= totalPages}
//                   onClick={() => setPage((p) => p + 1)}
//                   className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* DETAILS PANEL (DESKTOP) */}
//           <div className="hidden lg:block p-4 bg-white shadow rounded-lg sticky top-4 h-fit">
//             {!selected ? (
//               <div className="text-center text-gray-500 text-sm">
//                 <Info className="mx-auto mb-1" />
//                 Select a bonus to see details
//               </div>
//             ) : (
//               <div>
//                 <h3 className="text-lg font-semibold mb-3">Bonus Details</h3>
//                 <p><b>User:</b> {selected.userId.firstName} {selected.userId.lastName}</p>
//                 <p><b>Email:</b> {selected.userId.email}</p>
//                 <p><b>Phone:</b> {selected.userId.phone}</p>
//                 <p><b>Level:</b> {selected.level}</p>
//                 <p><b>Reward Type:</b> {selected.rewardType}</p>
//                 <p><b>Bonus Amount:</b> {selected.bonusAmount}</p>
//                 <p><b>Status:</b> {selected.status}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* MOBILE MODAL */}
//       {selected && (
//         <div
//           onClick={() => setSelected(null)}
//           className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end lg:hidden"
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="bg-white w-full p-4 rounded-t-xl shadow-lg max-h-[80vh] overflow-y-auto"
//           >
//             <h3 className="text-lg font-semibold mb-3">Bonus Details</h3>

//             <p><b>User:</b> {selected.userId.firstName} {selected.userId.lastName}</p>
//             <p><b>Email:</b> {selected.userId.email}</p>
//             <p><b>Phone:</b> {selected.userId.phone}</p>
//             <p><b>Level:</b> {selected.level}</p>
//             <p><b>Reward Type:</b> {selected.rewardType}</p>
//             <p><b>Bonus Amount:</b> {selected.bonusAmount}</p>

//             <button
//               onClick={() => setSelected(null)}
//               className="mt-4 w-full py-2 bg-gray-200 rounded"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
















// "use client";

// import axios from "axios";
// import { CheckCircle2, Info } from "lucide-react";
// import { useCallback, useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
// const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

// export default function ApprovedBonusesPage() {
//   const [bonuses, setBonuses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(20);
//   const [total, setTotal] = useState(0);
//   const [selected, setSelected] = useState(null);

//   const fetchBonuses = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${API_BASE}/listapprovedbonuses`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { page, limit },
//       });

//       setBonuses(res.data.bonuses || []);
//       setTotal(res.data.total || 0);
//       setLoading(false);
//     } catch (error) {
//       console.log(error);
//       setLoading(false);
//     }
//   }, [page, limit]);

//   useEffect(() => {
//     fetchBonuses();
//   }, [fetchBonuses]);

//   const handleRecharge = async (id) => {
//     if (!confirm("Confirm Mobile Recharge?")) return;

//     try {
//       const res = await axios.patch(
//         `${API_BASE}/approvemobilerecharge/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast.success("Mobile Recharge Completed!");
//       fetchBonuses();

//     } catch (err) {
//       toast.error(err.response?.data?.message || "Recharge failed");
//     }
//   };


//   const handleMarkPaid = async (id) => {
//     if (!confirm("Mark this bonus as PAID?")) return;

//     try {
//       await axios.patch(
//         `${API_BASE}/markpaid/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast.success("Bonus marked as paid");
//       fetchBonuses();
//     } catch (err) {
//       toast.error("Failed to mark paid");
//     }
//   };

//   return (
//     <div className="p-4 min-h-screen bg-gray-100">
//       <Toaster />

//       <div className="max-w-6xl mx-auto">

//         <h1 className="text-xl font-bold mb-4">Approved Bonuses</h1>

//         {/* LIST */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

//           <div className="lg:col-span-2 space-y-3">

//             {loading ? (
//               <div className="text-center py-6">Loading...</div>
//             ) : bonuses.length === 0 ? (
//               <div className="text-center py-6 text-gray-600">No approved bonuses</div>
//             ) : (
//               bonuses.map((b) => (
//                 <div key={b._id} className="bg-white p-4 rounded shadow">
//                   <div className="flex justify-between">
//                     <div>
//                       <p className="text-xs text-gray-400">User</p>
//                       <p className="font-medium">
//                         {b.userId?.firstName} {b.userId?.lastName}
//                       </p>
//                     </div>

//                     <div className="text-right">
//                       <p className="text-xs text-gray-400">Level</p>
//                       <p className="font-semibold">#{b.level}</p>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 mt-3 text-sm">
//                     <div>
//                       <p className="text-gray-400 text-xs">Type</p>
//                       <p className="font-medium">{b.rewardType}</p>
//                     </div>

//                     <div>
//                       <p className="text-gray-400 text-xs">Amount</p>
//                       <p className="font-medium">
//                         {b.rewardType === "cash"
//                           ? `BDT ${b.bonusAmount}`
//                           : `BDT ${b.costValue}`}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex mt-3 gap-2">

//                     <button
//                       onClick={() => setSelected(b)}
//                       className="px-3 py-1 bg-gray-200 rounded text-sm"
//                     >
//                       Details
//                     </button>

//                     {b.rewardType === "mobile_recharge" ? (
//                       <button
//                         onClick={() => handleRecharge(b._id)}
//                         className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
//                       >
//                         Recharge Now
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => handleMarkPaid(b._id)}
//                         className="px-3 py-1 bg-indigo-600 text-white rounded text-sm flex items-center gap-1"
//                       >
//                         <CheckCircle2 className="w-4 h-4" /> Mark Paid
//                       </button>
//                     )}

//                   </div>

//                 </div>
//               ))
//             )}

//             {/* PAGINATION */}
//             <div className="flex justify-center gap-3 mt-4">
//               <button
//                 disabled={page <= 1}
//                 onClick={() => setPage((prev) => prev - 1)}
//                 className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
//               >
//                 Prev
//               </button>
              
//               <button
//                 disabled={page * limit >= total}
//                 onClick={() => setPage((prev) => prev + 1)}
//                 className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>

//           </div>

//           {/* DETAILS PANEL */}
//           <div className="hidden lg:block bg-white p-4 rounded shadow h-fit sticky top-4">
//             {!selected ? (
//               <div className="text-center text-gray-500">
//                 <Info className="mx-auto mb-1" />
//                 Select an item to view details
//               </div>
//             ) : (
//               <>
//                 <h2 className="text-lg font-semibold mb-3">Details</h2>

//                 <p><strong>Name:</strong> {selected.userId.firstName} {selected.userId.lastName}</p>
//                 <p><strong>Email:</strong> {selected.userId.email}</p>
//                 <p><strong>Recharge Number:</strong> {selected.userId.phone}</p>
//                 <p><strong>Level:</strong> {selected.level}</p>
//                 <p><strong>Type:</strong> {selected.rewardType}</p>
//                 <p><strong>Amount:</strong> {selected.bonusAmount}</p>
//                 <p><strong>Cost Value:</strong> {selected.costValue}</p>
//                 <p><strong>Status:</strong> {selected.status}</p>
//               </>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }












"use client";

import axios from "axios";
import { CheckCircle2, Info } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

// ----------------------------
// 🔵 RECHARGE MODAL COMPONENT
// ----------------------------
function RechargeModal({ open, onClose, onSubmit }) {
  const [transactionId, setTransactionId] = useState("");
  const [adminNote, setAdminNote] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-3">Mobile Recharge Info</h2>

        <label className="text-sm text-gray-600">Transaction ID</label>
        <input
          type="text"
          className="w-full border px-3 py-1 rounded mb-3"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="Optional"
        />

        <label className="text-sm text-gray-600">Admin Note</label>
        <textarea
          className="w-full border px-3 py-1 rounded mb-3"
          rows={3}
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          placeholder="Optional note"
        ></textarea>

        <div className="flex justify-end gap-2 mt-2">
          <button
            className="px-3 py-1 bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() =>
              onSubmit({
                transactionId,
                adminNote,
              })
            }
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================
// 🔵 MAIN PAGE COMPONENT
// =============================
export default function ApprovedBonusesPage() {
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);

  // Modal control
  const [modalOpen, setModalOpen] = useState(false);
  const [rechargeId, setRechargeId] = useState(null);

  const fetchBonuses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/listapprovedbonuses`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
      });

      setBonuses(res.data.bonuses || []);
      setTotal(res.data.total || 0);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchBonuses();
  }, [fetchBonuses]);

  // ----------------------------
  // 🔵 OPEN MODAL INSTEAD OF DIRECT RECHARGE
  // ----------------------------
  const handleRecharge = (id) => {
    setRechargeId(id);
    setModalOpen(true);
  };

  // ----------------------------
  // 🔵 SUBMIT FROM MODAL
  // ----------------------------
  const submitRecharge = async (data) => {
    try {
      await axios.patch(
        `${API_BASE}/approvemobilerecharge/${rechargeId}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Mobile Recharge Completed!");
      setModalOpen(false);
      fetchBonuses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Recharge failed");
    }
  };

  const handleMarkPaid = async (id) => {
    if (!confirm("Mark this bonus as PAID?")) return;

    try {
      await axios.patch(
        `${API_BASE}/markpaid/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Bonus marked as paid");
      fetchBonuses();
    } catch (err) {
      toast.error("Failed to mark paid");
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <Toaster />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Approved Bonuses</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            {loading ? (
              <div className="text-center py-6">Loading...</div>
            ) : bonuses.length === 0 ? (
              <div className="text-center py-6 text-gray-600">
                No approved bonuses
              </div>
            ) : (
              bonuses.map((b) => (
                <div key={b._id} className="bg-white p-4 rounded shadow">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-gray-400">User</p>
                      <p className="font-medium">
                        {b.userId?.firstName} {b.userId?.lastName}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-400">Level</p>
                      <p className="font-semibold">#{b.level}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 mt-3 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">Type</p>
                      <p className="font-medium">{b.rewardType}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs">Amount</p>
                      <p className="font-medium">
                        {b.rewardType === "cash"
                          ? `BDT ${b.bonusAmount}`
                          : `BDT ${b.costValue}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex mt-3 gap-2">
                    <button
                      onClick={() => setSelected(b)}
                      className="px-3 py-1 bg-gray-200 rounded text-sm"
                    >
                      Details
                    </button>

                    {b.rewardType === "mobile_recharge" ? (
                      <button
                        onClick={() => handleRecharge(b._id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                      >
                        Recharge Now
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkPaid(b._id)}
                        className="px-3 py-1 bg-indigo-600 text-white rounded text-sm flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Mark Paid
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}

            <div className="flex justify-center gap-3 mt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <button
                disabled={page * limit >= total}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <div className="hidden lg:block bg-white p-4 rounded shadow h-fit sticky top-4">
            {!selected ? (
              <div className="text-center text-gray-500">
                <Info className="mx-auto mb-1" />
                Select an item to view details
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-3">Details</h2>

                <p>
                  <strong>Name:</strong> {selected.userId.firstName}{" "}
                  {selected.userId.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {selected.userId.email}
                </p>
                <p>
                  <strong>Recharge Number:</strong> {selected.userId.phone}
                </p>
                <p>
                  <strong>Level:</strong> {selected.level}
                </p>
                <p>
                  <strong>Type:</strong> {selected.rewardType}
                </p>
                <p>
                  <strong>Amount:</strong> {selected.bonusAmount}
                </p>
                <p>
                  <strong>Cost Value:</strong> {selected.costValue}
                </p>
                <p>
                  <strong>Status:</strong> {selected.status}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 🔵 MODAL RENDERING */}
      <RechargeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={submitRecharge}
      />
    </div>
  );
}
