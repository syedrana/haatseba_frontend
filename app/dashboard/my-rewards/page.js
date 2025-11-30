// "use client";

// import axios from "axios";
// import { Clock, DollarSign, Gift, XCircle } from "lucide-react";
// import { useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";

// /**
//  * Place as: app/dashboard/my-rewards/page.jsx
//  * Requires:
//  *  - Tailwind CSS in project
//  *  - react-hot-toast installed (optional) -> npm i react-hot-toast
//  *
//  * Backend endpoints used:
//  *  GET  /getMyRewards        -> returns array of Bonus records
//  *  POST /rewards/claim       -> { bonusId, shippingName, shippingPhone, shippingAddress }
//  *
//  * Auth:
//  *  uses localStorage token as 'token' and sends Authorization: Bearer ${token}
//  */

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";

// function RewardIcon({ rewardType }) {
//   if (rewardType === "product") return <Gift className="w-5 h-5" />;
//   if (rewardType === "cash") return <DollarSign className="w-5 h-5" />;
//   return <Clock className="w-5 h-5" />;
// }

// function StatusBadge({ status }) {
//   const map = {
//     pending: "bg-yellow-100 text-yellow-800",
//     approved: "bg-blue-100 text-blue-800",
//     processing: "bg-orange-100 text-orange-800",
//     paid: "bg-green-100 text-green-800",
//     delivered: "bg-green-200 text-green-900",
//     rejected: "bg-red-100 text-red-800",
//   };
//   const cls = map[status] || "bg-gray-100 text-gray-800";
//   return <span className={`px-2 py-1 rounded-md text-xs font-medium ${cls}`}>{status}</span>;
// }

// export default function MyRewardsPage({ darkMode = false }) {
//   const [loading, setLoading] = useState(true);
//   const [rewards, setRewards] = useState([]);
//   const [selectedBonus, setSelectedBonus] = useState(null); // bonus to claim
//   const [modalOpen, setModalOpen] = useState(false);
//   const [claimForm, setClaimForm] = useState({ shippingName: "", shippingPhone: "", shippingAddress: "" });
//   const [submitting, setSubmitting] = useState(false);

//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   const fetchRewards = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE}/getMyRewards`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRewards(Array.isArray(res.data) ? res.data : res.data || []);
//     } catch (err) {
//       console.error("Fetch rewards error:", err);
//       toast.error("Failed to load rewards.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRewards();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const openClaimModal = (bonus) => {
//     setSelectedBonus(bonus);
//     setClaimForm({
//       shippingName: `${bonus.userFullName || ""}`.trim() || "",
//       shippingPhone: bonus.userPhone || "",
//       shippingAddress: "",
//     });
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setSelectedBonus(null);
//     setClaimForm({ shippingName: "", shippingPhone: "", shippingAddress: "" });
//   };

//   const handleClaimChange = (e) => {
//     const { name, value } = e.target;
//     setClaimForm((p) => ({ ...p, [name]: value }));
//   };

//   const submitClaim = async (e) => {
//     e.preventDefault();
//     if (!selectedBonus) return;
//     if (!claimForm.shippingName || !claimForm.shippingPhone || !claimForm.shippingAddress) {
//       toast.error("Please fill shipping name, phone and address.");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const payload = {
//         bonusId: selectedBonus._id,
//         shippingName: claimForm.shippingName,
//         shippingPhone: claimForm.shippingPhone,
//         shippingAddress: claimForm.shippingAddress,
//       };

//       await axios.post(`${API_BASE}/claimreward`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success("Claim submitted! Admin will process it shortly.");
//       closeModal();
//       fetchRewards();
//     } catch (err) {
//       console.error("Claim error:", err);
//       toast.error(err.response?.data?.message || "Failed to submit claim.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} min-h-screen p-6`}>
//       <Toaster position="top-right" />
//       <div className="max-w-6xl mx-auto">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-2xl font-bold">🎁 My Rewards</h1>
//             <p className="text-sm text-muted-foreground mt-1">All bonuses issued to your account. Claim product rewards from here.</p>
//           </div>

//           <div>
//             <button
//               onClick={fetchRewards}
//               className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border shadow-sm hover:shadow-md"
//             >
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Loading */}
//         {loading ? (
//           <div className="py-12 text-center text-sm text-gray-500">Loading your rewards...</div>
//         ) : rewards.length === 0 ? (
//           <div className="py-12 text-center text-sm text-gray-500">No rewards yet.</div>
//         ) : (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {rewards.map((b) => (
//               <div key={b._id} className={`rounded-xl p-4 shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
//                 <div className="flex items-start justify-between gap-3">
//                   <div className="flex items-center gap-3">
//                     <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
//                       <RewardIcon rewardType={b.rewardType} />
//                     </div>
//                     <div>
//                       <div className="text-sm text-gray-500">Level {b.level || "-"}</div>
//                       <div className="text-lg font-semibold mt-1">
//                         {b.rewardType === "cash" ? `BDT ${Number(b.bonusAmount || b.costValue || 0)}` : (b.productId?.name || b.bonusAmount || "Product")}
//                       </div>
//                       <div className="text-xs text-gray-400 mt-1">Issued: {new Date(b.issuedAt || b.createdAt).toLocaleDateString()}</div>
//                     </div>
//                   </div>

