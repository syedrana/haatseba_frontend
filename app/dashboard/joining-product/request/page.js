"use client";

import axios from "axios";
import { Check, ShoppingCart } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import CheckoutDrawer from "../../../components/package/CheckoutDrawer";
import PackageCard from "../../../components/package/PackageCard";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

/* -------------------------
   Small helpers
   ------------------------- */
const formatCurrency = (v) =>
  typeof v === "number" ? `৳${v.toLocaleString("en-US")}` : v;

/* -------------------------
   Main Page (Ultra Pro UI)
   ------------------------- */
export default function BecomeAgentPage() {
  
  const [pkgList, setPkgList] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [showDrawer, setShowDrawer] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // load packages
  useEffect(() => {
    (async () => {
      try {
        setLoadingPackages(true);
        const res = await axios.get(`${API_BASE}/loadagentpackages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPkgList(res.data.packages || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load packages. Try again later.");
      } finally {
        setLoadingPackages(false);
      }
    })();
  }, [token]);

  // load wallet
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/getmywallet`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWalletBalance(res.data?.wallet?.cashBalance || 0);
      } catch (err) {
        console.error(err);
        setError("Failed to load wallet. Try again later.");
      } 
    })();
  }, [token]);

  const handleSelect = (p) => {
    setSelected(p);
    setQty(1);
    setShowDrawer(true);
    setError("");
  };

  const handleConfirm = async () => {
    if (!selected) return toast.error("Select a package first");
    if (!hasEnoughWallet) return toast.error("Insufficient wallet balance");
    if (!qty || qty < 1) return setError("Invalid quantity.");

    setPlacing(true);
    setError("");

    try {
      const payload = {
        packageId: selected._id,
        quantity: qty,
        paymentType: "wallet",
      };

      const res = await axios.post(`${API_BASE}/placeagentorder`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessData(res.data);
      toast.success("Order placed successfully");
      setShowDrawer(false);
      // Optional: mark package as selected/disabled or refresh list
      // reload packages to reflect new stock
      (async () => {
        try {
          const r = await axios.get(`${API_BASE}/loadagentpackages`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPkgList(r.data.packages || []);
        } catch { /* ignore */ }
      })();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Order failed. Try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  const totalAmount = useMemo(() => (selected ? (selected.price * qty) : 0), [selected, qty]);
  const hasEnoughWallet = useMemo(
  () => walletBalance >= totalAmount,
  [walletBalance, totalAmount]
);


  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Buy joining product</h1>
          <p className="text-gray-600 mt-1">Choose a package and complete checkout.</p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="text-sm text-gray-600">Cart</div>
          <div className="bg-indigo-600 text-white px-3 py-2 rounded flex items-center gap-2">
            <ShoppingCart size={16} />
            <span>{selected ? 1 : 0} selected</span>
          </div>
        </div>
      </div>

      {/* error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* packages */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingPackages ? (
          // skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-64" />
          ))
        ) : pkgList.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No packages found</div>
        ) : (
          pkgList.map((p) => (
            <PackageCard
              key={p._id}
              pkg={p}
              selected={selected?._id === p._id}
              onSelect={handleSelect}
            />
          ))
        )}
      </section>

      {/* sticky footer for mobile */}
      <div className="fixed left-0 right-0 bottom-0 md:hidden p-4 bg-gradient-to-t from-white/90 to-transparent">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-gray-500">Total</div>
            <div className="text-lg font-semibold">{formatCurrency(totalAmount)}</div>
            <div className="text-xs text-gray-400">{selected ? selected.name : "No package selected"}</div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (!selected) return toast.error("Select a package");
                setShowDrawer(true);
              }}
              className={`px-4 py-3 rounded-lg text-white font-semibold ${selected ? "bg-indigo-600" : "bg-gray-300"}`}
              disabled={!selected}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Drawer */}
      <CheckoutDrawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        pkg={selected}
        qty={qty}
        setQty={setQty}
        onConfirm={handleConfirm}
        loading={placing}
        walletBalance={walletBalance}
      />

      {/* success panel */}
      {successData && (
        <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-full">
            <Check size={20} className="text-green-700" />
          </div>
          <div>
            <div className="font-semibold text-green-800">Order submitted</div>
            <div className="text-sm text-gray-700 mt-1">{successData.message || "Your order is pending approval."}</div>
            <div className="text-xs text-gray-500 mt-1">Order id: <span className="font-mono">{successData.order?._id || "—"}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
