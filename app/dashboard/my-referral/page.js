"use client";

import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState("");
  const [children, setChildren] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/getreferralCode`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status !== 200) {
          throw new Error("Failed to load referral data");
        }

        setReferralCode(res.data.referralCode);
        setChildren(res.data.children || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load referral data");
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, []);

  if (loading) {
    return <p className="mt-10 text-sm text-gray-500">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="mt-10 text-sm text-red-500">{error}</p>;
  }

  const referralLink = `${
    process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"
  }/register?ref=${referralCode}`;

  return (
    <div className="space-y-10">

      {/* ================= Referral Link ================= */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur p-5 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
          My Referral Link
        </h3>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 break-all text-sm border rounded-xl px-3 py-2 bg-white/80 dark:bg-gray-900/40">
            {referralLink}
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(referralLink);
              alert("Referral link copied ✅");
            }}
            className="px-4 py-2 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-sm shadow-sm"
          >
            Copy
          </button>
        </div>
      </motion.div>

      {/* ================= Direct Referrals ================= */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur p-5 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Direct Referrals
          </h3>
          <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
            {children.length} Members
          </span>
        </div>

        {children.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-10">
            You don’t have any direct referrals yet.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {children.map((child, index) => (
              <motion.div
                key={child._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition"
              >
                {/* ===== Image (Next.js Optimized) ===== */}
                <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  {child.image ? (
                    <Image
                      src={child.image}
                      alt={child.firstName}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      priority={index < 3} // 🔥 LCP optimize
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}

                  <span className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full bg-black/70 text-white">
                    Level {child.level}
                  </span>
                </div>

                {/* ===== Content ===== */}
                <div className="p-4 space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {child.firstName} {child.lastName}
                  </h4>

                  <p className="text-xs text-gray-500">{child.email}</p>
                  <p className="text-xs text-gray-500">{child.phone}</p>

                  <div className="flex justify-between items-center pt-2 text-xs text-gray-500">
                    <span>Ref: {child.referralCode}</span>
                    <span className={child.referralLocked ? "text-red-500" : "text-emerald-500"}>
                      {child.referralLocked ? "🔒 Locked" : "🟢 Active"}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400">
                    Joined: {new Date(child.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
