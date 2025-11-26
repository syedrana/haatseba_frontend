// "use client";

// import axios from "axios";
// import { CheckCircle2, Info, XCircle } from "lucide-react";
// import { useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";
// const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

// function DetailRow({ label, value }) {
//   return (
//     <div className="flex justify-between py-1">
//       <div className="text-sm text-gray-500">{label}</div>
//       <div className="text-sm font-medium">{value ?? "-"}</div>
//     </div>
//   );
// }

// export default function AdminBonusApprovalPage({ darkMode = false }) {
//   const [loading, setLoading] = useState(true);
//   const [bonuses, setBonuses] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [rejectNote, setRejectNote] = useState("");
//   const [actionLoading, setActionLoading] = useState(false);

//   const fetchPending = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE}/listpendingbonuses`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBonuses(res.data.bonuses || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load pending bonuses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPending();
//   }, []);

//   const handleApprove = async (id) => {
//     if (!confirm("Approve this bonus?")) return;
//     setActionLoading(true);
//     try {
//       await axios.patch(`${API_BASE}/approvebonus/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
//       toast.success("Approved");
//       fetchPending();
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to approve");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleReject = async (id) => {
//     const reason = prompt("Enter reject note (optional):", "");
//     if (reason === null) return; // cancelled
//     setActionLoading(true);
//     try {
//       await axios.patch(`${API_BASE}/rejectbonus/${id}`, { note: reason }, { headers: { Authorization: `Bearer ${token}` } });
//       toast.success("Rejected");
//       fetchPending();
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to reject");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleMarkPaid = async (id) => {
//     if (!confirm("Mark this bonus as PAID? This action may credit wallet or deduct stock.")) return;
//     setActionLoading(true);
//     try {
//       await axios.patch(`${API_BASE}/markpaid/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
//       toast.success("Marked paid");
//       fetchPending();
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to mark paid");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   return (
//     <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} p-6 min-h-screen`}>
//       <Toaster />
//       <div className="max-w-6xl mx-auto">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-2xl font-bold">Bonus Approval Panel</h1>
//             <p className="text-sm text-gray-500">Approve or reject pending rewards, mark paid when processed.</p>
//           </div>
//           <div>
//             <button onClick={fetchPending} className="px-3 py-2 bg-white dark:bg-gray-800 rounded shadow">Refresh</button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* LEFT: list */}
//           <div className="lg:col-span-2 space-y-4">
//             {loading ? (
//               <div className="p-6 text-center">Loading...</div>
//             ) : bonuses.length === 0 ? (
//               <div className="p-6 text-center">No pending bonuses</div>
//             ) : (
//               bonuses.map((b) => (
//                 <div key={b._id} className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <div className="text-sm text-gray-400">User</div>
//                       <div className="font-semibold">{b.userId ? `${b.userId.firstName} ${b.userId.lastName}` : "—"}</div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-sm text-gray-400">Level</div>
//                       <div className="font-semibold">#{b.level}</div>
//                     </div>
//                   </div>

//                   <div className="mt-3 grid grid-cols-2 gap-2">
//                     <div>
//                       <div className="text-xs text-gray-400">Type</div>
//                       <div className="font-medium">{b.rewardType}</div>
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-400">Amount / Cost</div>
//                       <div className="font-medium">{b.rewardType === "cash" ? `BDT ${b.bonusAmount}` : `BDT ${b.costValue}`}</div>
//                     </div>
//                   </div>

//                   <div className="mt-4 flex gap-2">
//                     <button disabled={actionLoading} onClick={() => { setSelected(b); }} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded">Details</button>
//                     <button disabled={actionLoading} onClick={() => handleApprove(b._id)} className="px-3 py-1 bg-emerald-600 text-white rounded flex items-center gap-2">
//                       <CheckCircle2 className="w-4 h-4" /> Approve
//                     </button>
//                     <button disabled={actionLoading} onClick={() => handleReject(b._id)} className="px-3 py-1 bg-red-500 text-white rounded flex items-center gap-2">
//                       <XCircle className="w-4 h-4" /> Reject
//                     </button>
//                     <button disabled={actionLoading} onClick={() => handleMarkPaid(b._id)} className="ml-auto px-3 py-1 bg-indigo-600 text-white rounded">Mark Paid</button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* RIGHT: details panel */}
//           <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg shadow`}>
//             {!selected ? (
//               <div className="text-center text-sm text-gray-500"><Info className="mx-auto" /> Select an item to view details</div>
//             ) : (
//               <>
//                 <h3 className="text-lg font-semibold mb-3">Bonus Details</h3>
//                 <DetailRow label="User" value={selected.userId ? `${selected.userId.firstName} ${selected.userId.lastName}` : "-" } />
//                 <DetailRow label="Email" value={selected.userId?.email || "-"} />
//                 <DetailRow label="Phone" value={selected.userId?.phone || "-"} />
//                 <DetailRow label="Level" value={selected.level} />
//                 <DetailRow label="Type" value={selected.rewardType} />
//                 <DetailRow label="Bonus Amount" value={selected.bonusAmount} />
//                 <DetailRow label="Cost Value" value={`BDT ${selected.costValue || 0}`} />
//                 <DetailRow label="Status" value={selected.status} />
//                 <DetailRow label="Note" value={selected.note || "-"} />
//                 <div className="mt-4 flex gap-2">
//                   <button onClick={() => handleApprove(selected._id)} className="px-3 py-1 bg-emerald-600 text-white rounded">Approve</button>
//                   <button onClick={() => handleReject(selected._id)} className="px-3 py-1 bg-red-500 text-white rounded">Reject</button>
//                   <button onClick={() => handleMarkPaid(selected._id)} className="px-3 py-1 bg-indigo-600 text-white rounded ml-auto">Mark Paid</button>
//                 </div>
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
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between py-1 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value ?? "-"}</span>
    </div>
  );
}

