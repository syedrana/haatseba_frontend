"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

// DnD Kit
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

/* ---------------------------
   Sortable Package Card
   --------------------------- */
function SortablePackageCard({ pkg, checked, onToggleSelect, onDelete, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: pkg._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggleSelect(pkg._id)}
          className="mt-1"
        />

        <div className="flex-1">
          {/* Top section */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {pkg.name}
              </h3>
              <div className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">
                By {pkg.createdBy?.firstName || "Admin"}
              </div>
            </div>

            <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              ৳{pkg.price}
            </div>
          </div>

          {/* Product Grid */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {pkg.products.map((p) => (
              <div
                key={p.productId._id}
                className="flex flex-col items-center text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-2"
              >
                <div className="w-24 h-24 relative overflow-hidden rounded-lg">
                  {p.productId.image ? (
                    <Image
                      src={p.productId.image}
                      alt={p.productId.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                      No image
                    </div>
                  )}
                </div>

                <div className="mt-2 text-xs font-semibold text-gray-700 dark:text-gray-100 line-clamp-2">
                  {p.productId.name}
                </div>

                <div className="text-xs text-gray-500">Qty {p.quantity}</div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-3 flex items-center gap-2">
            {/* Drag handle */}
            <button
              {...attributes}
              {...listeners}
              className="px-2 py-1 text-xs border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Drag to reorder"
            >
              Drag
            </button>

            <Link
              href={`/admin/dashboard/agent/edit-package/${pkg._id}`}
              onClick={() => onEdit(pkg._id)}
              className="px-2 py-1 bg-indigo-600 text-white rounded text-xs"
            >
              Edit
            </Link>

            <button
              onClick={() => onDelete(pkg._id)}
              className="px-2 py-1 bg-red-500 text-white rounded text-xs"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   Main Page Component
   --------------------------- */
export default function PackagesListPage() {
  const [packages, setPackages] = useState([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const tokenRef = useRef("");

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  // Load token once
  useEffect(() => {
    const t = localStorage.getItem("token") || "";
    tokenRef.current = t;
  }, []);

  // Load packages
  const load = useCallback(
    async ({ pageParam = page, qParam = q, status = statusFilter } = {}) => {
      try {
        setLoading(true);
        const token = tokenRef.current;

        const res = await axios.get(`${API_BASE}/getallpackages`, {
          params: { page: pageParam, limit, q: qParam, status },
          headers: { Authorization: `Bearer ${token}` },
        });

        setPackages(res.data.packages || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        toast.error("Failed to load packages");
      } finally {
        setLoading(false);
      }
    },
    [limit, page, q, statusFilter]
  );

  useEffect(() => {
    load({ pageParam: page, qParam: q, status: statusFilter });
  }, [load, page, q, statusFilter]);

  // Debounce search
  const debounceRef = useRef();
  const onSearchChange = (val) => {
    clearTimeout(debounceRef.current);
    setQ(val);

    debounceRef.current = setTimeout(() => {
      setPage(1);
    }, 300);
  };

  // Select toggle
  const toggleSelect = (id) => {
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  // Single delete
  const singleDelete = async (id) => {
    if (!confirm("Delete this package?")) return;
    try {
      const token = tokenRef.current;
      await axios.delete(`${API_BASE}/deletepackage/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  // Bulk delete
  const bulkDelete = async () => {
    if (!selected.size) return toast.error("Pick packages first");
    if (!confirm(`Delete ${selected.size} packages?`)) return;

    try {
      const token = tokenRef.current;

      await Promise.all(
        [...selected].map((id) =>
          axios.delete(`${API_BASE}/deletepackage/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      toast.success("Deleted selected packages");
      setSelected(new Set());
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  // Drag reorder
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = packages.findIndex((p) => p._id === active.id);
    const newIndex = packages.findIndex((p) => p._id === over.id);
    const newArr = arrayMove(packages, oldIndex, newIndex);

    setPackages(newArr);

    try {
      const token = tokenRef.current;

      await axios.post(
        `${API_BASE}/package/reorder`,
        { ids: newArr.map((p) => p._id) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Order updated");
    } catch {
      toast.error("Failed to save order");
    }
  };

  // Pagination
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <h2 className="text-xl font-bold">Agent Packages</h2>

        <Link
          href="/admin/dashboard/agent/create-package"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Create Package
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
        <input
          value={q}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search packages / product..."
          className="w-full border p-2 rounded"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          onClick={() => {
            setQ("");
            setStatusFilter("all");
            setPage(1);
          }}
          className="px-3 py-2 border rounded"
        >
          Reset
        </button>
      </div>

      {/* Bulk Delete */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={bulkDelete}
          className="px-3 py-2 bg-red-600 text-white rounded"
        >
          Bulk Delete
        </button>
        <div className="text-sm text-gray-600">
          Selected: {selected.size}
        </div>
      </div>

      {/* Card Grid */}
      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={packages.map((p) => p._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <SortablePackageCard
                    key={pkg._id}
                    pkg={pkg}
                    checked={selected.has(pkg._id)}
                    onToggleSelect={toggleSelect}
                    onDelete={singleDelete}
                    onEdit={() => {}}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-gray-600">
              Showing {packages.length} of {total} packages
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span className="px-3 py-1 border rounded">
                Page {page} / {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
