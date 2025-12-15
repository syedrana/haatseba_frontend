// "use client";

// import axios from "axios";
// import Image from "next/image";
// import { useCallback, useEffect, useState } from "react";

// const API = process.env.NEXT_PUBLIC_API_BASE;

// export default function AdminPendingProfileUpdates() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [rejectReason, setRejectReason] = useState("");
//   const [rejectUserId, setRejectUserId] = useState(null);

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   // ================= FETCH =================
//   const fetchPending = useCallback(async () => {
//     try {
//       const res = await axios.get(`${API}/getpendingprofileupdates`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(res.data.users || []);
//     } catch (err) {
//       alert("Failed to load pending updates");
//     } finally {
//       setLoading(false);
//     }
//   },[token]);

//   useEffect(() => {
//     fetchPending();
//   }, [fetchPending]);

//   // ================= APPROVE =================
//   const approveUpdate = async (id) => {
//     if (!confirm("Approve this profile update?")) return;

//     await axios.put(
//       `${API}/approveprofileupdate/${id}`,
//       {},
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     fetchPending();
//   };

//   // ================= REJECT =================
//   const rejectUpdate = async () => {
//     if (!rejectReason) {
//       alert("Reject reason is required");
//       return;
//     }

//     await axios.put(
//       `${API}/rejectProfileUpdate/${rejectUserId}`,
//       { reason: rejectReason },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     setRejectUserId(null);
//     setRejectReason("");
//     fetchPending();
//   };

//   if (loading) return <div className="p-10">Loading...</div>;

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">
//         Pending Profile Update Requests
//       </h1>

//       {users.length === 0 && (
//         <p className="text-gray-500">No pending requests 🎉</p>
//       )}

//       <div className="space-y-6">
//         {users.map((u) => (
//           <div
//             key={u._id}
//             className="bg-white shadow rounded-xl p-6 border"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <div>
//                 <p className="font-semibold text-lg">
//                   {u.firstName} {u.lastName}
//                 </p>
//                 <p className="text-sm text-gray-500">{u.email}</p>
//                 <p className="text-sm text-gray-500">{u.phone}</p>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={() => approveUpdate(u._id)}
//                   className="bg-green-600 text-white px-4 py-2 rounded-lg"
//                 >
//                   Approve
//                 </button>
//                 <button
//                   onClick={() => setRejectUserId(u._id)}
//                   className="bg-red-600 text-white px-4 py-2 rounded-lg"
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>

//             {/* ================= COMPARISON ================= */}
//             <ProfileCompare
//               oldData={u}
//               newData={u.pendingProfileUpdate.data}
//             />
//           </div>
//         ))}
//       </div>

//       {/* ================= REJECT MODAL ================= */}
//       {rejectUserId && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md">
//             <h2 className="text-xl font-semibold mb-4">
//               Reject Profile Update
//             </h2>

//             <textarea
//               value={rejectReason}
//               onChange={(e) => setRejectReason(e.target.value)}
//               placeholder="Enter reject reason"
//               className="w-full border rounded-lg p-3 mb-4"
//             />

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setRejectUserId(null)}
//                 className="px-4 py-2 border rounded-lg"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={rejectUpdate}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg"
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

// // ================= COMPARE COMPONENT =================
// function ProfileCompare({ oldData, newData }) {
//   if (!newData) return null;

//   const fields = ["firstName", "lastName", "phone", "address"];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//       {/* OLD */}
//       <div>
//         <h3 className="font-semibold mb-2">Current Profile</h3>
//         {oldData.image && (
//           <Image
//             src={oldData.image}
//             width={80}
//             height={80}
//             alt="Old"
//             className="rounded-full mb-2"
//           />
//         )}

//         {fields.map((f) => (
//           <p key={f} className="text-sm">
//             <b>{f}:</b> {oldData[f] || "-"}
//           </p>
//         ))}

//         {newData.nominee && (
//           <div className="mt-2 text-sm">
//             <p className="font-semibold">Nominee</p>
//             <p>{oldData.nominee.firstName} {oldData.nominee.lastName}</p>
//             <p>{oldData.nominee.relation}</p>
//             <p>{oldData.nominee.phone}</p>
//             <p>{oldData.nominee.address}</p>
//           </div>
//         )}
//       </div>

