// "use client";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { CheckCircle, Clock, Loader2, Shield, XCircle } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";
// const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

// export default function VendorRequestsPage() {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [rejectNote, setRejectNote] = useState({});
//   const [processingId, setProcessingId] = useState(null);

//   // 🧭 Fetch All Requests
//   const fetchRequests = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/vendor/requests`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRequests(res.data.requests || []);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//       toast.error("Failed to fetch vendor requests.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   // ✅ Approve / Reject handler
//   const handleStatusUpdate = async (id, status) => {
//     try {
//       setProcessingId(id);

//       const body = { status };
//       if (status === "rejected") body.adminNote = rejectNote[id] || "";

//       const res = await axios.patch(
//         `${API_BASE}/vendor/request/${id}`,
//         body,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast.success(res.data.message);
//       await fetchRequests();
//     } catch (err) {
//       console.error("Update Error:", err);
//       toast.error(err.response?.data?.message || "Failed to update request.");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
//         <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Loading vendor requests...
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="p-6 space-y-6"
//     >
//       <h1 className="text-3xl font-bold flex items-center gap-2">
//         <Shield className="w-7 h-7 text-emerald-500" />
//         Vendor Requests
//       </h1>

//       {requests.length === 0 ? (
//         <p className="text-gray-500 text-center py-12 text-lg">
//           No vendor requests found.
//         </p>
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//           {requests.map((req) => (
//             <Card
//               key={req._id}
//               className="border shadow-lg rounded-2xl transition-all hover:shadow-2xl bg-white dark:bg-gray-800"
//             >
//               <CardHeader>
//                 <CardTitle className="text-lg font-semibold">
//                   {req.businessName || "Unnamed Business"}
//                 </CardTitle>
//                 <p className="text-sm text-gray-500">
//                   {req.businessEmail}
//                 </p>
//               </CardHeader>

//               <CardContent className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
//                 <p><b>Owner:</b> {req.userId?.firstName} {req.userId?.lastName}</p>
//                 <p><b>Phone:</b> {req.businessPhone}</p>
//                 <p><b>Address:</b> {req.businessAddress}</p>
//                 <p><b>License:</b> {req.tradeLicenseNumber}</p>

//                 <div className="flex items-center gap-2 mt-3">
//                   {req.status === "approved" && (
//                     <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1">
//                       <CheckCircle size={14} /> Approved
//                     </span>
//                   )}
//                   {req.status === "pending" && (
//                     <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium flex items-center gap-1">
//                       <Clock size={14} /> Pending
//                     </span>
//                   )}
//                   {req.status === "rejected" && (
//                     <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-medium flex items-center gap-1">
//                       <XCircle size={14} /> Rejected
//                     </span>
//                   )}
//                 </div>

//                 {req.status === "rejected" && req.adminNote && (
//                   <p className="mt-2 text-rose-600 text-xs italic border-l-4 border-rose-400 pl-2">
//                     <b>Admin Note:</b> {req.adminNote}
//                   </p>
//                 )}

//                 <div className="mt-4 space-y-2">
//                   {req.status === "pending" && (
//                     <>
//                       <Button
//                         onClick={() => handleStatusUpdate(req._id, "approved")}
//                         disabled={processingId === req._id}
//                         className="w-full bg-emerald-600 hover:bg-emerald-700"
//                       >
//                         {processingId === req._id ? (
//                           <Loader2 className="animate-spin w-4 h-4 mr-1" />
//                         ) : (
//                           "Approve"
//                         )}
//                       </Button>

//                       <Textarea
//                         placeholder="Reason for rejection (optional)"
//                         onChange={(e) =>
//                           setRejectNote({ ...rejectNote, [req._id]: e.target.value })
//                         }
//                         className="text-sm"
//                       />

//                       <Button
//                         onClick={() => handleStatusUpdate(req._id, "rejected")}
//                         disabled={processingId === req._id}
//                         className="w-full bg-rose-600 hover:bg-rose-700"
//                       >
//                         {processingId === req._id ? (
//                           <Loader2 className="animate-spin w-4 h-4 mr-1" />
//                         ) : (
//                           "Reject"
//                         )}
//                       </Button>
//                     </>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </motion.div>
//   );
// }











"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Loader2, Shield, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

export default function VendorRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧭 Fetch All Requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE}/vendor/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Loading vendor requests...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Shield className="w-7 h-7 text-emerald-500" />
        Vendor Requests
      </h1>

      {requests.length === 0 ? (
        <p className="text-gray-500 text-center py-12 text-lg">
          No vendor requests found.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {requests.map((req) => (
            <Link
              key={req._id}
              href={`/admin/dashboard/vendor-requests/details/${req._id}`} // এখানে ডিটেইলস পেজের লিংক
              className="block"
            >
              <Card className="border shadow-lg rounded-2xl transition-all hover:shadow-2xl bg-white dark:bg-gray-800 cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {req.businessName || "Unnamed Business"}
                  </CardTitle>
                  <p className="text-sm text-gray-500">{req.businessEmail}</p>
                </CardHeader>

                <CardContent className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                  <p><b>Owner:</b> {req.userId?.firstName} {req.userId?.lastName}</p>
                  <p><b>Phone:</b> {req.businessPhone}</p>
                  <p><b>Address:</b> {req.businessAddress}</p>
                  <p><b>License:</b> {req.tradeLicenseNumber}</p>

                  <div className="flex items-center gap-2 mt-3">
                    {req.status === "approved" && (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1">
                        <CheckCircle size={14} /> Approved
                      </span>
                    )}
                    {req.status === "pending" && (
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium flex items-center gap-1">
                        <Clock size={14} /> Pending
                      </span>
                    )}
                    {req.status === "rejected" && (
                      <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-medium flex items-center gap-1">
                        <XCircle size={14} /> Rejected
                      </span>
                    )}
                  </div>

                  {req.status === "rejected" && req.adminNote && (
                    <p className="mt-2 text-rose-600 text-xs italic border-l-4 border-rose-400 pl-2">
                      <b>Admin Note:</b> {req.adminNote}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
