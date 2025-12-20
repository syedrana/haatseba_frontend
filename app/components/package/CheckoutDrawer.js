// "use client";

// import { Minus, Plus, ShoppingCart, X } from "lucide-react";


// /* -------------------------
//    Small helpers
//    ------------------------- */
// const formatCurrency = (v) =>
//   typeof v === "number" ? `৳${v.toLocaleString("en-US")}` : v;

// /* -------------------------
//    Checkout Drawer / Modal
//    ------------------------- */
// export default function CheckoutDrawer({
//   open,
//   onClose,
//   pkg,
//   qty,
//   setQty,
//   // paymentType,
//   // setPaymentType,
//   onConfirm,
//   loading,
//   walletBalance = 0,
// }) {
//   if (!open || !pkg) return null;

//   const totalAmount = pkg.price * qty;

//   const allInStock = pkg.products?.every(
//     (it) => (it.productId?.stock || 0) >= (it.quantity || 0) * qty
//   )

//   // responsive: on small screens take full screen, on md+ show side drawer
//   return (
//     <div
//       aria-modal="true"
//       role="dialog"
//       className="fixed inset-0 z-50 flex"
//     >
//       {/* backdrop */}
//       <div
//         onClick={onClose}
//         className="absolute inset-0 bg-black/40"
//         aria-hidden
//       />

//       {/* drawer */}
//       <div className="relative ml-auto w-full md:w-[420px] h-full bg-white p-5 overflow-auto">
//         <div className="flex items-start justify-between gap-3">
//           <div>
//             <h4 className="text-xl font-bold">Checkout</h4>
//             <div className="text-sm text-gray-500">You&apos;re buying: <span className="font-medium">{pkg.name}</span></div>
//           </div>

//           <button
//             onClick={onClose}
//             className="p-2 rounded hover:bg-gray-100"
//             aria-label="Close checkout"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         <div className="mt-4 grid grid-cols-1 gap-4">
//           {/* package preview */}
//           <div className="flex gap-3 items-center">
//             <div>
//               <p className="font-semibold">{pkg.name} - <span className="text-indigo-600 font-bold ">{formatCurrency(pkg.price)}</span></p>
//               <p className="text-sm text-gray-500">{pkg.products?.length || 0} items included</p>
//               {pkg.products?.map((it, idx) => (
//                 <div key={idx} className="relative w-full">
//                   <div className="mt-1 text-sm font-medium truncate">
//                     {it.productId?.name || "Product"}{" "}
//                     (৳{it.productId?.costPrice} × {it.quantity}) =
//                     <span className="ml-1 font-semibold text-green-600">
//                       ৳
//                       {((it.productId?.costPrice || 0) * (it.quantity || 0)).toLocaleString("en-BD")}
//                     </span>

//                     <span className="ml-2 text-xs">
//                       {it.productId?.stock > it.quantity ? (
//                         <span className="text-green-600">In Stock</span>
//                       ) : (
//                         <span className="text-red-600">Stock Out</span>
//                       )}
//                     </span>
//                   </div>
//                 </div>
//               ))}

//             </div>
//           </div>

//           {/* qty control */}
//           <div>
//             <label className="text-sm font-medium">Quantity</label>
//             <div className="mt-2 inline-flex items-center gap-3">
//               <button
//                 onClick={() => setQty(Math.max(1, qty - 1))}
//                 className="px-3 py-1 border rounded"
//                 aria-label="Decrease quantity"
//               >
//                 <Minus size={16} />
//               </button>
//               <div className="min-w-[52px] text-center text-lg font-semibold">{qty}</div>
//               <button
//                 onClick={() => setQty(qty + 1)}
//                 className="px-3 py-1 border rounded"
//                 aria-label="Increase quantity"
//               >
//                 <Plus size={16} />
//               </button>
//             </div>
//           </div>

//           {/* payment type */}
//           <div>
//             <label className="text-sm font-medium">Payment</label>
//             <div className="mt-2 grid grid-cols-2 gap-2">
//               <button
//                 onClick={() => setPaymentType("cod")}
//                 className={`px-3 py-2 rounded border text-sm text-left ${paymentType === "cod" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"}`}
//               >
//                 Cash on Delivery
//                 <div className="text-xs text-white/80">{paymentType === "cod" ? "Selected" : ""}</div>
//               </button>

//               <button
//                 onClick={() => setPaymentType("online")}
//                 className={`px-3 py-2 rounded border text-sm text-left ${paymentType === "online" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"}`}
//               >
//                 Wallet Payment
//                 <div className="text-xs text-white/80">{paymentType === "online" ? "Selected" : ""}</div>
//               </button>
//             </div>
//           </div>

