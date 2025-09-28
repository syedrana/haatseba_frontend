"use client"; 

import { XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EmailVerificationFailedPage() {
  const [countdown, setCountdown] = useState(8);
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (countdown === 0) {
      window.location.href = "/register";
    }

    return () => clearInterval(timer);
  }, [countdown]);

  // ✅ কারণভেদে মেসেজ
  let message = "আপনার ভেরিফিকেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
  if (reason === "expired") {
    message = "ভেরিফিকেশন লিঙ্কটি এক্সপায়ার হয়ে গেছে। নতুন লিঙ্ক জেনারেট করুন।";
  } else if (reason === "invalid") {
    message = "ভেরিফিকেশন লিঙ্কটি অবৈধ। আবার চেষ্টা করুন।";
  } else if (reason === "invalid-user") {
    message = "ইউজার পাওয়া যায়নি। আবার রেজিস্টার করুন।";
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">
          Email Verification Failed ❌
        </h1>
        <p className="text-gray-600 mt-2">{message}</p>

        <Link
          href="/register"
          className="mt-6 inline-block bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition"
        >
          Register Again
        </Link>

        <p className="text-sm text-gray-500 mt-4">
          Redirecting to registration in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}
