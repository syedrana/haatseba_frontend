"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

export default function AllBonusesPage() {
  const [bonuses, setBonuses] = useState([]);
  const [total, setTotal] = useState(0);

  const [status, setStatus] = useState("");
  const [rewardType, setRewardType] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [loading, setLoading] = useState(false);

  const fetchBonuses = useCallback(async () => {
  try {
    setLoading(true);

    const res = await axios.get(`${API_BASE}/listallbonuses`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { status, rewardType, page, limit },
      }
    );

    setBonuses(res.data.bonuses || []);
    setTotal(res.data.total || 0);
    setLoading(false);
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
}, [status, rewardType, page, limit]);


  useEffect(() => {
  fetchBonuses();
}, [fetchBonuses]);


  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">All Bonuses</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <select
          className="border p-2 rounded"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          className="border p-2 rounded"
          value={rewardType}
          onChange={(e) => {
            setRewardType(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Reward Types</option>
          <option value="cash">Cash</option>
          <option value="product">Product</option>
          <option value="other">Other</option>
        </select>

        <button
          onClick={() => {
            setStatus("");
            setRewardType("");
            setPage(1);
          }}
          className="bg-gray-700 text-white py-2 rounded"
        >
          Reset Filters
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-6 text-lg font-semibold">
          Loading...
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Level</th>
              <th className="p-3 text-left">Bonus</th>
              <th className="p-3 text-left">Reward Type</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bonuses.map((b) => (
              <tr key={b._id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {b.userId?.firstName} {b.userId?.lastName}
                  <br />
                  <span className="text-sm text-gray-600">
                    {b.userId?.phone}
                  </span>
                </td>

                <td className="p-3">{b.level}</td>

                <td className="p-3">
                  {b.bonusAmount}
                  <br />
                  {b.costValue > 0 && (
                    <span className="text-xs text-gray-600">
                      Cost: {b.costValue}
                    </span>
                  )}
                </td>

                <td className="p-3 capitalize">{b.rewardType}</td>

                <td className="p-3 capitalize font-semibold">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      b.status === "pending"
                        ? "bg-yellow-600"
                        : b.status === "approved"
                        ? "bg-blue-600"
                        : b.status === "paid"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>

                <td className="p-3">
                  {new Date(b.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3">
                  <a
                    href={`/admin/bonuses/${b._id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {bonuses.map((b) => (
          <div key={b._id} className="bg-white p-4 rounded shadow">
            <div className="font-bold">
              {b.userId?.firstName} {b.userId?.lastName}
            </div>
            <div className="text-sm text-gray-600">{b.userId?.phone}</div>

            <div className="mt-2">
              <strong>Level:</strong> {b.level}
            </div>

            <div>
              <strong>Bonus:</strong> {b.bonusAmount}
            </div>

            {b.costValue > 0 && (
              <div>
                <strong>Cost:</strong> {b.costValue}
              </div>
            )}

            <div>
              <strong>Type:</strong> {b.rewardType}
            </div>

            <div className="mt-2">
              <span
                className={`px-2 py-1 rounded text-white text-sm ${
                  b.status === "pending"
                    ? "bg-yellow-600"
                    : b.status === "approved"
                    ? "bg-blue-600"
                    : b.status === "paid"
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                {b.status}
              </span>
            </div>

            <div className="text-gray-500 text-sm mt-2">
              {new Date(b.createdAt).toLocaleDateString()}
            </div>

            <a
              href={`/admin/bonuses/${b._id}`}
              className="mt-3 inline-block bg-blue-600 text-white px-3 py-1 rounded text-center"
            >
              View Details
            </a>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className={`px-4 py-2 rounded ${
            page === 1 ? "bg-gray-300" : "bg-gray-700 text-white"
          }`}
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className={`px-4 py-2 rounded ${
            page === totalPages ? "bg-gray-300" : "bg-gray-700 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
