"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../marketplace/ProductCard";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true)

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    const load = async () => {
        try {
            const res = await axios.get(`${API_BASE}/getmarketplaceproducts`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(res.data.products || []);
            } catch (e) {
            console.error(e);
            } finally {
            setLoading(false);
        }
    }
    load();
  }, [API_BASE, token]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* <h1 className="text-3xl font-bold mb-6">Marketplace</h1> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
