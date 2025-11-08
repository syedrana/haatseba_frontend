"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { motion } from "framer-motion";
import { History, Pencil, Plus } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";

// zod form schema
const schema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  vendorId: z.string().optional(),
  rate: z.number().min(0, "Rate must be >= 0").max(100, "Rate <= 100"),
  note: z.string().max(500).optional(),
});

export default function CommissionAdminDashboard() {
  const [commissions, setCommissions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyEntries, setHistoryEntries] = useState([]);
  const [selectedCommissionId, setSelectedCommissionId] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryId: "",
      vendorId: "",
      rate: 10,
      note: "",
    },
  });

  

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [comRes, catRes, venRes] = await Promise.all([
        axios.get(`${API_BASE}/commission/commissions`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/allcategories`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/vendors`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { vendors: [] } })),
      ]);

      setCommissions(comRes.data.commissions || comRes.data.data || []);
      setCategories(catRes.data.categories || catRes.data.data || []);
      setVendors(venRes.data.vendors || venRes.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  },[token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openCreate = () => {
    setEditing(null);
    form.reset();
    setOpenModal(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    form.reset({ categoryId: c.category._id, vendorId: c.vendor?._id || "", rate: c.rate, note: "" });
    setOpenModal(true);
  };

  const submit = async (payload) => {
    if (!token) return toast.error("Not authenticated");

    try {
      setLoading(true);
      const body = {
        categoryId: payload.categoryId,
        vendorId: payload.vendorId || null,
        rate: payload.rate,
        note: payload.note,
      };

      const res = await axios.post(`${API_BASE}/commission/setcommission`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message || "Saved");
      setOpenModal(false);
      fetchAll();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save commission");
    } finally {
      setLoading(false);
    }
  };

  const viewHistory = async (commission) => {
    setSelectedCommissionId(commission._id);
    setHistoryOpen(true);
    try {
      const res = await axios.get(`${API_BASE}/commission/history/${commission._id}`, { headers: { Authorization: `Bearer ${token}` } });
      setHistoryEntries(res.data.history || res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load history");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Commission Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage category & vendor commission rates.</p>
        </div>
        <div className="flex items-center gap-3">
          <Input placeholder="Search categories / vendors..." className="max-w-sm" />
          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus size={16} /> Create
          </Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Active Commissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left bg-gray-50 dark:bg-gray-800">
                  <th className="p-3">Category</th>
                  <th className="p-3">Vendor (optional)</th>
                  <th className="p-3">Rate (%)</th>
                  <th className="p-3">Updated By</th>
                  <th className="p-3">Updated At</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {commissions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">No commissions found</td>
                  </tr>
                )}

                {commissions.map((c) => (
                  <tr key={c._id} className="border-t">
                    <td className="p-3">{c.category?.name || c.category}</td>
                    <td className="p-3">{c.vendor ? `${c.vendor.businessName || c.vendor.email}` : <span className="text-sm text-gray-400">Category default</span>}</td>
                    <td className="p-3 font-semibold">{c.rate}%</td>
                    <td className="p-3">{c.updatedBy ? `${c.updatedBy.firstName || ""} ${c.updatedBy.lastName || ""}` : "—"}</td>
                    <td className="p-3">{new Date(c.updatedAt).toLocaleString()}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => openEdit(c)}>
                          <Pencil size={16} />
                        </Button>
                        <Button variant="ghost" onClick={() => viewHistory(c)}>
                          <History size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal - Create / Edit */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Commission" : "Create Commission"}</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit((values) => {
              // zod converts numbers, but react-hook-form stores as string from selects/inputs; ensure numeric
              const payload = { ...values, rate: Number(values.rate) };
              submit(payload);
            })}
            className="space-y-4 p-2"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select onValueChange={(val) => form.setValue("categoryId", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.categoryId && <p className="text-red-500 text-sm">{form.formState.errors.categoryId.message}</p>}
              </div>

              <div>
                <Label>Vendor (optional)</Label>
                <Select onValueChange={(val) => form.setValue("vendorId", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor (leave empty for category default)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Category default</SelectItem>
                    {vendors.map((v) => (
                      <SelectItem key={v._id} value={v._id}>{v.businessName || `${v.firstName} ${v.lastName}`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Rate (%)</Label>
                <Input type="number" {...form.register("rate", { valueAsNumber: true })} />
                {form.formState.errors.rate && <p className="text-red-500 text-sm">{form.formState.errors.rate.message}</p>}
              </div>

              <div>
                <Label>Note (optional)</Label>
                <Input {...form.register("note")} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">{loading ? "Saving..." : "Save"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* History Drawer / Modal */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Commission History</DialogTitle>
          </DialogHeader>

          <div className="p-4 space-y-3">
            {historyEntries.length === 0 && <p className="text-muted-foreground">No history entries found.</p>}

            {historyEntries.map((h) => (
              <div key={h._id} className="border rounded-lg p-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm">Old: <b>{h.oldRate ?? "—"}%</b> → New: <b>{h.newRate}%</b></p>
                    <p className="text-xs text-gray-500">By: {h.changedBy?.firstName || h.changedBy?.email} • {new Date(h.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">{h.note}</div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={() => setHistoryOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

/*
Notes / Integration:
- Assumes these backend endpoints (adjust base path if different):
  GET  ${API_BASE}/commission/commissions          -> list commissions
  POST ${API_BASE}/commission/setcommission        -> set / update commission
  GET  ${API_BASE}/commission/history/:id          -> commission history for commission id
  GET  ${API_BASE}/allcategories                   -> categories list
  GET  ${API_BASE}/vendors                         -> vendors list (or change endpoint to your route)

- Uses shadcn/ui components pattern. Adjust imports if your codebase structures components differently.
- Make sure `token` is stored in localStorage as `token` and backend auth middleware reads Authorization header.
- Styling uses Tailwind and responsive grid. You can expand with pagination, filters, and sorting as needed.
*/
