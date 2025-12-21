// "use client";

// import axios from "axios";
// import { Check, Eye, X } from "lucide-react";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// const API = process.env.NEXT_PUBLIC_API_BASE;

// export default function AdminTopUpsPage() {
//   const [topups, setTopups] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [processingId, setProcessingId] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [rejecting, setRejecting] = useState(null);
//   const [note, setNote] = useState("");

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   /* ---------------- fetch pending topups ---------------- */
//   useEffect(() => {
//     loadTopUps();
//   }, []);

//   const loadTopUps = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${API}/getadminpendingtopUps`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setTopups(res.data.topups || []);
//     } catch (e) {
//       toast.error("Failed to load top-up requests");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- approve ---------------- */
//   const approve = async (id) => {
//     try {
//       setProcessingId(id);
//       await axios.patch(
//         `${API}/approvetopUp/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success("Top-up approved");
//       setTopups((p) => p.filter((t) => t._id !== id));
//     } catch {
//       toast.error("Approval failed");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   /* ---------------- reject ---------------- */
//   const reject = async (id) => {
//     try {
//       setProcessingId(id);
//       await axios.patch(
//         `${API}/rejecttopUp/${id}`,
//         { note },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success("Top-up rejected");
//       setTopups((p) => p.filter((t) => t._id !== id));
//       setNote("");
//     } catch {
//       toast.error("Reject failed");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   if (loading) {
//     return <div className="p-8 text-center">Loading...</div>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Pending Wallet Top-Ups</h1>

//       {topups.length === 0 ? (
//         <div className="text-gray-500 text-center">
//           No pending requests
//         </div>
//       ) : (
//         <div className="overflow-x-auto bg-white rounded-xl shadow">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-100 text-left">
//               <tr>
//                 <th className="p-3">User</th>
//                 <th className="p-3">Amount</th>
//                 <th className="p-3">Method</th>
//                 <th className="p-3">Reference</th>
//                 <th className="p-3">Proof</th>
//                 <th className="p-3">Requested</th>
//                 <th className="p-3 text-right">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {topups.map((t) => (
//                 <tr
//                   key={t._id}
//                   className="border-t hover:bg-gray-50"
//                 >
//                   <td className="p-3">
//                     <div className="font-medium">{t.userId?.name}</div>
//                     <div className="text-xs text-gray-500">
//                       {t.userId?.email}
//                     </div>
//                   </td>

//                   <td className="p-3 font-semibold">
//                     ৳{t.amount.toLocaleString()}
//                   </td>

//                   <td className="p-3 capitalize">{t.method}</td>

//                   <td className="p-3 font-mono text-xs">{t.reference}</td>

//                   <td className="p-3">
//                     <button
//                       onClick={() => setPreview(t.proof)}
//                       className="flex items-center gap-1 text-indigo-600"
//                     >
//                       <Eye size={14} /> View
//                     </button>
//                   </td>

//                   <td className="p-3 text-xs text-gray-500">
//                     {new Date(t.createdAt).toLocaleString()}
//                   </td>

//                   <td className="p-3 text-right space-x-2">
//                     <button
//                       disabled={processingId === t._id}
//                       onClick={() => approve(t._id)}
//                       className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-green-600 text-white text-xs"
//                     >
//                       <Check size={14} /> Approve
//                     </button>

//                     <button
//                       disabled={processingId === t._id}
//                       onClick={() => reject(t._id)}
//                       className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-red-600 text-white text-xs"
//                     >
//                       <X size={14} /> Reject
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* -------- image preview modal -------- */}
//       {preview && (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
//           <div className="bg-white rounded-xl p-4 max-w-md">
//             <img src={preview} alt="Proof" className="rounded" />
//             <button
//               onClick={() => setPreview(null)}
//               className="mt-3 w-full border rounded py-2"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* -------- reject modal -------- */}
//       {rejecting && (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
//           <div className="bg-white rounded-xl p-6 w-full max-w-sm">
//             <h3 className="font-semibold mb-3">Reject Top-Up</h3>

//             <textarea
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//               placeholder="Reject reason (optional)"
//               className="w-full border rounded p-2 text-sm"
//             />

//             <div className="flex gap-2 mt-4">
//               <button
//                 onClick={() => setRejecting(null)}
//                 className="w-full border rounded py-2"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={reject}
//                 className="w-full bg-red-600 text-white rounded py-2"
//               >
//                 Reject
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }











