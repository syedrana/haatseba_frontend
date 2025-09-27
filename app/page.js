"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const categories = [
  "Electronics",
  "Fashion",
  "Home Essentials",
  "Livestock",
  "Toys & Games",
  "Books",
];

const products = [
  "Smartphone",
  "Laptop",
  "Shoes",
  "Furniture",
  "Goat",
  "Camel",
];

const testimonials = [
  "HaatSeba made my shopping experience seamless and trustworthy!",
  "Wide variety of products in one place, highly recommended.",
  "Fast delivery and excellent customer support.",
];

const Home = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-slate-950 text-gray-100 min-h-screen overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">
        {/* Animated Blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-gradient-to-r from-orange-500 to-cyan-400 rounded-full opacity-20 blur-3xl animate-blob"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-r from-cyan-400 to-orange-500 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>

        <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-orange-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">
          Welcome to HaatSeba
        </h1>
        <p className="mt-6 max-w-2xl text-lg sm:text-xl text-gray-300 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Your trusted online marketplace. Find electronics, fashion, home essentials, livestock, and more – all in one place.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-6">
          <Link
            href="/shop"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-cyan-400 text-white font-semibold shadow-lg shadow-cyan-400/50 hover:shadow-cyan-400/90 hover:scale-110 transform transition duration-500"
          >
            Shop Now
          </Link>
          <Link
            href="/products"
            className="px-8 py-4 rounded-full border-2 border-cyan-400 text-cyan-400 font-semibold shadow-lg shadow-cyan-400/30 hover:bg-cyan-400 hover:text-slate-900 hover:scale-110 transform transition duration-500"
          >
            Explore Products
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in" style={{ animationDelay: "0.3s" }}>
          Explore Categories
        </h2>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat}
              className="p-6 rounded-lg bg-slate-800 text-center shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/70 hover:scale-105 transform transition cursor-pointer animate-fade-in"
              style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
            >
              <div className="text-xl font-semibold text-orange-400">{cat}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in" style={{ animationDelay: "0.3s" }}>
          Popular Products
        </h2>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((prod, idx) => (
            <div
              key={prod}
              className="p-6 rounded-lg bg-slate-800 text-center shadow-lg shadow-orange-500/20 hover:shadow-orange-500/70 hover:scale-105 transform transition cursor-pointer animate-fade-in"
              style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
            >
              <div className="text-lg font-semibold text-cyan-400">{prod}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in" style={{ animationDelay: "0.3s" }}>
          What Our Customers Say
        </h2>
        <div className="mt-12 flex flex-col gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-slate-800 text-center shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/80 transform transition animate-fade-in"
              style={{ animationDelay: `${0.2 + idx * 0.2}s` }}
            >
              <p className="text-gray-300 italic">"{t}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Bottom */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in" style={{ animationDelay: "0.3s" }}>
          Start Shopping Today
        </h2>
        <Link
          href="/shop"
          className="mt-6 inline-block px-10 py-4 rounded-full bg-gradient-to-r from-orange-500 to-cyan-400 text-white font-semibold shadow-lg shadow-cyan-400/50 hover:shadow-cyan-400/90 hover:scale-110 transform transition duration-500"
        >
          Browse Products
        </Link>
      </section>

      {/* Tailwind Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 30px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;