//           {/* order breakdown */}
//           <div className="border-t pt-4">
//             <div className="flex justify-between text-sm text-gray-600">
//               <span>Unit price</span>
//               <span>{formatCurrency(pkg.price)}</span>
//             </div>
//             <div className="flex justify-between text-sm text-gray-600 mt-1">
//               <span>Quantity</span>
//               <span>{qty}</span>
//             </div>
//             <div className="flex justify-between text-base font-semibold mt-3">
//               <span>Total</span>
//               <span>{formatCurrency(pkg.price * qty)}</span>
//             </div>
//             {!allInStock && (
//               <div className="mt-2 text-sm text-red-600">
//                 One or more products are out of stock. Please reduce quantity.
//               </div>
//             )}
//             <div className="text-xs text-gray-500 mt-2">Taxes & shipping will be handled by admin (if applicable).</div>
//           </div>

//           {/* actions */}
//           <div className="flex gap-3 mt-4">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 rounded border w-full"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={onConfirm}
//               disabled={loading || !allInStock}
//               className={`px-4 py-2 rounded w-full flex items-center justify-center gap-2
//                 ${
//                   loading || !allInStock
//                     ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                     : "bg-indigo-600 text-white"
//                 }
//               `}
//             >
//               {loading ? (
//                 "Processing..."
//               ) : (
//                 <>
//                   <ShoppingCart size={16} />
//                   {allInStock ? "Confirm & Pay" : "Out of Stock"}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }













"use client";

import { Minus, Plus, ShoppingCart, Wallet, X } from "lucide-react";

/* -------------------------
   Small helpers
------------------------- */
const formatCurrency = (v) =>
  typeof v === "number" ? `৳${v.toLocaleString("en-BD")}` : v;

/* -------------------------
   Checkout Drawer / Modal
------------------------- */
export default function CheckoutDrawer({
  open,
  onClose,
  pkg,
  qty,
  setQty,
  onConfirm,
  loading,
  walletBalance = 0, // 👈 wallet balance prop
}) {
  if (!open || !pkg) return null;

  const totalAmount = pkg.price * qty;

  // ✅ stock check
  const allInStock = pkg.products?.every(
    (it) => (it.productId?.stock || 0) >= (it.quantity || 0) * qty
  );

  // ✅ wallet check
  const hasEnoughBalance = walletBalance >= totalAmount;

  const canSubmit = allInStock && hasEnoughBalance && !loading;

  return (
    <div aria-modal="true" role="dialog" className="fixed inset-0 z-50 flex">
      {/* backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-hidden
      />

      {/* drawer */}
      <div className="relative ml-auto w-full md:w-[420px] h-full bg-white p-5 overflow-auto">
        {/* header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-xl font-bold">Checkout</h4>
            <div className="text-sm text-gray-500">
              You&apos;re buying:{" "}
              <span className="font-medium">{pkg.name}</span>
            </div>
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
          <div>
            <p className="font-semibold">
              {pkg.name} –{" "}
              <span className="text-indigo-600 font-bold">
                {formatCurrency(pkg.price)}
              </span>
            </p>

            <p className="text-sm text-gray-500">
              {pkg.products?.length || 0} items included
            </p>

            {pkg.products?.map((it, idx) => {
              const requiredQty = it.quantity * qty;
              const stock = it.productId?.stock || 0;
              const inStock = stock >= requiredQty;

              return (
                <div key={idx} className="mt-1 text-sm font-medium truncate">
                  {it.productId?.name || "Product"}{" "}
                  (৳{it.productId?.costPrice} × {it.quantity}) =
                  <span className="ml-1 font-semibold text-green-600">
                    ৳
                    {(
                      (it.productId?.costPrice || 0) *
                      (it.quantity || 0)
                    ).toLocaleString("en-BD")}
                  </span>

                  <span className="ml-2 text-xs">
                    {inStock ? (
                      <span className="text-green-600">In Stock</span>
                    ) : (
                      <span className="text-red-600">
                        Stock Out (need {requiredQty})
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {/* quantity */}
          <div>
            <label className="text-sm font-medium">Quantity</label>
            <div className="mt-2 inline-flex items-center gap-3">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-1 border rounded"
              >
                <Minus size={16} />
              </button>

              <div className="min-w-[52px] text-center text-lg font-semibold">
                {qty}
              </div>

              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-1 border rounded"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* wallet info */}
          <div className="border rounded p-3 bg-gray-50">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Wallet size={14} /> Wallet Balance
              </span>
              <span className="font-semibold">
                {formatCurrency(walletBalance)}
              </span>
            </div>

            {!hasEnoughBalance && (
              <div className="mt-1 text-xs text-red-600">
                Insufficient wallet balance
              </div>
            )}
          </div>

          {/* breakdown */}
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
              <span>{formatCurrency(totalAmount)}</span>
            </div>

            {!allInStock && (
              <div className="mt-2 text-sm text-red-600">
                One or more products are out of stock.
              </div>
            )}
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
              disabled={!canSubmit}
              className={`px-4 py-2 rounded w-full flex items-center justify-center gap-2
                ${
                  canSubmit
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <ShoppingCart size={16} />
                  Confirm & Pay
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
