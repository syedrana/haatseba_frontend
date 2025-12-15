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

      // res.data already contains JSON
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
    <div className="p-4 md:p-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-600" />
          My Agent Stock
        </h1>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border pl-10 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 animate-pulse rounded-xl h-40"
            ></div>
          ))}
        </div>
      )}

      {/* Stock Grid */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div
              key={p.productId}
              className="border rounded-xl bg-white shadow hover:shadow-lg transition overflow-hidden"
            >
                <div className="relative w-full h-44 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    />
                </div>
              

              <div className="p-3">
                <h2 className="font-bold text-gray-800 text-sm md:text-base">
                  {p.name}
                </h2>

                <p className="text-gray-600 text-xs mt-1">
                  {p.description?.slice(0, 50)}...
                </p>

                {/* Quantity */}
                <div className="mt-3 flex justify-between text-sm font-semibold">
                  <span className="text-blue-600">
                    Qty: {p.qty}
                  </span>

                  <span className="text-green-600">
                    Join: {p.joining_quantity}
                  </span>
                </div>

                {/* Price */}
                <div className="mt-2 text-sm text-gray-700">
                  Price: <b>{p.price}৳</b>
                </div>

                <button
                  onClick={() => {
                    router.push(`/dashboard/agent/registration?registrationType=product&productId=${p.productId}&agentId=${agentId}&joiningQuantity=${p.joining_quantity}`);

                  }}
                  className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Sell Product
                </button>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No products found!
        </div>
      )}
    </div>
  );
}
