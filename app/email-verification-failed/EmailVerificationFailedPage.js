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
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = "/register";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  let message = "আপনার ভেরিফিকেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
  if (reason === "expired") message = "ভেরিফিকেশন লিঙ্কটি এক্সপায়ার হয়ে গেছে। নতুন লিঙ্ক জেনারেট করুন।";
  else if (reason === "invalid") message = "ভেরিফিকেশন লিঙ্কটি অবৈধ। আবার চেষ্টা করুন।";
  else if (reason === "invalid-user") message = "ইউজার পাওয়া যায়নি। আবার রেজিস্টার করুন।";

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 dark:bg-background">
      <div className="bg-card rounded-2xl shadow-lg p-8 max-w-md text-center dark:bg-card">
        <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground dark:text-foreground">
          Email Verification Failed ❌
        </h1>
        <p className="text-muted-foreground mt-2 dark:text-muted-foreground">{message}</p>

        <Link
          href="/register"
          className="mt-6 inline-block bg-primary text-primary-foreground px-6 py-2 rounded-xl hover:bg-primary/80 transition"
        >
          Register Again
        </Link>

        <p className="text-sm text-muted-foreground mt-4 dark:text-muted-foreground">
          Redirecting to registration in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}
