"use client";

import axios from "axios";
import {
  ArrowLeft,
  CheckCircle2,
  Inbox,
  Truck,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";

function StatusBadge({ status }) {
  const map = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    processing: "bg-orange-100 text-orange-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-green-200 text-green-900",
    cancelled: "bg-gray-200 text-gray-700",
    rejected: "bg-red-100 text-red-800",
  };
  const cls = map[status] || "bg-gray-100 text-gray-800";
  return <span className={`px-2 py-1 rounded-md text-xs font-semibold ${cls}`}>{status}</span>;
}

export default function ClaimDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showShipForm, setShowShipForm] = useState(false);
  const [shipData, setShipData] = useState({ trackingNumber: "", courier: "" });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // fetch single claim — NOTE: use correct endpoint and extract res.data.data
  const fetchClaim = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      // <<<<<<<<<<<<<<<< CORRECTED ENDPOINT: /claims/:id >>>>>>>>>>>>>>
      const res = await axios.get(`${API_BASE}/singleclaims/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Backend returns: { success: true, data: { ... } }
      const payload = res.data?.data ?? res.data?.claim ?? res.data;
      setClaim(payload || null);

      // prefill shipData if already present
      if (payload) {
        setShipData({ trackingNumber: payload.trackingNumber || "", courier: payload.courier || "" });
      }
    } catch (err) {
      console.error("Fetch claim error:", err);
      toast.error("Failed to load claim");
      setClaim(null);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchClaim();
     
  }, [fetchClaim]);

  // Generic PUT action helper
  async function callAction(endpoint, data = {}) {
    if (!id) return;
    setActionLoading(true);
    try {
      // endpoints passed like "/claimsapprove" (no trailing slash)
      const res = await axios.put(`${API_BASE}${endpoint}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message || "Success");
      await fetchClaim();
      setShowShipForm(false);
    } catch (err) {
      console.error("Action error:", err);
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  }

  // Handlers
  const handleApprove = async () => {
    if (!confirm("Approve this claim? This will set it to processing.")) return;
    await callAction("/claimsapprove");
  };

  const handleReject = async () => {
    const note = prompt("Enter reject reason (optional):", "");
    if (note === null) return;
    await callAction("/claimsreject", { adminNote: note });
  };

  const handleCancel = async () => {
    const note = prompt("Enter cancellation note (optional):", "");
    if (note === null) return;
    await callAction("/claimscancel", { adminNote: note });
  };

  const handleMarkShipped = async () => {
    if (!shipData.trackingNumber || !shipData.courier) {
      toast.error("Please provide tracking number and courier");
      return;
    }
    if (!confirm("Mark this claim as shipped?")) return;
    await callAction("/claimsshipped", shipData);
  };

  const handleMarkDelivered = async () => {
    if (!confirm("Mark this claim as delivered? This will complete the bonus.")) return;
    await callAction("/claimsdelivered");
  };

  // UI states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded shadow">
          <p>Loading claim...</p>
        </div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <Toaster />
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow text-center">
          <p className="mb-4">Claim not found.</p>
          <button onClick={() => router.push("/admin/claims")} className="px-4 py-2 bg-gray-200 rounded inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Back to claims
          </button>
        </div>
      </div>
    );
  }

  const user = claim.userId || {};
  const bonus = claim.bonusId || {};

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <Toaster />
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/admin/dashboard/bonus-management/claims")} className="px-3 py-2 bg-white rounded border inline-flex items-center gap-2">
              <ArrowLeft size={16} /> Back
            </button>
            <h1 className="text-2xl font-bold">Claim Details</h1>
          </div>

          <div className="text-right space-y-1">
            <div className="text-sm text-gray-500">Claim ID</div>
            <div className="font-mono text-sm">{claim._id}</div>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left: User */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="w-28 h-28 relative rounded-full overflow-hidden border">
                {user.image ? (
                  // next/image requires next.config.js domains for remote images.
                  // If you haven't set that, you can replace <Image> with <img src={user.image} ... />
                  <Image src={user.image} alt={user.firstName || "User"} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">No Image</div>
                )}
              </div>

              <div className="text-sm text-center md:text-left">
                <div className="font-semibold">{user.firstName} {user.lastName}</div>
                <div className="text-xs text-gray-500">{user.email || "-"}</div>
                <div className="text-xs text-gray-500">{user.phone || "-"}</div>
              </div>
            </div>

            {/* Middle: Shipping & Bonus */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Shipping Information</h2>
                  <p className="text-sm"><b>Name:</b> {claim.shippingName || "-"}</p>
                  <p className="text-sm"><b>Phone:</b> {claim.shippingPhone || "-"}</p>
                  <p className="text-sm"><b>Address:</b> {claim.shippingAddress || "-"}</p>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500">Status</div>
                  <StatusBadge status={claim.status} />
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Bonus / Reward</h3>
                <div className="text-sm">
                  <p><b>Level:</b> {bonus.level ?? "-"}</p>
                  <p><b>Reward Type:</b> {bonus.rewardType ?? "-"}</p>
                  <p><b>Bonus Amount:</b> {bonus.bonusAmount ?? "-"}</p>
                </div>
              </div>

              {claim.trackingNumber && (
                <div>
                  <h3 className="font-semibold">Tracking</h3>
                  <p className="text-sm"><b>Tracking Number:</b> {claim.trackingNumber}</p>
                  <p className="text-sm"><b>Courier:</b> {claim.courier}</p>
                </div>
              )}

              {claim.adminNote && (
                <div>
                  <h3 className="font-semibold">Admin Note</h3>
                  <p className="text-sm">{claim.adminNote}</p>
                </div>
              )}
            </div>
          </div>

          <hr className="my-4" />

          {/* Time log */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div><b>Claimed At:</b><div className="text-gray-600">{claim.claimedAt ? new Date(claim.claimedAt).toLocaleString() : "-"}</div></div>
            <div><b>Processed At:</b><div className="text-gray-600">{claim.processedAt ? new Date(claim.processedAt).toLocaleString() : "-"}</div></div>
            <div><b>Delivered At:</b><div className="text-gray-600">{claim.deliveredAt ? new Date(claim.deliveredAt).toLocaleString() : "-"}</div></div>
          </div>

          <hr className="my-4" />

          {/* Actions */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              {claim.status === "pending" && (
                <>
                  <button disabled={actionLoading} onClick={handleApprove} className="px-4 py-2 bg-emerald-600 text-white rounded inline-flex items-center gap-2">
                    <CheckCircle2 size={16} /> Approve
                  </button>
                  <button disabled={actionLoading} onClick={handleReject} className="px-4 py-2 bg-rose-600 text-white rounded inline-flex items-center gap-2">
                    <XCircle size={16} /> Reject
                  </button>
                </>
              )}

              {claim.status === "processing" && (
                <>
                  <button disabled={actionLoading} onClick={() => setShowShipForm((s) => !s)} className="px-4 py-2 bg-blue-600 text-white rounded inline-flex items-center gap-2">
                    <Truck size={16} /> Ship
                  </button>
                  <button disabled={actionLoading} onClick={handleCancel} className="px-4 py-2 bg-gray-600 text-white rounded inline-flex items-center gap-2">
                    <Inbox size={16} /> Cancel
                  </button>
                </>
              )}

              {["processing", "shipped"].includes(claim.status) && (
                <button disabled={actionLoading} onClick={handleMarkDelivered} className="px-4 py-2 bg-green-600 text-white rounded inline-flex items-center gap-2">
                  <CheckCircle2 size={16} /> Mark Delivered
                </button>
              )}

              {/* allow cancel also from pending */}
              {claim.status === "pending" && (
                <button disabled={actionLoading} onClick={handleCancel} className="px-4 py-2 bg-gray-600 text-white rounded inline-flex items-center gap-2">
                  Cancel
                </button>
              )}
            </div>

            {/* Ship form */}
            {showShipForm && (
              <div className="mt-2 p-3 border rounded space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input placeholder="Tracking Number" value={shipData.trackingNumber} onChange={(e) => setShipData({ ...shipData, trackingNumber: e.target.value })} className="border p-2 rounded" />
                  <input placeholder="Courier Name" value={shipData.courier} onChange={(e) => setShipData({ ...shipData, courier: e.target.value })} className="border p-2 rounded" />
                </div>
                <div className="flex gap-2">
                  <button disabled={actionLoading} onClick={handleMarkShipped} className="px-4 py-2 bg-indigo-600 text-white rounded">Confirm Shipped</button>
                  <button onClick={() => setShowShipForm(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