//                   <div className="flex flex-col items-end gap-2">
//                     <StatusBadge status={b.status} />
//                     {/* small actions */}
//                     <div className="flex gap-2">
//                       {/* && b.status === "approved" */}
//                       {b.rewardType === "product"  && (
//                         <button
//                           onClick={() => openClaimModal(b)}
//                           className="px-3 py-1 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
//                         >
//                           Claim
//                         </button>
//                       )}
// {/* && (b.status === "paid" || b.status === "approved") */}
//                       {b.rewardType === "cash"  && (
//                         <button
//                           onClick={() => toast("Cash already credited to your wallet. Withdraw from Wallet page.")}
//                           className="px-3 py-1 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
//                         >
//                           Wallet
//                         </button>
//                       )}

//                       {b.status === "pending" && (
//                         <button disabled className="px-3 py-1 text-sm rounded-md bg-gray-200 text-gray-600">Pending</button>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* optional note */}
//                 {b.note && <div className="mt-3 text-sm text-gray-400">{b.note}</div>}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Claim Modal */}
//         {modalOpen && selectedBonus && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center">
//             <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

//             <div className={`relative w-full max-w-lg mx-4 rounded-xl overflow-hidden ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
//               <div className="p-5">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold">Claim Product Reward</h3>
//                   <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
//                     <XCircle className="w-6 h-6" />
//                   </button>
//                 </div>

//                 <div className="mb-4 text-sm text-gray-500">
//                   You&apos;re claiming: <span className="font-medium">{selectedBonus.productId?.name || selectedBonus.bonusAmount}</span>
//                   <div className="text-xs text-gray-400">Cost value: BDT {selectedBonus.costValue || 0}</div>
//                 </div>

//                 <form onSubmit={submitClaim} className="space-y-3">
//                   <div>
//                     <label className="text-xs block mb-1">Recipient name</label>
//                     <input name="shippingName" value={claimForm.shippingName} onChange={handleClaimChange} className="w-full p-2 rounded border bg-transparent" required />
//                   </div>

//                   <div>
//                     <label className="text-xs block mb-1">Phone</label>
//                     <input name="shippingPhone" value={claimForm.shippingPhone} onChange={handleClaimChange} className="w-full p-2 rounded border bg-transparent" required />
//                   </div>

//                   <div>
//                     <label className="text-xs block mb-1">Shipping address</label>
//                     <textarea name="shippingAddress" value={claimForm.shippingAddress} onChange={handleClaimChange} rows={3} className="w-full p-2 rounded border bg-transparent" required />
//                   </div>

//                   <div className="flex items-center gap-2 justify-end mt-4">
//                     <button type="button" onClick={closeModal} className="px-4 py-2 rounded-md border">Cancel</button>
//                     <button type="submit" disabled={submitting} className="px-4 py-2 rounded-md bg-emerald-600 text-white">
//                       {submitting ? "Submitting..." : "Submit Claim"}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




















"use client";

