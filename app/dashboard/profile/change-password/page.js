"use client";

import axios from "axios";
import { useState } from "react";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const changePass = async () => {
    if (!oldPassword || !newPassword || !confirm)
      return alert("All fields required!");

    if (newPassword !== confirm)
      return alert("Password does not match!");

    setLoading(true);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      await axios.post(
        `${API_BASE}/change-password`,
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirm("");

    } catch (err) {
      alert(err?.response?.data?.message || "Failed to change password!");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>

      <div className="mb-3">
        <label className="font-semibold text-sm">Old Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded-lg mt-1"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="font-semibold text-sm">New Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded-lg mt-1"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="font-semibold text-sm">Confirm New Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded-lg mt-1"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>

      <button
        onClick={changePass}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4"
      >
        {loading ? "Updating..." : "Change Password"}
      </button>
    </div>
  );
}
