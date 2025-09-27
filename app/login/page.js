"use client"

import axios from "axios";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { isTokenValid } from "../utils/auth";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (token && isTokenValid()) {
      if (role === "user") {
        if (pathname !== "/dashboard") router.replace("/dashboard");
        return;
      } else {
        const previousURL = document.referrer;
        if (previousURL && !previousURL.includes("/dashboard")) {
          window.location.href = previousURL;
        } else {
          router.replace("/");
        }
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
    }

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [router, pathname]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/login`,
        formData,
        { headers: { Authorization: process.env.NEXT_PUBLIC_API_KEY } }
      );
      const token = response.data.access_token;
      const role = response.data.role;

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);

      setFormData({ email: "", password: "" });
      setError("");

      if (role === "user") {
        setTimeout(() => router.replace("/dashboard"), 500);
      } else router.replace("/login");

    } catch (err) {
      if (err.response && err.response.data) setError(err.response.data || "Invalid email or password.");
      else setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex items-center justify-center p-4">

      {/* Floating Neon Particles */}
      {[...Array(15)].map((_, idx) => (
        <div key={idx} className={`absolute w-2 h-2 bg-cyan-400 rounded-full opacity-70 animate-floating particle-${idx}`} />
      ))}

      {/* Neon background blobs */}
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-r from-orange-500 to-cyan-400 rounded-full opacity-20 blur-3xl animate-blob top-[-20%] left-[-10%]"></div>
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-r from-cyan-400 to-orange-500 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000 bottom-[-20%] right-[-10%]"></div>

      {/* Login Card */}
      <div className={`relative w-full max-w-md bg-slate-900/90 backdrop-blur-lg rounded-xl p-8 border border-cyan-400 shadow-neon transform transition duration-500 hover:scale-105 hover:shadow-neon-glow hover:animate-pulse`}>
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-orange-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg mb-6 animate-fade-in">
          Login
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-cyan-500 bg-slate-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:shadow-neon transition"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-cyan-500 bg-slate-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:shadow-neon transition"
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-orange-500 to-cyan-400 text-white font-bold shadow-lg shadow-cyan-400/50 hover:shadow-neon hover:scale-110 transform transition duration-500"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-cyan-400 hover:underline transition">Forgot your password?</a>
        </div>
        <div className="mt-2 text-center">
          <a href="/register" className="text-cyan-400 hover:underline transition">Don&apos;t have an account? Register</a>
        </div>
      </div>

      {/* Tailwind Animations */}
      <style jsx>{`
        @keyframes blob {
          0%,100% { transform: translate(0px,0px) scale(1); }
          33% { transform: translate(30px,-20px) scale(1.1); }
          66% { transform: translate(-20px,30px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 1s forwards; }

        @keyframes floating {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.7; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
        }
        ${[...Array(15)].map((_, i) => `.particle-${i} { animation: floating ${5+i}s ease-in-out infinite alternate; top: ${Math.random()*80}%; left: ${Math.random()*80}%; }`).join("\n")}

        .shadow-neon {
          box-shadow: 0 0 10px #06b6d4, 0 0 20px #06b6d4, 0 0 30px #f97316, 0 0 40px #f97316;
        }
        .shadow-neon-glow {
          box-shadow: 0 0 15px #06b6d4, 0 0 30px #06b6d4, 0 0 45px #f97316, 0 0 60px #f97316;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-pulse { animation: pulse 2s infinite; }
      `}</style>
    </div>
  );
}
