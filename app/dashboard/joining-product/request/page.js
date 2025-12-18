"use client";

import axios from "axios";
import { Check, Minus, Plus, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

/* -------------------------
   Small helpers
   ------------------------- */
const formatCurrency = (v) =>
  typeof v === "number" ? `৳${v.toLocaleString("en-US")}` : v;



/* -------------------------
   ProductCard (premium)
   ------------------------- */
function PackageCard({ pkg, selected, onSelect }) {
  return (
    <article
      onClick={() => onSelect(pkg)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(pkg);
      }}
      className={`cursor-pointer rounded-2xl border transition-shadow p-4 flex flex-col gap-3
        ${selected ? "border-indigo-500 shadow-lg bg-indigo-50/60" : "border-gray-200 hover:shadow-md"}`}
      aria-pressed={!!selected}
      role="button"
    >
      {/* Header: Package Name + Price */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{pkg.name}</h3>
        <div className="text-xl font-bold text-indigo-600">{formatCurrency(pkg.price)}</div>
      </div>

      {/* Description */}
      <div className="text-sm text-gray-600 line-clamp-3">{pkg.description || ""}</div>

      {/* Products Section */}
      <div className="mt-auto">
        <div className="text-xs text-gray-500 mb-2">Includes</div>

        {/* Horizontal Scrollable Product Cards */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {pkg.products?.map((it, idx) => (
            <div
              key={idx}
              className="relative w-32 flex-shrink-0 rounded-lg overflow-hidden border bg-white shadow-sm hover:shadow-md transition p-2"
            >
              {/* Product Image */}
              <div className="relative w-full h-24 rounded-lg overflow-hidden bg-gray-100">
                {it.productId.image ? (
                  <Image
                    src={it.productId.image}
                    alt={it.productId.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
                {/* Type Tag */}
                <span className="absolute top-1 left-1 bg-white/80 text-xs px-2 py-0.5 rounded-full font-medium">
                  ৳ {it.productId.price || "Agent Pack"}
                </span>
              </div>

              {/* Product Name */}
              <div className="mt-1 text-sm font-medium truncate">{it.productId?.name || "Product"}</div>

              {/* Quantity */}
              <div className="text-xs text-gray-500">x{it.quantity}</div>
              <div className="text-xs text-gray-500">x{it.joining_quantity}</div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

/* -------------------------
   Checkout Drawer / Modal
   ------------------------- */
function CheckoutDrawer({
  open,
  onClose,
  pkg,
  qty,
  setQty,
  paymentType,
  setPaymentType,
  onConfirm,
  loading,
}) {
  if (!open || !pkg) return null;

  // responsive: on small screens take full screen, on md+ show side drawer
  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex"
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-hidden
      />

      {/* drawer */}
      <div className="relative ml-auto w-full md:w-[420px] h-full bg-white p-5 overflow-auto">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-xl font-bold">Checkout</h4>
            <div className="text-sm text-gray-500">You&apos;re buying: <span className="font-medium">{pkg.name}</span></div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Close checkout"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4">
          {/* package preview */}
          <div className="flex gap-3 items-center">
            <div>
              <p className="font-semibold">{pkg.name}</p>
              <p className="text-sm text-gray-500">{pkg.products?.length || 0} items included</p>
              {pkg.products?.map((it, idx) => (
                <div
                  key={idx}
                  className="relative w-full"
                >
                  <div className="mt-1 text-sm font-medium truncate">{it.productId?.name || "Product"} x{it.quantity}</div>
                </div>
              ))}
              <p className="text-indigo-600 font-bold mt-1">{formatCurrency(pkg.price)}</p>
            </div>
          </div>

          {/* qty control */}
          <div>
            <label className="text-sm font-medium">Quantity</label>
            <div className="mt-2 inline-flex items-center gap-3">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-1 border rounded"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <div className="min-w-[52px] text-center text-lg font-semibold">{qty}</div>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-1 border rounded"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2">Available stock: <span className="font-medium">{pkg.stock ?? "—"}</span></div>
          </div>

          {/* payment type */}
          <div>
            <label className="text-sm font-medium">Payment</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => setPaymentType("cod")}
                className={`px-3 py-2 rounded border text-sm text-left ${paymentType === "cod" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"}`}
              >
                Cash on Delivery
                <div className="text-xs text-white/80">{paymentType === "cod" ? "Selected" : ""}</div>
              </button>

              <button
                onClick={() => setPaymentType("online")}
                className={`px-3 py-2 rounded border text-sm text-left ${paymentType === "online" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"}`}
              >
                Online Payment
                <div className="text-xs text-white/80">{paymentType === "online" ? "Selected" : ""}</div>
              </button>
            </div>
          </div>

          {/* order breakdown */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Unit price</span>
              <span>{formatCurrency(pkg.price)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>Quantity</span>
              <span>{qty}</span>
            </div>
            <div className="flex justify-between text-base font-semibold mt-3">
              <span>Total</span>
              <span>{formatCurrency(pkg.price * qty)}</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">Taxes & shipping will be handled by admin (if applicable).</div>
          </div>

          {/* actions */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded border w-full"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 rounded bg-indigo-600 text-white w-full flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : (
                <>
                  <ShoppingCart size={16} /> Confirm & Pay
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   Main Page (Ultra Pro UI)
   ------------------------- */
export default function BecomeAgentPage() {
  
  const [pkgList, setPkgList] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [paymentType, setPaymentType] = useState("cod");
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

  const handleSelect = (p) => {
    setSelected(p);
    setQty(1);
    setPaymentType("cod");
    setShowDrawer(true);
    setError("");
  };

  const handleConfirm = async () => {
    if (!selected) return setError("Select a package first.");
    if (!qty || qty < 1) return setError("Invalid quantity.");

    // client-side stock check (optional)
    if (selected.stock != null && qty > selected.stock) {
      return setError("Quantity exceeds available stock.");
    }

    setPlacing(true);
    setError("");

    try {
      const payload = {
        packageId: selected._id,
        quantity: qty,
        paymentType,
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
        paymentType={paymentType}
        setPaymentType={setPaymentType}
        onConfirm={handleConfirm}
        loading={placing}
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
