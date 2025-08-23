"use client"

import axios from "axios";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { isTokenValid } from "../utils/auth";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  
 
  // Mock login function
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (token && isTokenValid()) {
      if (role == "user"){
        if (pathname !== "/dashboard") {
          router.replace("/dashboard");
        }
        return;
      } else {
        // role user না হলে অন্য পেজে ফেরত পাঠাও
        // আগের পেজ না থাকলে fallback হিসেবে home page ("/") এ পাঠাও
        const previousURL = document.referrer;
        if (previousURL && !previousURL.includes("/dashboard")) {
          window.location.href = previousURL;
        } else {
          router.replace("/"); // fallback
        }
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
    }
  }, [router, pathname]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/login`, formData, {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_API_KEY,
        },
      });
      const token = response.data.access_token;
      const role = response.data.role
      
      // Store the token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);

      setFormData({ email: "", password: "" });

      setError("");

      if (role === "user") {
        setTimeout(() => {
          router.replace("/dashboard");
        }, 500);
      } else {
        router.replace("/login");
      }

    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response?.data || "Invalid email or password.");
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
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
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
              value={formData.password}
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
        <div className="mt-2 text-center">
          <a href="/register" className="text-indigo-600 hover:underline">Don&apos;t have an account? Register</a>
        </div>
      </div>
    </div>
  );
}
