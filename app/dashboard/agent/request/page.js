// "use client";

// import axios from "axios";
// import { useEffect, useState } from "react";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
// const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

// export default function BecomeAgentPage() {
//   const [pkgList, setPkgList] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(null);
//   const [showPayment, setShowPayment] = useState(false);
//   const [paymentRef, setPaymentRef] = useState("");

//   // Load packages
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await axios.get(`${API_BASE}/loadagentpackages`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setPkgList(res.data.packages || []);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load packages");
//       }
//     })();
//   }, []);

//   const onSelect = (p) => {
//     setSelected(p);
//     setError("");
//   };

//   const openPayment = () => {
//     if (!selected) return setError("Please select a package first.");
//     setShowPayment(true);
//   };

//   // ---- FIXED ORDER API MATCHING SCHEMA ----
//   const doPurchase = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const payload = {
//         packageId: selected._id,

//         // MOST IMPORTANT!!!
//         products: selected.products.map((p) => ({
//           productId: p.productId._id || p.productId,
//           quantity: p.quantity,
//         })),

//         paymentMethod: "manual", // কারণ হাতে হাতে পেমেন্ট
//         paymentRef,
//       };

//       const res = await axios.post(
//         `${API_BASE}/agent/place-order`,
//         payload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setSuccess(res.data);
//       setShowPayment(false);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Order failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Become an Agent</h1>

//       {/* Packages */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         {pkgList.length === 0 ? (
//           <div className="col-span-full text-center text-gray-500">No packages found</div>
//         ) : (
//           pkgList.map((p) => (
//             <div
//               key={p._id}
//               onClick={() => onSelect(p)}
//               className={`cursor-pointer p-4 rounded-lg border transition ${
//                 selected?._id === p._id
//                   ? "border-indigo-500 bg-indigo-50"
//                   : "border-gray-300"
//               }`}
//             >
//               <h3 className="font-semibold">{p.name}</h3>
//               <div className="text-sm font-bold mt-1">৳{p.price}</div>

//               <p className="text-xs text-gray-600 mt-2">Products:</p>

//               <ul className="text-sm mt-1 text-gray-700 space-y-1">
//                 {p.products.map((it, i) => (
//                   <li key={i} className="flex justify-between">
//                     <span>{it.productId?.name || "Product"}</span>
//                     <span>x{it.quantity}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))
//         )}
//       </section>

//       <button
//         onClick={openPayment}
//         disabled={!selected}
//         className={`px-4 py-2 rounded text-white ${
//           selected ? "bg-indigo-600" : "bg-gray-300"
//         }`}
//       >
//         Buy & Become Agent
//       </button>

//       {/* Payment Modal */}
//       {showPayment && selected && (
//         <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg p-4 max-w-md w-full">
//             <h3 className="font-semibold">
//               Payment for: {selected.name}
//             </h3>

//             <p className="mt-2 text-sm">
//               Total: <b>৳{selected.price}</b>
//             </p>

//             <p className="text-xs text-gray-600 mt-3">
//               * Payment will be made manually (হাতে হাতে)
//             </p>

//             <div className="mt-3">
//               <label className="text-xs">Reference / Transaction Note</label>
//               <input
//                 className="w-full border p-2 rounded mt-1"
//                 value={paymentRef}
//                 onChange={(e) => setPaymentRef(e.target.value)}
//               />
//             </div>

//             <div className="mt-4 flex justify-end gap-2">
//               <button
//                 onClick={() => setShowPayment(false)}
//                 className="px-3 py-2 border rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={doPurchase}
//                 disabled={loading || !paymentRef}
//                 className="px-3 py-2 bg-indigo-600 text-white rounded"
//               >
//                 {loading ? "Processing..." : "Confirm Order"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {success && (
//         <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mt-5">
//           Order submitted. Admin will approve and activate your agent account.
//         </div>
//       )}
//     </div>
//   );
// }














// "use client";

// import axios from "axios";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// export default function BecomeAgentPage() {
//   const [pkgList, setPkgList] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [qty, setQty] = useState(1);
//   const [paymentType, setPaymentType] = useState("cod");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(null);
//   const [showCheckout, setShowCheckout] = useState(false);

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   // Load packages
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await axios.get(`${API_BASE}/loadagentpackages`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setPkgList(res.data.packages || []);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load packages");
//       }
//     })();
//   }, [token]);

//   const openCheckout = () => {
//     if (!selected) return setError("Please select a package first.");
//     setShowCheckout(true);
//     setError("");
//   };

//   const placeOrder = async () => {
//     if (!selected) return;

//     setLoading(true);
//     setError("");

//     try {
//       const payload = {
//         packageId: selected._id,
//         quantity: qty,
//         paymentType: paymentType,
//       };

//       const res = await axios.post(`${API_BASE}/placeagentorder`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setSuccess(res.data);
//       setShowCheckout(false);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Order failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Become an Agent</h1>

//       {/* Error */}
//       {error && (
//         <div className="bg-red-100 border border-red-300 text-red-600 p-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {/* Packages Grid */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
//         {pkgList.length === 0 ? (
//           <div className="col-span-full text-center text-gray-500">
//             No packages found
//           </div>
//         ) : (
//           pkgList.map((p) => (
//             <div
//               key={p._id}
//               onClick={() => {
//                 setSelected(p);
//                 setError("");
//               }}
//               className={`cursor-pointer rounded-xl border p-4 shadow-sm hover:shadow-md transition
//                 ${
//                   selected?._id === p._id
//                     ? "border-indigo-500 shadow-lg bg-indigo-50"
//                     : "border-gray-200"
//                 }`}
//             >
              

//               <h3 className="text-lg font-semibold mt-3">{p.name}</h3>
//               <div className="text-xl font-bold text-indigo-600 mt-1">
//                 ৳{p.price}
//               </div>

//               <div className="mt-3 text-sm text-gray-700">
//                 <p className="font-semibold">Includes:</p>
//                 {p.products.map((it, i) => (
//                   <div key={i} >
//                     <div className="w-full h-60 relative rounded-lg overflow-hidden bg-gray-100">
//                       {it.productId?.image ? (
//                       <Image
//                         src={it.productId?.image}
//                         alt={it.productId?.name}
//                         fill
//                         className="object-cover"
//                       />
//                     ) : (
//                       <div className="flex items-center justify-center h-full text-gray-400">
//                         No Image
//                       </div>
//                     )}
//                     </div>
//                     <div>
//                       <p>{it.productId?.name}</p>
//                       <p>MRP: {it.productId?.price}</p>
//                       <p>Quantity: {it.quantity}</p>
//                       <p>Totla joining {it.joining_stock} person</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))
//         )}
//       </section>

//       {/* Buy Button */}
//       <div className="mt-6">
//         <button
//           onClick={openCheckout}
//           disabled={!selected}
//           className={`px-6 py-3 rounded-lg text-white text-lg font-semibold
//             ${
//               selected
//                 ? "bg-indigo-600 hover:bg-indigo-700"
//                 : "bg-gray-300 cursor-not-allowed"
//             }`}
//         >
//           Buy & Become Agent
//         </button>
//       </div>

//       {/* Checkout Modal */}
//       {showCheckout && selected && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl p-5 max-w-md w-full animate-fadeIn">
//             <h3 className="text-xl font-bold">{selected.name}</h3>

//             <div className="mt-2 text-gray-700">
//               Price: <b>৳{selected.price}</b>
//             </div>

//             {/* Quantity */}
//             <div className="mt-4">
//               <p className="text-sm font-semibold">Quantity</p>
//               <div className="flex items-center gap-3 mt-1">
//                 <button
//                   onClick={() => qty > 1 && setQty(qty - 1)}
//                   className="px-3 py-1 border rounded"
//                 >
//                   –
//                 </button>
//                 <span className="text-lg font-semibold">{qty}</span>
//                 <button
//                   onClick={() => setQty(qty + 1)}
//                   className="px-3 py-1 border rounded"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             {/* Payment Type */}
//             <div className="mt-4">
//               <p className="text-sm font-semibold">Payment Type</p>
//               <select
//                 value={paymentType}
//                 onChange={(e) => setPaymentType(e.target.value)}
//                 className="w-full border p-2 rounded mt-1"
//               >
//                 <option value="cod">Cash on Delivery</option>
//                 <option value="online">Online Payment</option>
//               </select>
//             </div>

//             {/* Total */}
//             <div className="mt-4 text-lg font-semibold">
//               Total: ৳{selected.price * qty}
//             </div>

//             {/* Buttons */}
//             <div className="mt-5 flex justify-end gap-3">
//               <button
//                 onClick={() => setShowCheckout(false)}
//                 className="px-4 py-2 border rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={placeOrder}
//                 disabled={loading}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded"
//               >
//                 {loading ? "Processing..." : "Confirm Order"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Success */}
//       {success && (
//         <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mt-5">
//           Order placed successfully! Admin will approve your agent account.
//         </div>
//       )}
//     </div>
//   );
// }












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
      <div className="relative w-full h-44 rounded-lg overflow-hidden bg-gray-100">
        {pkg.image ? (
          <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
        <span className="absolute top-3 left-3 bg-white/80 text-xs px-2 py-1 rounded-full font-medium">
          {pkg.type || "Agent Pack"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{pkg.name}</h3>
        <div className="text-xl font-bold text-indigo-600">{formatCurrency(pkg.price)}</div>
      </div>

      <div className="text-sm text-gray-600 line-clamp-3">{pkg.description || ""}</div>

      <div className="mt-auto">
        <div className="text-xs text-gray-500 mb-2">Includes</div>
        <ul className="text-sm text-gray-700 space-y-1 max-h-28 overflow-auto pr-2">
          {pkg.products?.map((it, idx) => (
            <li key={idx} className="flex justify-between items-center">
              <div className="truncate">{it.productId?.name || "Product"}</div>
              <div className="text-xs text-gray-500">x{it.quantity}</div>
            </li>
          ))}
        </ul>
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
            <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {pkg.image ? (
                <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
              )}
            </div>

            <div>
              <div className="font-semibold">{pkg.name}</div>
              <div className="text-sm text-gray-500">{pkg.products?.length || 0} items included</div>
              <div className="text-indigo-600 font-bold mt-1">{formatCurrency(pkg.price)}</div>
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
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Become an Agent</h1>
          <p className="text-gray-600 mt-1">Choose a package and complete checkout to activate your agent account.</p>
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
