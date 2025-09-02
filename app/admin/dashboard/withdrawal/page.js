"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, User, XCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

export default function UserManagement() {
  const [pending, setPending] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  const [approved, setApproved] = useState([]);
  const [approvedCount, setApprovedCount] = useState(0);

  const [rejected, setRejected] = useState([]);
  const [rejectedCount, setRejectedCount] = useState(0);

  const [loading, setLoading] = useState(false);

  // 🔄 Load users
  const fetchWithdrawal = async () => {
    setLoading(true);
    try {
      const [p, a, r] = await Promise.all([
        axios.get(`${API_BASE}/pendingwithdrawal`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/approvedwithdrawal`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/rejectedwithdrawal`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setPending(p.data.withdraws);
      setPendingCount(p.data.count);

      setApproved(a.data.withdraws);
      setApprovedCount(a.data.count);

      setRejected(r.data.withdraws);
      setRejectedCount(r.data.count);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawal();
  }, []);

  // ✅ Approve
  const handleApprove = async (id) => {
    try {
      await axios.patch(`${API_BASE}/approvewithdraw/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchWithdrawal();
    } catch (err) {
      console.error("Approve Error:", err);
    }
  };

  // ❌ Reject
  const handleReject = async (id) => {
    try {
      await axios.patch(`${API_BASE}/rejectwithdraw/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchWithdrawal();
    } catch (err) {
      console.error("Reject Error:", err);
    }
  };

  // 🖥️ Desktop Table View
  const renderTable = (users, action = false) => (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-sm text-left border rounded-xl shadow-md dark:border-gray-700">
        <thead className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <tr>
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Mobile</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">level</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Method</th>
            <th className="px-4 py-3">Account</th>
            <th className="px-4 py-3">Date</th>
            {action && <th className="px-4 py-3 text-center">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
                <td className="px-4 py-2">
                  {u.userId.image ? (
                    <Image
                      src={u.userId.image}
                      alt="Profile"
                      width={64}
                      height={64}
                      className="w-12 h-12 rounded-full bg-gray-400 dark:bg-gray-600 mb-2"
                      unoptimized
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400 mb-2" />
                  )}
                </td>
                <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">{u.userId.firstName} {u.userId.lastName}</td>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{u.userId.phone}</td>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{u.userId.email}</td>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{u.userId.level}</td>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{u.amount}</td>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{u.method}</td>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{u.accountNumber}</td>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{u.createdAt}</td>
                {action && (
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white rounded-xl" onClick={() => handleApprove(u._id)}>
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white rounded-xl" onClick={() => handleReject(u._id)}>
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={action ? 5 : 4} className="text-center py-4 text-gray-500 dark:text-gray-400">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // 📱 Mobile Card View
  const renderMobileCards = (users, action = false) => (
    <div className="md:hidden grid gap-4">
      {users.length > 0 ? (
        users.map((u) => (
          <motion.div
            key={u._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-4 shadow-lg bg-white border dark:bg-gray-800 dark:border-gray-700 flex items-center gap-4"
          >
            <div>
              {u.userId.image ? (
                <Image src={u.userId.image} alt="Profile" width={64} height={64} className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600" unoptimized />
              ) : (
                <User className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{u.userId.firstName} {u.userId.lastName}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{u.userId.phone}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{u.userId.email}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Level: {u.userId.level}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Amount: {u.amount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Method: {u.method}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Account: {u.accountNumber}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{u.createdAt}</p>
              {action && (
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white rounded-xl flex-1" onClick={() => handleApprove(u._id)}>
                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white rounded-xl flex-1" onClick={() => handleReject(u._id)}>
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ))
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">No users found</p>
      )}
    </div>
  );

  return (
    <Card className="p-6 max-w-8xl mx-auto mt-10 rounded-2xl shadow-lg bg-white dark:bg-gray-900 dark:border dark:border-gray-700">
      <CardContent>
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">👥 User Management</h1>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500 dark:text-gray-400" />
          </div>
        ) : (
          <Tabs defaultValue="pending">
            {/* TabsList: desktop top bar, mobile bottom nav */}
            <TabsList className="hidden md:flex mb-6 gap-4">
              <TabsTrigger value="pending" className="px-4 py-2 rounded-xl">Pending ({pendingCount})</TabsTrigger>
              <TabsTrigger value="approved" className="px-4 py-2 rounded-xl">Approved ({approvedCount})</TabsTrigger>
              <TabsTrigger value="rejected" className="px-4 py-2 rounded-xl">Rejected ({rejectedCount})</TabsTrigger>
            </TabsList>

            {/* Mobile Bottom Navigation */}
            <TabsList className="fixed md:hidden bottom-4 left-1/2 -translate-x-1/2 flex bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 gap-3 z-50 border dark:border-gray-700">
              <TabsTrigger value="pending" className="px-3 py-2 rounded-full text-sm">⏳ {pendingCount}</TabsTrigger>
              <TabsTrigger value="approved" className="px-3 py-2 rounded-full text-sm">✅ {approvedCount}</TabsTrigger>
              <TabsTrigger value="rejected" className="px-3 py-2 rounded-full text-sm">❌ {rejectedCount}</TabsTrigger>
            </TabsList>

            {/* Pending */}
            <TabsContent value="pending">
              <div className="mb-4">
                <span className="px-3 py-1 text-base font-semibold rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                  Total Pending: {pendingCount}
                </span>
              </div>
              {renderTable(pending, true)}
              {renderMobileCards(pending, true)}
            </TabsContent>

            {/* Approved */}
            <TabsContent value="approved">
              <div className="mb-4">
                <span className="px-3 py-1 text-base font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Total Approved: {approvedCount}
                </span>
              </div>
              {renderTable(approved)}
              {renderMobileCards(approved)}
            </TabsContent>

            {/* Rejected */}
            <TabsContent value="rejected">
              <div className="mb-4">
                <span className="px-3 py-1 text-base font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                  Total Rejected: {rejectedCount}
                </span>
              </div>
              {renderTable(rejected)}
              {renderMobileCards(rejected)}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
