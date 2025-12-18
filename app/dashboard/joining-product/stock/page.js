"use client";

import axios from "axios";
import { Package, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AgentStockPage() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [agentId, setAgentId] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

  useEffect(() => {
    const loadStock = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

        const res = await axios.get(`${API_BASE}/getmyagentstock`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStock(res.data.products || []);
        setAgentId(res.data.agentId);
        setLoading(false);
      } catch (error) {
        console.error("Stock Load Error:", error);
        setLoading(false);
      }
    };

    loadStock();
  }, [API_BASE]);

  const filtered = stock.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          My Joining Stock
        </h1>
      </div>

      {/* Search */}
      <div className="relative mb-4 sm:mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border pl-10 py-2 sm:py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
        />
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 animate-pulse rounded-xl h-44"
            ></div>
          ))}
        </div>
      )}

      {/* Stock Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div
              key={p.productId}
              className="border rounded-xl bg-white shadow hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              <div className="relative w-full h-44 rounded-t-lg overflow-hidden bg-gray-100">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="p-3 flex flex-col flex-1">
                <h2 className="font-bold text-gray-800 text-sm sm:text-base truncate">
                  {p.name}
                </h2>

                {/* Quantity */}
                <div className="mt-2 text-sm sm:text-base text-blue-600 font-semibold">
                  Qty: {p.qty}
                </div>

                {/* Joining Quantity */}
                <div className="mt-1 text-sm sm:text-base text-green-600 font-semibold">
                  Registration Units: {p.joining_quantity}
                </div>

                {/* Price */}
                <div className="mt-1 text-sm sm:text-base text-gray-700">
                  Price: <b>{p.price}৳</b>
                </div>

                {/* Registration + Sell Button */}
                <button
                  onClick={() => {
                    router.push(`/dashboard/joining-product/registration?registrationType=product&productId=${p.productId}&agentId=${agentId}&joiningQuantity=${p.joining_quantity}`);
                  }}
                  className="w-full mt-3 bg-blue-600 text-white py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700"
                >
                  Register & Sell
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="text-center text-gray-500 mt-10 text-sm sm:text-base">
          No products found!
        </div>
      )}
    </div>
  );
}