import axios from "axios";
import { Clock, DollarSign, Gift, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";

function RewardIcon({ rewardType }) {
  if (rewardType === "product") return <Gift className="w-5 h-5" />;
  if (rewardType === "cash") return <DollarSign className="w-5 h-5" />;
  return <Clock className="w-5 h-5" />;
}

function StatusBadge({ status }) {
  const classes = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-blue-100 text-blue-800",
    processing: "bg-orange-100 text-orange-800",
    paid: "bg-green-100 text-green-800",
    delivered: "bg-green-200 text-green-900",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${classes[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
}

export default function MyRewardsPage({ darkMode = false }) {
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState([]);
  const [selectedBonus, setSelectedBonus] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [claimForm, setClaimForm] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /** ✅ FIXED → useCallback to avoid dependency warning */
  const fetchRewards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/getMyRewards`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRewards(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch rewards error:", err);
      toast.error("Failed to load rewards.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  // -----------------------
  // Claim Modal Functions
  // -----------------------
  const openClaimModal = (bonus) => {
    setSelectedBonus(bonus);

    setClaimForm({
      shippingName: bonus.userFullName || "",
      shippingPhone: bonus.userPhone || "",
      shippingAddress: "",
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBonus(null);

    setClaimForm({
      shippingName: "",
      shippingPhone: "",
      shippingAddress: "",
    });
  };

  const handleClaimChange = (e) => {
    setClaimForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const submitClaim = async (e) => {
    e.preventDefault();
    if (!selectedBonus) return;

    if (!claimForm.shippingName || !claimForm.shippingPhone || !claimForm.shippingAddress) {
      toast.error("Please fill shipping name, phone & address.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        `${API_BASE}/claimreward`,
        {
          bonusId: selectedBonus._id,
          ...claimForm,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Claim submitted successfully!");
      closeModal();
      fetchRewards();
    } catch (err) {
      toast.error(err.response?.data?.message || "Claim failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} min-h-screen p-6`}>
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">🎁 My Rewards</h1>
            <p className="text-sm text-gray-500">View your rewards and claim product bonuses.</p>
          </div>

          <button
            onClick={fetchRewards}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border shadow-sm hover:shadow-md"
          >
            Refresh
          </button>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="py-12 text-center text-sm text-gray-500">Loading rewards...</div>
        ) : rewards.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">No rewards found.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rewards.map((r) => (
              <div key={r._id} className={`p-4 rounded-xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                      <RewardIcon rewardType={r.rewardType} />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Level {r.level}</p>
                      <p className="text-lg font-semibold mt-1">
                        {r.rewardType === "cash"
                          ? `BDT ${Number(r.bonusAmount)}`
                          : r.bonusAmount || "Product"}
                      </p>
                      <p className="text-xs text-gray-400">
                        Issued: {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                      {/* 🔥 SHOW MOBILE RECHARGE DETAILS WHEN PAID */}
                      {r.rewardType === "mobile_recharge" && r.status === "paid" && (
                        <>
                          <p className="text-xs text-green-600 mt-1">
                            Recharge Number: <span className="font-medium">{r.rechargeNumber}</span>
                          </p>

                          {r.transactionId && (
                            <p className="text-xs text-blue-600">
                              Transaction ID: <span className="font-medium">{r.transactionId}</span>
                            </p>
                          )}

                          {r.adminNote && (
                            <p className="mt-1 text-xs text-orange-500 italic">
                              Admin Note: {r.adminNote}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={r.status} />

                    {/* Buttons */}
                    <div className="flex gap-2">
                      {/* Product Claim → Only if Approved */}
                      {r.rewardType === "product" && r.status === "approved" && (
                        <button
                          onClick={() => openClaimModal(r)}
                          className="px-3 py-1 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Claim
                        </button>
                      )}

                      {/* Cash Already Paid to Wallet */}
                      {r.rewardType === "cash" && r.status === "paid" && (
                        <button
                          onClick={() => toast("Cash credited to your wallet.")}
                          className="px-3 py-1 text-sm rounded-md bg-indigo-600 text-white"
                        >
                          Wallet
                        </button>
                      )}

                      {/* Pending */}
                      {r.status === "pending" && (
                        <button disabled className="px-3 py-1 text-sm rounded-md bg-gray-200 text-gray-600">
                          Pending
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {r.note && <p className="mt-3 text-sm text-gray-400">{r.note}</p>}
              </div>
            ))}
          </div>
        )}

        {/* CLAIM MODAL */}
        {modalOpen && selectedBonus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

            <div className={`relative w-full max-w-lg mx-4 rounded-xl p-5 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Claim Product Reward</h3>
                <button onClick={closeModal}>
                  <XCircle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Claiming: <span className="font-medium">{selectedBonus.productId?.name}</span>
              </p>

              <form onSubmit={submitClaim} className="space-y-3">
                <div>
                  <label className="text-xs">Recipient Name</label>
                  <input
                    name="shippingName"
                    value={claimForm.shippingName}
                    onChange={handleClaimChange}
                    className="w-full p-2 border rounded bg-transparent"
                  />
                </div>

                <div>
                  <label className="text-xs">Phone</label>
                  <input
                    name="shippingPhone"
                    value={claimForm.shippingPhone}
                    onChange={handleClaimChange}
                    className="w-full p-2 border rounded bg-transparent"
                  />
                </div>

                <div>
                  <label className="text-xs">Shipping Address</label>
                  <textarea
                    name="shippingAddress"
                    value={claimForm.shippingAddress}
                    onChange={handleClaimChange}
                    rows={3}
                    className="w-full p-2 border rounded bg-transparent"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={closeModal} className="px-4 py-2 border rounded">
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded bg-emerald-600 text-white"
                  >
                    {submitting ? "Submitting..." : "Submit Claim"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
