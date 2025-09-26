"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EmailVerifiedPage() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (countdown === 0) {
      window.location.href = "/login";
    }

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">
          Email Verified Successfully 🎉
        </h1>
        <p className="text-gray-600 mt-2">
          আপনার ইমেইল ভেরিফিকেশন সফল হয়েছে। এখন আপনি লগইন করতে পারবেন।
        </p>

        <Link
          href="/login"
          className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition"
        >
          Login Now
        </Link>

        <p className="text-sm text-gray-500 mt-4">
          Redirecting to login in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}
