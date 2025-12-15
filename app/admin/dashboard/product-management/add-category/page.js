"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";

// 🔥 Ultra Premium Category Manager UI (PURE SEARCH – NO DROPDOWN ARROW)
export default function CategoryManager() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [defaultCommissionRate, setDefaultCommissionRate] = useState(5);
  const [status, setStatus] = useState("active");

  // 🔹 Parent category states
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [parentCategory, setParentCategory] = useState(null); // { _id, name }

  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // 🔍 Search parent categories (ONLY WHEN TYPING)
  const searchCategories = async (value) => {
    setSearch(value);
    setParentCategory(null);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get(
        `${API_BASE}/allcategories/search?q=${value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResults(res.data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  // 🟢 Create category
  const submit = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE}/createcategory`,
        {
          name,
          description,
          parentCategory: parentCategory?._id || null,
          defaultCommissionRate,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // reset
      setName("");
      setDescription("");
      setParentCategory(null);
      setSearch("");
      setResults([]);
      setDefaultCommissionRate(5);
      setStatus("active");
    } catch (e) {
      alert(e.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold"
      >
        📂 Category Management
      </motion.h1>

      {/* ➕ Create Form */}
      <Card className="rounded-2xl shadow-xl">
        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-4">
            <Input
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Input
              type="number"
              min={0}
              max={100}
              placeholder="Default Commission (%)"
              value={defaultCommissionRate}
              onChange={(e) => setDefaultCommissionRate(e.target.value)}
            />
          </div>

          {/* Right – PURE SEARCH Parent Category */}
          <div className="space-y-4 relative">
            <label className="text-sm font-medium">Parent Category</label>

            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9"
                placeholder="Type to search parent category"
                value={parentCategory ? parentCategory.name : search}
                onChange={(e) => searchCategories(e.target.value)}
              />
            </div>

            {results.length > 0 && (
              <div className="absolute z-50 w-full bg-white border rounded-xl shadow-lg">
                {results.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => {
                      setParentCategory(c);
                      setResults([]);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {c.name}
                  </div>
                ))}
              </div>
            )}

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded-xl px-4 py-3"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <Button
              onClick={submit}
              disabled={loading}
              className="w-full rounded-xl"
            >
              {loading ? "Saving..." : "Create Category"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