//       {/* NEW */}
//       <div>
//         <h3 className="font-semibold mb-2 text-green-600">
//           Requested Changes
//         </h3>

//         {newData.image && (
//           <Image
//             src={newData.image}
//             width={80}
//             height={80}
//             alt="New"
//             className="rounded-full mb-2 border-2 border-green-500"
//           />
//         )}

//         {fields.map((f) => (
//           <p key={f} className="text-sm text-green-700">
//             <b>{f}:</b> {newData[f] || "(unchanged)"}
//           </p>
//         ))}

//         {newData.nominee && (
//           <div className="mt-2 text-sm">
//             <p className="font-semibold">Nominee</p>
//             <p>{newData.firstName} {newData.lastName}</p>
//             <p>{newData.relation}</p>
//             <p>{newData.phone}</p>
//             <p>{newData.address}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




























"use client";

import axios from "axios";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function AdminPendingProfileUpdates() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectUserId, setRejectUserId] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ================= FETCH =================
  const fetchPending = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/getpendingprofileupdates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      alert("Failed to load pending updates");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  // ================= APPROVE =================
  const approveUpdate = async (id) => {
    if (!confirm("Approve this profile update?")) return;

    await axios.put(
      `${API}/approveprofileupdate/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchPending();
  };

  // ================= REJECT =================
  const rejectUpdate = async () => {
    if (!rejectReason) return alert("Reject reason is required");

    await axios.put(
      `${API}/rejectProfileUpdate/${rejectUserId}`,
      { reason: rejectReason },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setRejectUserId(null);
    setRejectReason("");
    fetchPending();
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Pending Profile Update Requests</h1>

      {users.length === 0 && <p className="text-gray-500">No pending requests 🎉</p>}

      <div className="space-y-6">
        {users.map((u) => {
          const pending = u.pendingProfileUpdate?.data || {};

          return (
            <div key={u._id} className="bg-white rounded-xl shadow border p-4 md:p-6">
              {/* HEADER */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="font-semibold text-lg">{u.firstName} {u.lastName}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                  <p className="text-sm text-gray-500">{u.phone}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => approveUpdate(u._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setRejectUserId(u._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* COMPARE */}
              <ProfileCompare oldData={u} newData={pending} />
            </div>
          );
        })}
      </div>

      {/* REJECT MODAL */}
      {rejectUserId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Reject Profile Update</h2>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reject reason"
              className="w-full border rounded-lg p-3 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRejectUserId(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={rejectUpdate}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
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

// ================= COMPARE COMPONENT =================
function ProfileCompare({ oldData, newData }) {
  const fields = ["firstName", "lastName", "phone", "address"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* CURRENT */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Current Profile</h3>

        {oldData.image && (
          <Image
            src={oldData.image}
            width={80}
            height={80}
            alt="Old"
            className="rounded-full mb-3"
          />
        )}

        {fields.map((f) => (
          <p key={f} className="text-sm">
            <b>{f}:</b> {oldData[f] || "-"}
          </p>
        ))}

        {oldData.nominee && (
          <div className="mt-3 text-sm">
            <p className="font-semibold">Nominee</p>
            <p>{oldData.nominee.firstName} {oldData.nominee.lastName}</p>
            <p>{oldData.nominee.relation}</p>
            <p>{oldData.nominee.phone}</p>
            <p>{oldData.nominee.address}</p>
          </div>
        )}
      </div>

      {/* REQUESTED */}
      <div className="border rounded-lg p-4 bg-green-50">
        <h3 className="font-semibold mb-3 text-green-700">Requested Changes</h3>

        {newData.image && (
          <Image
            src={newData.image}
            width={80}
            height={80}
            alt="New"
            className="rounded-full mb-3 border-2 border-green-500"
          />
        )}

        {fields.map((f) => (
          <p key={f} className="text-sm text-green-800">
            <b>{f}:</b> {newData[f] || "(unchanged)"}
          </p>
        ))}

        {newData.nominee && (
          <div className="mt-3 text-sm text-green-800">
            <p className="font-semibold">Nominee</p>
            <p>{newData.firstName} {newData.lastName}</p>
            <p>{newData.relation}</p>
            <p>{newData.phone}</p>
            <p>{newData.address}</p>
          </div>
        )}
      </div>
    </div>
  );
}
