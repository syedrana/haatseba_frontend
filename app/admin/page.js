"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isTokenValid } from "../utils/auth";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenValid()) {
      router.replace("/adminur/overview");
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
    }
  }, [router]); // ✅ router dependency added

  const handleChange = (e) => {
    const { name, value } = e.target; // ← এখানে name নিতে হবে
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/adminLogin`,
        formData,
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_API_KEY,
          },
          withCredentials: true, // ✅ Allow cookies with API call
        }
      );

      const { access_token, role } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("userRole", role);

      setFormData({ username: "", password: "" });

      setError("");

      if (role === "admin") {
        router.replace("/adminur/overview");
      } else {
        router.replace("/adminur");
      }

    } catch (err) {
      console.error("Login Error:", err); // ✅ Debug Log
      if (err.response && err.response.data) {
        setError(err.response?.data || "Invalid name or password.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-indigo-600 mb-6">Login</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Admin Name</label>
            <input
              type="text"
              name="username"
              value={formData.username || ""} // ✅ Fallback to empty string
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password || ""} // ✅ Fallback to empty string
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-bold bg-indigo-600 hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-indigo-600 hover:underline">Forgot your password?</a>
        </div>
      </div>
    </div>
  );
}
