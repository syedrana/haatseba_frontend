"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000/api";

export default function MyClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchClaims = useCallback (async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/myclaims`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClaims(res.data.claims || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your claims");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">My Claims</h1>

      {loading ? (
        <div>Loading…</div>
      ) : claims.length === 0 ? (
        <div>No claims found</div>
      ) : (
        <div className="space-y-3">
          {claims.map((c) => (
            <div key={c._id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{c.bonusId?.bonusAmount || "Reward"}</div>
                <div className="text-sm text-gray-600">Level: {c.bonusId?.level}</div>
                <div className="text-sm text-gray-600">Status: {c.status}</div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => router.push(`/dashboard/my-rewards/claims/${c._id}`)} className="px-3 py-1 bg-gray-200 rounded">Details</button>
                {/* If you want direct re-claim or edit shipping later (optional) */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
