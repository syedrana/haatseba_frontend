"use client";

import Image from "next/image";

/* -------------------------
   Small helpers
   ------------------------- */
const formatCurrency = (v) =>
  typeof v === "number" ? `৳${v.toLocaleString("en-US")}` : v;

/* -------------------------
   ProductCard (premium)
   ------------------------- */
export default function PackageCard({ pkg, selected, onSelect }) {
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

              {/* Product Name dd  */}
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