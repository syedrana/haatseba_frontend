"use client";

import Link from "next/link";

const HomeHero = () => {
  return (
    <section className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-gray-100 min-h-screen flex items-center">
      {/* Background Glow Accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-gradient-to-r from-orange-500 to-cyan-400 rounded-full opacity-20 blur-3xl animate-blob"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-r from-cyan-400 to-orange-500 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-orange-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
          Discover Amazing Products
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
          Shop from a wide variety of products ranging from electronics, fashion, home essentials, livestock, and more – all in one place.
        </p>

        {/* Call to Action */}
        <div className="mt-10 flex justify-center gap-6">
          <Link
            href="/shop"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-cyan-400 text-white font-semibold shadow-lg shadow-cyan-400/50 hover:shadow-cyan-400/80 hover:scale-105 transform transition"
          >
            Shop Now
          </Link>
          <Link
            href="/products"
            className="px-8 py-4 rounded-full border-2 border-cyan-400 text-cyan-400 font-semibold shadow-lg shadow-cyan-400/30 hover:bg-cyan-400 hover:text-slate-900 hover:scale-105 transform transition"
          >
            Explore Products
          </Link>
        </div>

        <p className="mt-12 text-gray-500 text-sm sm:text-base">
          Trusted marketplace with safe transactions and a wide selection of products for your every need.
        </p>
      </div>
    </section>
  );
};

export default HomeHero;