"use client";

import axios from "axios";
import { Check, Eye, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function AdminTopUpsPage() {
  const [topups, setTopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [rejecting, setRejecting] = useState(null);
  const [note, setNote] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ---------------- fetch pending topups ---------------- */
  useEffect(() => {
    loadTopUps();
  }, []);

  const loadTopUps = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/getadminpendingtopUps`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopups(res.data.topups || []);
    } catch {
      toast.error("Failed to load top-up requests");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- approve ---------------- */
  const approve = async (id) => {
    try {
      setProcessingId(id);
      await axios.patch(
        `${API}/approvetopUp/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Top-up approved");
      setTopups((p) => p.filter((t) => t._id !== id));
    } catch {
      toast.error("Approval failed");
    } finally {
      setProcessingId(null);
    }
  };

  /* ---------------- reject ---------------- */
  const confirmReject = async () => {
    if (!rejecting) return;

    try {
      setProcessingId(rejecting._id);
      await axios.patch(
        `${API}/rejecttopUp/${rejecting._id}`,
        { note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Top-up rejected");
      setTopups((p) => p.filter((t) => t._id !== rejecting._id));
      setRejecting(null);
      setNote("");
    } catch {
      toast.error("Reject failed");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Wallet Top-Ups</h1>

      {topups.length === 0 ? (
        <div className="text-gray-500 text-center">
          No pending requests
        </div>
      ) : (
        <>
          {/* ---------------- Desktop Table ---------------- */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Proof</th>
                  <th className="p-3">Requested</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {topups.map((t) => (
                  <tr key={t._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={t.userId?.image || "/avatar.png"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium">{t.userId?.firstName} {t.userId?.lastName}</div>
                        <div className="text-xs text-gray-500">
                          {t.userId?.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          {t.userId?.phone}
                        </div>
                      </div>
                    </td>

                    <td className="p-3 font-semibold">
                      ৳{t.amount.toLocaleString()}
                    </td>

                    <td className="p-3 capitalize">{t.method}</td>

                    <td className="p-3 font-mono text-xs">{t.reference}</td>

                    <td className="p-3">
                      <button
                        onClick={() => setPreview(t.proof)}
                        className="text-indigo-600 flex items-center gap-1"
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>

                    <td className="p-3 text-xs text-gray-500">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>

                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => approve(t._id)}
                        disabled={processingId === t._id}
                        className="px-3 py-1.5 bg-green-600 text-white rounded text-xs"
                      >
                        <Check size={14} className="inline" /> Approve
                      </button>

                      <button
                        onClick={() => setRejecting(t)}
                        disabled={processingId === t._id}
                        className="px-3 py-1.5 bg-red-600 text-white rounded text-xs"
                      >
                        <X size={14} className="inline" /> Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ---------------- Mobile Cards ---------------- */}
          <div className="md:hidden space-y-4">
            {topups.map((t) => (
              <div key={t._id} className="bg-white rounded-xl shadow p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={t.userId?.image || "/avatar.png"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{t.userId?.firstName} {t.userId?.lastName}</div>
                    <div className="text-xs text-gray-500">
                      {t.userId?.email}
                    </div>
                    <div className="text-xs text-gray-400">
                      {t.userId?.phone}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-sm space-y-1">
                  <div>Amount: <b>৳{t.amount}</b></div>
                  <div>Method: {t.method}</div>
                  <div>Ref: {t.reference}</div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setPreview(t.proof)}
                    className="w-full border rounded py-2 text-sm"
                  >
                    View Proof
                  </button>
                  <button
                    onClick={() => approve(t._id)}
                    className="w-full bg-green-600 text-white rounded py-2 text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setRejecting(t)}
                    className="w-full bg-red-600 text-white rounded py-2 text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* -------- image preview -------- */}
      {preview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-4 max-w-md">
            <img src={preview} className="rounded" />
            <button
              onClick={() => setPreview(null)}
              className="mt-3 w-full border rounded py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* -------- reject modal -------- */}
      {rejecting && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-semibold mb-3">Reject Top-Up</h3>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Reject reason (optional)"
              className="w-full border rounded p-2 text-sm"
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setRejecting(null)}
                className="w-full border rounded py-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="w-full bg-red-600 text-white rounded py-2"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
