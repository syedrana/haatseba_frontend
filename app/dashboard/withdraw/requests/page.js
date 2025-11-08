"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function WithdrawPage() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bkash");
  const [accountNumber, setAccountNumber] = useState("");
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 🟢 Load Wallet Balance + Withdraw History
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [balanceRes, withdrawRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/walletbalance`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/withdrawhistory`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setBalance(balanceRes.data.balance || 0);
        setWithdraws(withdrawRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [token]);

  // 🟢 Handle Withdraw Request
  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return toast.error("Enter valid amount");
    if (!accountNumber) return toast.error("Account number required");
    if (amount > balance) return toast.error("Insufficient balance");

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/requestwithdraw`,
        { amount, method, accountNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);
      setAmount("");
      setAccountNumber("");
      setWithdraws([res.data.withdraw, ...withdraws]);
      setBalance(balance - amount);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to request withdraw");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        {/* Wallet Card */}
        <div className="bg-gradient-to-r from-cyan-600 to-orange-500 p-6 rounded-2xl shadow-xl mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Your Wallet Balance</h2>
          <p className="text-4xl font-extrabold text-white">৳ {balance.toLocaleString()}</p>
        </div>

        {/* Withdraw Form */}
        <div className="bg-slate-900/80 backdrop-blur-lg p-6 rounded-xl border border-cyan-500 shadow-neon mb-10">
          <h3 className="text-xl font-bold mb-4 text-cyan-400">Withdraw Request</h3>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block mb-2 font-semibold">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-cyan-500 focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-cyan-500 focus:ring-2 focus:ring-cyan-400 outline-none"
              >
                <option value="bkash">Bkash</option>
                <option value="nagad">Nagad</option>
                <option value="bank">Bank</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number"
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-cyan-500 focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-cyan-400 text-white font-bold shadow-lg hover:shadow-neon hover:scale-105 transition-all duration-300"
            >
              {loading ? "Processing..." : "Submit Request"}
            </button>
          </form>
        </div>

        {/* Withdraw History */}
        <div className="bg-slate-900/80 backdrop-blur-lg p-6 rounded-xl border border-cyan-500 shadow-neon">
          <h3 className="text-xl font-bold mb-4 text-cyan-400">Withdraw History</h3>

          {withdraws.length === 0 ? (
            <p className="text-gray-400 text-center">No withdraw requests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-cyan-300">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Method</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {withdraws.map((w, idx) => (
                    <tr key={idx} className="border-t border-slate-700 hover:bg-slate-800/50 transition">
                      <td className="px-4 py-2">{new Date(w.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-2">৳ {w.amount}</td>
                      <td className="px-4 py-2 capitalize">{w.method}</td>
                      <td className={`px-4 py-2 font-semibold ${
                        w.status === "approved"
                          ? "text-green-400"
                          : w.status === "rejected"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}>
                        {w.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Glow effect */}
      <style jsx>{`
        .shadow-neon {
          box-shadow: 0 0 10px #06b6d4, 0 0 20px #f97316, 0 0 40px #06b6d4;
        }
      `}</style>
    </div>
  );
}