export default function AdminBonusApprovalPage({ darkMode = false }) {
  const [loading, setLoading] = useState(true);
  const [bonuses, setBonuses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/listpendingbonuses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBonuses(res.data.bonuses || []);
    } catch (err) {
      toast.error("Failed to load pending bonuses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    if (!confirm("Approve this bonus?")) return;
    setActionLoading(true);
    try {
      await axios.patch(`${API_BASE}/approvebonus/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Approved");
      fetchPending();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter reject note (optional):", "");
    if (reason === null) return;
    setActionLoading(true);
    try {
      await axios.patch(`${API_BASE}/rejectbonus/${id}`, { note: reason }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Rejected");
      fetchPending();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkPaid = async (id) => {
    if (!confirm("Mark this bonus as PAID?")) return;
    setActionLoading(true);
    try {
      await axios.patch(`${API_BASE}/markpaid/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Marked paid");
      fetchPending();
    } catch (err) {
      toast.error("Failed to mark paid");
    } finally {
      setActionLoading(false);
    }
  };

  const openDetails = (b) => {
    setSelected(b);
    setOpenModal(true);
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} p-4 min-h-screen`}>
      <Toaster />

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Bonus Approval Panel</h1>
            <p className="text-gray-500 text-sm">Approve or reject pending bonuses.</p>
          </div>
          <button onClick={fetchPending} className="px-3 py-2 bg-white rounded shadow text-sm dark:bg-gray-800">
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* LIST */}
          <div className="lg:col-span-2 space-y-3">
            {loading ? (
              <div className="text-center py-6">Loading...</div>
            ) : bonuses.length === 0 ? (
              <div className="text-center py-6">No pending bonuses</div>
            ) : (
              bonuses.map((b) => (
                <div key={b._id} className="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
                  <div className="flex justify-between mb-3">
                    <div>
                      <p className="text-gray-400 text-xs">User</p>
                      <p className="font-semibold text-sm">
                        {b.userId ? `${b.userId.firstName} ${b.userId.lastName}` : "—"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Level</p>
                      <p className="font-semibold text-sm">#{b.level}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 text-sm mb-3">
                    <div>
                      <p className="text-gray-400 text-xs">Type</p>
                      <p className="font-medium">{b.rewardType}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Amount / Cost</p>
                      <p className="font-medium">
                        {b.rewardType === "cash" ? `BDT ${b.bonusAmount}` : `BDT ${b.costValue}`}
                      </p>
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      onClick={() => openDetails(b)}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm"
                    >
                      Details
                    </button>

                    <button
                      disabled={actionLoading}
                      onClick={() => handleApprove(b._id)}
                      className="px-3 py-1 bg-emerald-600 text-white rounded text-sm flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>

                    <button
                      disabled={actionLoading}
                      onClick={() => handleReject(b._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>

                    <button
                      disabled={actionLoading}
                      onClick={() => handleMarkPaid(b._id)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded text-sm ml-auto"
                    >
                      Mark Paid
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* DESKTOP DETAILS PANEL */}
          <div className="hidden lg:block p-4 rounded-lg shadow bg-white dark:bg-gray-800 h-fit sticky top-4">
            {!selected ? (
              <div className="text-center text-gray-500 text-sm">
                <Info className="mx-auto mb-1" /> Select an item to view details
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4">Bonus Details</h3>
                <DetailRow label="User" value={`${selected.userId.firstName} ${selected.userId.lastName}`} />
                <DetailRow label="Email" value={selected.userId.email} />
                <DetailRow label="Phone" value={selected.userId.phone} />
                <DetailRow label="Level" value={selected.level} />
                <DetailRow label="Type" value={selected.rewardType} />
                <DetailRow label="Bonus Amount" value={selected.bonusAmount} />
                <DetailRow label="Cost Value" value={`BDT ${selected.costValue}`} />
                <DetailRow label="Status" value={selected.status} />

                <div className="mt-4 flex gap-2">
                  <button onClick={() => handleApprove(selected._id)} className="px-3 py-1 bg-emerald-600 text-white rounded text-sm">Approve</button>
                  <button onClick={() => handleReject(selected._id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Reject</button>
                  <button onClick={() => handleMarkPaid(selected._id)} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm ml-auto">Paid</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MODAL DETAILS */}
      {openModal && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end md:items-center z-50">
          <div className="bg-white dark:bg-gray-900 w-full md:w-96 p-5 rounded-t-xl md:rounded-xl shadow-lg max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3">Bonus Details</h3>

            <DetailRow label="User" value={`${selected.userId.firstName} ${selected.userId.lastName}`} />
            <DetailRow label="Email" value={selected.userId.email} />
            <DetailRow label="Phone" value={selected.userId.phone} />
            <DetailRow label="Level" value={selected.level} />
            <DetailRow label="Type" value={selected.rewardType} />
            <DetailRow label="Bonus Amount" value={selected.bonusAmount} />
            <DetailRow label="Cost Value" value={`BDT ${selected.costValue}`} />

            <div className="mt-4 flex gap-2">
              <button onClick={() => handleApprove(selected._id)} className="px-3 py-1 bg-emerald-600 text-white rounded text-sm">Approve</button>
              <button onClick={() => handleReject(selected._id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Reject</button>
              <button onClick={() => handleMarkPaid(selected._id)} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm ml-auto">Paid</button>
            </div>

            <button onClick={() => setOpenModal(false)} className="mt-4 w-full py-2 bg-gray-200 dark:bg-gray-700 rounded text-sm">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
