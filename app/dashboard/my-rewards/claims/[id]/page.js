"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000/api";

export default function ClaimDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchClaim = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/myclaims/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClaim(res.data.data || res.data.claim || null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load claim");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchClaim();
  }, [fetchClaim]);

  const handleCancel = async () => {
    if (!confirm("Cancel this claim?")) return;
    setActionLoading(true);
    try {
      const res = await axios.put(`${API_BASE}/myclaimscancel/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message || "Cancelled");
      await fetchClaim();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Cancel failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!claim) return <div className="p-4">Claim not found</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Toaster />
      <h1 className="text-2xl font-bold mb-3">Claim Details</h1>

      <div className="p-4 border rounded mb-3">
        <div className="text-sm"><b>Bonus:</b> {claim.bonusId?.bonusAmount}</div>
        <div className="text-sm"><b>Level:</b> {claim.bonusId?.level}</div>
        <div className="text-sm"><b>Status:</b> {claim.status}</div>
      </div>

      <div className="p-4 border rounded mb-3">
        <h3 className="font-semibold mb-2">Shipping</h3>
        <div><b>Name:</b> {claim.shippingName}</div>
        <div><b>Phone:</b> {claim.shippingPhone}</div>
        <div><b>Address:</b> {claim.shippingAddress}</div>
      </div>

      {claim.trackingNumber && (
        <div className="p-4 border rounded mb-3">
          <h3 className="font-semibold mb-2">Shipment</h3>
          <div><b>Tracking:</b> {claim.trackingNumber}</div>
          <div><b>Courier:</b> {claim.courier}</div>
        </div>
      )}

      <div className="flex gap-2">
        {["pending", "processing"].includes(claim.status) && (
          <button onClick={handleCancel} disabled={actionLoading} className="px-4 py-2 bg-red-600 text-white rounded">Cancel Claim</button>
        )}

        <button onClick={() => router.push("/dashboard/my-rewards/claims")} className="px-4 py-2 bg-gray-200 rounded">Back</button>
      </div>
    </div>
  );
}
