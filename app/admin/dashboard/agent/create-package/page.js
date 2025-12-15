// PRO VERSION - Create Package Page (Fully Mobile Responsive)
// -----------------------------------------------------------
// Notes:
// - Product quantity fields no longer show default "1"
// - Added clear placeholders for Qty & Joining Qty
// - Product rows are 1-column on mobile, grid only on medium screens
// - Buttons stack properly on mobile

"use client";
import axios from "axios";
import { Loader2, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AsyncProductSelect from "../../../../components/agent/AsyncProductSelect";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export default function CreatePackagePage() {
  const [packageName, setPackageName] = useState("");
  const [price, setPrice] = useState("");
  const [rows, setRows] = useState([
    { productId: "", productName: "", image: "", quantity: "", joining_quantity: "", stock: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  const addRow = () => {
    setRows(prev => [
      ...prev,
      { productId: "", productName: "", image: "", quantity: "", joining_quantity: "", stock: 0 }
    ]);
  };

  const removeRow = (i) => {
    if (rows.length === 1) return toast.error("At least one product required");
    setRows(prev => prev.filter((_, idx) => idx !== i));
  };

  const updateRow = (i, obj) => {
    setRows(prev => prev.map((r, idx) => (idx === i ? { ...r, ...obj } : r)));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!packageName.trim()) return toast.error("Package name required");
    if (!price || Number(price) <= 0) return toast.error("Price must be > 0");

    for (const r of rows) {
      if (!r.productId) return toast.error("Select product in all rows");
      if (!r.quantity || Number(r.quantity) <= 0) return toast.error("Quantity > 0 required");
      if (!r.joining_quantity || Number(r.joining_quantity) <= 0) return toast.error("Joining Qty > 0 required");
    }

    const payload = {
      name: packageName,
      price: Number(price),
      products: rows.map(r => ({
        productId: r.productId,
        quantity: Number(r.quantity),
        joining_quantity: Number(r.joining_quantity)
      }))
    };

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/createpackage`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Package created");
      setPackageName("");
      setPrice("");
      setRows([{ productId: "", productName: "", image: "", quantity: "", joining_quantity: "", stock: 0 }]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Create Package</h2>

      <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow space-y-4">
        {/* Package Name */}
        <div>
          <label className="font-medium">Package Name</label>
          <input
            className="w-full p-2 border rounded mt-1"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
          />
        </div>

        {/* Price */}
        <div>
          <label className="font-medium">Price (৳)</label>
          <input
            className="w-full p-2 border rounded mt-1"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* Products */}
        <div>
          <h3 className="font-semibold mb-2">Products</h3>

          <div className="space-y-4">
            {rows.map((r, i) => (
              <div
                key={i}
                className="bg-gray-50 p-3 rounded grid grid-cols-1 md:grid-cols-12 gap-3"
              >
                {/* Product Selector */}
                <div className="md:col-span-6">
                  <AsyncProductSelect
                    value={r.productId ? { value: r.productId, label: r.productName, image: r.image } : null}
                    onChange={(opt) => updateRow(i, { productId: opt.value, productName: opt.label, image: opt.image })}
                    token={token}
                    placeholder="Search product..."
                  />

                  {r.stock > 0 && (
                    <p className="text-xs text-gray-500 mt-1">Stock: {r.stock}</p>
                  )}
                </div>

                {/* Qty */}
                <input
                  type="number"
                  className="p-2 border rounded md:col-span-2"
                  value={r.quantity}
                  onChange={(e) => updateRow(i, { quantity: e.target.value })}
                  placeholder="Package Qty"
                  min={1}
                />

                {/* Joining Qty */}
                <input
                  type="number"
                  className="p-2 border rounded md:col-span-2"
                  value={r.joining_quantity}
                  onChange={(e) => updateRow(i, { joining_quantity: e.target.value })}
                  placeholder="Joining Qty"
                  min={1}
                />

                {/* Remove btn */}
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="p-2 bg-red-500 text-white rounded md:col-span-2 flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Add product button */}
          <div className="mt-3">
            <button
              type="button"
              onClick={addRow}
              className="px-3 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
            >
              <Plus size={16} /> Add Product
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded w-full md:w-auto"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Create Package"}
        </button>
      </form>
    </div>
  );
}
