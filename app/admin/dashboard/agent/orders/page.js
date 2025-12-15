"use client";

import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";


function StatusBadge({ status }) {
  const map = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  return <span className={`px-2 py-1 rounded text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-800"}`}>{status}</span>;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const tokenHeader = () => {
    if (typeof window === "undefined") return {};
    const t = localStorage.getItem("token");
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/agentorders`, {
        params: { page, limit, status: statusFilter || undefined, q: q || undefined },
        headers: tokenHeader(),
      });
      setOrders(res.data.orders || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("fetchOrders:", err);
      const msg = err.response?.data?.message || "Failed to load orders";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  // debounced search
  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      fetchOrders();
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const openDetails = async (orderId) => {
    try {
      setDetailsLoading(true);
      const res = await axios.get(`${API_BASE}/getagentorder/${orderId}`, {
        headers: tokenHeader(),
      });
      setSelectedOrder(res.data.order);
    } catch (err) {
      console.error("openDetails:", err);
      toast.error(err.response?.data?.message || "Failed to load order details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => setSelectedOrder(null);

  const handleApprove = async (orderId) => {
    if (!confirm("Approve this order? This will deduct stock.")) return;
    try {
      setActionLoading(true);
      const res = await axios.post(`${API_BASE}/approveagentorder/${orderId}`, {}, {
        headers: tokenHeader(),
      });
      toast.success(res.data.message || "Order approved");
      // update list and details
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) setSelectedOrder(res.data.order);
    } catch (err) {
      console.error("approve:", err);
      toast.error(err.response?.data?.message || "Approve failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (orderId) => {
    const reason = prompt("Reject reason (optional):");
    if (reason === null) return; // user cancelled
    try {
      setActionLoading(true);
      const res = await axios.post(`${API_BASE}/rejectagentorder/${orderId}`, { reason }, {
        headers: tokenHeader(),
      });
      toast.success(res.data.message || "Order rejected");
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) setSelectedOrder(res.data.order);
    } catch (err) {
      console.error("reject:", err);
      toast.error(err.response?.data?.message || "Reject failed");
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold">Agent Orders</h2>
          <div className="text-sm text-gray-500">Approve or reject incoming agent orders</div>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by user or package..."
            className="border p-2 rounded"
          />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="border p-2 rounded">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button onClick={() => { setQ(""); setStatusFilter(""); setPage(1); fetchOrders(); }} className="px-3 py-2 border rounded">Reset</button>
        </div>
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="animate-pulse h-24 bg-gray-100 rounded" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {orders.map((o) => (
              <div key={o._id} className="p-4 border rounded flex justify-between items-start gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold">{o.package?.name || (o.package && o.package.name) || "Package"}</div>
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="text-xs text-gray-500">By: {o.user?.firstName} {o.user?.lastName} • {o.user?.email}</div>
                  <div className="text-sm mt-2">Qty: {o.quantity} • Amount: ৳{o.amount || (o.package?.price * o.quantity)}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => openDetails(o._id)} className="px-3 py-1 border rounded text-sm">Details</button>

                  {o.status === "pending" && (
                    <div className="flex gap-2">
                      <button disabled={actionLoading} onClick={() => handleApprove(o._id)} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Approve</button>
                      <button disabled={actionLoading} onClick={() => handleReject(o._id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Reject</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">Showing {orders.length} of {total}</div>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
              <div className="px-3 py-1 border rounded">Page {page} / {totalPages}</div>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        </>
      )}

      {/* Details Drawer */}
      {detailsLoading ? <div className="fixed right-0 top-0 h-full w-96 bg-white p-4">Loading...</div> : null}
      {selectedOrder && (
        <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-lg p-4 overflow-auto z-50">
          <div className="flex justify-between items-start gap-3">
            <div>
              <h3 className="text-lg font-semibold">Order #{selectedOrder._id}</h3>
              <div className="text-xs text-gray-500">Placed: {new Date(selectedOrder.createdAt).toLocaleString()}</div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setSelectedOrder(null)} className="p-2 rounded hover:bg-gray-100" title="Close">Close</button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="text-xs text-gray-500">Buyer</div>
              <div className="font-medium">{selectedOrder.userId?.firstName} {selectedOrder.userId?.lastName}</div>
              <div className="text-sm text-gray-600">{selectedOrder.userId?.email}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Package</div>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 relative">
                  {selectedOrder.packageId?.image && (
                    <Image src={selectedOrder.packageId.image} alt={selectedOrder.packageId.name} fill className="object-cover" />
                  )}
                </div>
                <div>
                  <div className="font-semibold">{selectedOrder.packageId?.name}</div>
                  <div className="text-sm text-gray-600">Unit price: ৳{selectedOrder.packageId?.price}</div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Order details</div>
              <div className="mt-2 text-sm">
                Quantity: {selectedOrder.quantity}<br/>
                Amount: ৳{selectedOrder.amount}<br/>
                Payment: {selectedOrder.paymentType}<br/>
                Status: <StatusBadge status={selectedOrder.status} />
              </div>
            </div>

            {selectedOrder.status === "pending" && (
              <div className="flex gap-2 mt-3">
                <button disabled={actionLoading} onClick={() => handleApprove(selectedOrder._id)} className="px-4 py-2 bg-green-600 text-white rounded">Approve</button>
                <button disabled={actionLoading} onClick={() => handleReject(selectedOrder._id)} className="px-4 py-2 bg-red-500 text-white rounded">Reject</button>
              </div>
            )}

            {selectedOrder.status !== "pending" && (
              <div className="text-sm text-gray-600">Approved by: {selectedOrder.approvedBy?.firstName || "—"} at {selectedOrder.approvedAt ? new Date(selectedOrder.approvedAt).toLocaleString() : "—"}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
