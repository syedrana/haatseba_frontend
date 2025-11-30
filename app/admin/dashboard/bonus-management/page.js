"use client";

import axios from "axios";
import { Edit2, PlusCircle, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Premium-looking admin page for managing bonus plans
// - Uses Tailwind CSS classes (assumes Tailwind is configured)
// - Floating label form fields
// - List, create, edit, delete

export default function BonusAdminPanel() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // form state
    const emptyForm = { level: "", bonusAmount: "", costValue: "", rewardType: "cash", condition: "", status: "active" };
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const fetchPlans = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(`${API_BASE}/getallbonusplans`, {
            headers: { Authorization: `Bearer ${token}` },
            });
            setPlans(res.data || []);
        } catch (e) {
            setError(e.response?.data?.message || e.message || "Failed to load plans");
            toast.error(e.response?.data?.message || "Failed to load plans");
        } finally {
            setLoading(false);
        }
    }, [API_BASE, token]);

    useEffect(() => {
    fetchPlans();
    }, [fetchPlans]);


  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function floatLabelClass(val) {
    return `${val ? "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100" : "peer-focus:-translate-y-4 peer-focus:scale-90 -translate-y-4 scale-90"}`;
  }

  async function submitForm(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      // normalize bonusAmount: if number-like, send number
      const normalized = { ...form };
      if (normalized.bonusAmount !== "" && !isNaN(Number(normalized.bonusAmount))) {
        normalized.bonusAmount = Number(normalized.bonusAmount);
      }
      if (
        normalized.costValue !== "" && !isNaN(Number(normalized.costValue))) {
        normalized.costValue = Number(normalized.costValue);
      }
      if (editingId) {
        const res = await axios.put(`${API_BASE}/updatebonusplan/${editingId}`, normalized,
        { headers: 
            { Authorization: `Bearer ${token}` } 
        });

        // update local list
        setPlans(p => p.map(item => (item._id === editingId ? res.data.bonus : item)));
        toast.success("Bonus plan updated successfully!");
      } else {

        const res = await axios.post(`${API_BASE}/createbonusplan`, normalized, 
        { headers: 
            { Authorization: `Bearer ${token}` } 
        });

        setPlans(p => [...p, res.data.bonus].sort((a,b)=>a.level-b.level));
        toast.success("Bonus plan created successfully!");
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Save failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(plan) {
    setEditingId(plan._id);
    setForm({
      level: plan.level || "",
      bonusAmount: plan.bonusAmount ?? "",
      costValue: plan.costValue ?? "",
      rewardType: plan.rewardType || (typeof plan.bonusAmount === "number" ? "cash" : "product"),
      condition: plan.condition || "",
      status: plan.status || "active",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function removePlan(id) {
    if (!confirm("Are you sure you want to delete this bonus plan?")) return;
    try {
      await axios.delete(`${API_BASE}/deletebonusplan/${id}`,
        { headers: 
            { Authorization: `Bearer ${token}` } 
        }
      );
      setPlans(p => p.filter(x => x._id !== id));
      toast.success("Bonus plan deleted successfully!");
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Delete failed";
      toast.error(msg);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster position="top-right" />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Bonus Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Create, edit or delete bonus plans. Floating-label form for fast edits.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setForm(emptyForm); setEditingId(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-800 rounded-lg border shadow-sm hover:opacity-95"
          >
            <PlusCircle className="w-5 h-5" /> New
          </button>
        </div>
      </div>

      {/* FORM (Floating labels) */}
      {/* FORM (Floating Labels - Modern UI) */}
      <form
        onSubmit={submitForm}
        className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl p-6 space-y-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          {editingId ? "✏️ Update Bonus Plan" : "➕ Create New Bonus Plan"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Level */}
        <div className="relative">
          <input
            name="level"
            type="number"
            min="1"
            value={form.level}
            onChange={onChange}
            required
            className="peer block w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 
            bg-transparent px-3 pt-5 pb-2 text-sm text-gray-900 dark:text-gray-100 
            focus:border-emerald-500 focus:ring-0 outline-none transition-all"
            placeholder=" "
          />
          <label
            htmlFor="level"
            className={`absolute left-3 bg-white dark:bg-gray-900 px-1 text-gray-500 dark:text-gray-400 text-sm pointer-events-none transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-emerald-600 peer-focus:text-xs

            ${form.level
              ? "top-0 -translate-y-1/2 text-emerald-600 text-xs"
              : "top-1/2 -translate-y-1/2"}`}
          >
            Level
          </label>
        </div>

        {/* Bonus Amount */}
        <div className="relative">
          <input
            name="bonusAmount"
            type="text"
            value={form.bonusAmount}
            onChange={onChange}
            required
            className="peer block w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 
            bg-transparent px-3 pt-5 pb-2 text-sm text-gray-900 dark:text-gray-100 
            focus:border-emerald-500 focus:ring-0 outline-none transition-all"
            placeholder=" "
          />
          <label
            htmlFor="bonusAmount"
            className={`absolute left-3 bg-white dark:bg-gray-900 px-1 text-gray-500 dark:text-gray-400 text-sm pointer-events-none transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-emerald-600 peer-focus:text-xs 
            ${form.bonusAmount
              ? "top-0 -translate-y-1/2 text-emerald-600 text-xs"
              : "top-1/2 -translate-y-1/2"}`}
          >
            Bonus Amount (৳ or Item)
          </label>
        </div>

        {/* Bonus Amount */}
        <div className="relative">
          <input
            name="costValue"
            type="text"
            value={form.costValue}
            onChange={onChange}
            required
            className="peer block w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 
            bg-transparent px-3 pt-5 pb-2 text-sm text-gray-900 dark:text-gray-100 
            focus:border-emerald-500 focus:ring-0 outline-none transition-all"
            placeholder=" "
          />
          <label
            htmlFor="costValue"
            className={`absolute left-3 bg-white dark:bg-gray-900 px-1 text-gray-500 dark:text-gray-400 text-sm pointer-events-none transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-emerald-600 peer-focus:text-xs 
            ${form.costValue
              ? "top-0 -translate-y-1/2 text-emerald-600 text-xs"
              : "top-1/2 -translate-y-1/2"}`}
          >
            Cost Value (৳)
          </label>
        </div>

        {/* Reward Type */}
        <div className="relative">
          <select
            name="rewardType"
            value={form.rewardType}
            onChange={onChange}
            required
            className="peer block w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 
            bg-transparent px-3 pt-5 pb-2 text-sm text-gray-900 dark:text-gray-100 
            focus:border-emerald-500 focus:ring-0 outline-none appearance-none transition-all"
          >
            <option value="" disabled hidden></option>
            <option value="cash">Cash</option>
            <option value="product">Product</option>
            <option value="other">mobile_recharge</option>
            <option value="other">none</option>
          </select>
          <label
            htmlFor="rewardType"
            className={`absolute left-3 bg-white dark:bg-gray-900 px-1 text-gray-500 dark:text-gray-400 text-sm pointer-events-none transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-emerald-600 peer-focus:text-xs
            ${form.rewardType
              ? "top-0 -translate-y-1/2 text-emerald-600 text-xs"
              : "top-1/2 -translate-y-1/2"}`}
          >
            Reward Type
          </label>
          <div className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">▼</div>
        </div>

        {/* Status */}
        <div className="relative">
          <select
            name="status"
            value={form.status}
            onChange={onChange}
            required
            className="peer block w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 
            bg-transparent px-3 pt-5 pb-2 text-sm text-gray-900 dark:text-gray-100 
            focus:border-emerald-500 focus:ring-0 outline-none appearance-none transition-all"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <label
            htmlFor="status"
            className={`absolute left-3 bg-white dark:bg-gray-900 px-1 text-gray-500 dark:text-gray-400 text-sm pointer-events-none transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-emerald-600 peer-focus:text-xs 
            ${form.status
              ? "top-0 -translate-y-1/2 text-emerald-600 text-xs"
              : "top-1/2 -translate-y-1/2"}`}
          >
            Status
          </label>
          <div className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">▼</div>
        </div>
      </div>

      {/* Condition */}
      <div className="relative mt-5">
        <textarea
          name="condition"
          value={form.condition}
          onChange={onChange}
          rows={2}
          required
          className="peer block w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 
          bg-transparent px-3 pt-5 pb-2 text-sm text-gray-900 dark:text-gray-100 
          focus:border-emerald-500 focus:ring-0 outline-none transition-all"
          placeholder=" "
        />
        <label
          htmlFor="condition"
          className={`absolute left-3 bg-white dark:bg-gray-900 px-1 text-gray-500 dark:text-gray-400 text-sm pointer-events-none transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-emerald-600 peer-focus:text-xs
          ${form.condition
            ? "top-0 -translate-y-1/2 text-emerald-600 text-xs"
            : "top-1/2 -translate-y-1/2"}`}
        >
          Condition (e.g. 3 direct joins / 9 team members / specific rank)
        </label>
      </div>


        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md transition-all disabled:opacity-70"
          >
            {saving ? "Saving..." : editingId ? "Update Plan" : "Create Plan"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>

        {error && (
          <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-md">
            {error}
          </div>
        )}
      </form>


      {/* LIST */}
      <div className="space-y-3 pt-5">
        {loading ? (
          <div className="p-6 text-center text-sm text-gray-500">Loading...</div>
        ) : (
          plans.length ? plans.map(plan => (
            <div key={plan._id} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold">Level {plan.level}</div>
                  <div className="text-xs text-gray-500">{plan.condition}</div>
                </div>
                <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{typeof plan.bonusAmount === 'number' ? new Intl.NumberFormat(undefined,{style:'currency',currency:'BDT',maximumFractionDigits:0}).format(plan.bonusAmount) : plan.bonusAmount}</div>
                <div className="text-sm text-gray-500">
                  Cost: BDT {plan.costValue} | Type: {plan.rewardType}
                </div>
                <div className="text-xs text-gray-500 mt-1">Type: {plan.rewardType} · Status: {plan.status}</div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(plan)} className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-lg">
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => removePlan(plan._id)} className="inline-flex items-center gap-2 px-3 py-2 bg-rose-50 text-rose-700 rounded-lg">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          )) : (
            <div className="p-6 text-center text-sm text-gray-500">No plans yet. Create one using the form above.</div>
          )
        )}
      </div>
    </div>
  );
}
