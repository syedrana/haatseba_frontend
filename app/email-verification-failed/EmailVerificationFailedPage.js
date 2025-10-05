// "use client";

// import { XCircle } from "lucide-react";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function EmailVerificationFailedPage() {
//   const [countdown, setCountdown] = useState(8);
//   const searchParams = useSearchParams();
//   const reason = searchParams.get("reason");

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           window.location.href = "/register";
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   let message = "আপনার ভেরিফিকেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
//   if (reason === "expired") message = "ভেরিফিকেশন লিঙ্কটি এক্সপায়ার হয়ে গেছে। নতুন লিঙ্ক জেনারেট করুন।";
//   else if (reason === "invalid") message = "ভেরিফিকেশন লিঙ্কটি অবৈধ। আবার চেষ্টা করুন।";
//   else if (reason === "invalid-user") message = "ইউজার পাওয়া যায়নি। আবার রেজিস্টার করুন।";

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-background px-4 dark:bg-background">
//       <div className="bg-card rounded-2xl shadow-lg p-8 max-w-md text-center dark:bg-card">
//         <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
//         <h1 className="text-2xl font-bold text-foreground dark:text-foreground">
//           Email Verification Failed ❌
//         </h1>
//         <p className="text-muted-foreground mt-2 dark:text-muted-foreground">{message}</p>

//         <Link
//           href="/register"
//           className="mt-6 inline-block bg-primary text-primary-foreground px-6 py-2 rounded-xl hover:bg-primary/80 transition"
//         >
//           Register Again
//         </Link>

//         <p className="text-sm text-muted-foreground mt-4 dark:text-muted-foreground">
//           Redirecting to registration in {countdown} seconds...
//         </p>
//       </div>
//     </div>
//   );
// }



// "use client";

// import axios from "axios";
// import { CheckCircle, Loader2, XCircle } from "lucide-react";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";


// export default function EmailVerificationFailedPage() {
//   const [countdown, setCountdown] = useState(8);
//   const [isRedirecting, setIsRedirecting] = useState(false);
//   const [resending, setResending] = useState(false);
//   const [resendSuccess, setResendSuccess] = useState(false);
//   const [resendError, setResendError] = useState("");
//   const [email, setEmail] = useState("");
//   const searchParams = useSearchParams();
//   const reason = searchParams.get("reason");
//   const userEmail = searchParams.get("email"); // ✅ আমরা URL query থেকে ইমেইল নিচ্ছি
//   const router = useRouter();

//   useEffect(() => {
//     if (userEmail) setEmail(userEmail);

//     const timer = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           setIsRedirecting(true);
//           setTimeout(() => router.push("/register"), 1000);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [router, userEmail]);

//   // 🧠 বাংলা মেসেজ ম্যানেজমেন্ট
//   let message = "আপনার ভেরিফিকেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
//   if (reason === "expired")
//     message = "ভেরিফিকেশন লিঙ্কটির মেয়াদ শেষ হয়েছে। অনুগ্রহ করে নতুন লিঙ্ক পাঠান।";
//   else if (reason === "invalid")
//     message = "ভেরিফিকেশন লিঙ্কটি অবৈধ। পুনরায় রেজিস্টার করুন।";
//   else if (reason === "invalid-user")
//     message = "ইউজার পাওয়া যায়নি। দয়া করে নতুন করে রেজিস্টার করুন।";

//   // 🔁 নতুন লিংক পাঠানো ফাংশন
//   const handleResendVerification = async () => {
//     if (!email) {
//       setResendError("ইমেইল পাওয়া যায়নি। দয়া করে রেজিস্টার করুন।");
//       return;
//     }

//     setResending(true);
//     setResendError("");
//     setResendSuccess(false);

//     try {
//       const res = await axios.post(
//         `${process.env.BACKEND_BASE_URL}/resend-verification`,
//         { email }
//       );

//       if (res.data.success) {
//         setResendSuccess(true);
//       } else {
//         setResendError(res.data.message || "লিংক পাঠানো ব্যর্থ হয়েছে।");
//       }
//     } catch (err) {
//       setResendError(err.response?.data?.message || "লিংক পাঠানো ব্যর্থ হয়েছে।");
//     } finally {
//       setResending(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-background px-4">
//       <div className="bg-card rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-border">
//         <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
//         <h1 className="text-2xl font-bold text-foreground">
//           ইমেইল ভেরিফিকেশন ব্যর্থ ❌
//         </h1>

//         <p className="text-muted-foreground mt-3">{message}</p>

//         {/* 🔁 শুধুমাত্র expired হলে রিসেন্ড বাটন দেখাবে */}
//         {reason === "expired" && (
//           <div className="mt-5">
//             {resendSuccess ? (
//               <div className="flex items-center justify-center gap-2 text-green-600">
//                 <CheckCircle className="w-5 h-5" />
//                 <span>নতুন ভেরিফিকেশন লিংক পাঠানো হয়েছে ✅</span>
//               </div>
//             ) : (
//               <button
//                 onClick={handleResendVerification}
//                 disabled={resending}
//                 className="bg-primary text-primary-foreground px-5 py-2 rounded-xl hover:bg-primary/80 transition disabled:opacity-50"
//               >
//                 {resending ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <Loader2 className="w-4 h-4 animate-spin" /> পাঠানো হচ্ছে...
//                   </span>
//                 ) : (
//                   "নতুন লিংক পাঠাও"
//                 )}
//               </button>
//             )}
//             {resendError && (
//               <p className="text-destructive text-sm mt-2">{resendError}</p>
//             )}
//           </div>
//         )}

//         <Link
//           href="/register"
//           className="mt-6 inline-block border border-primary text-primary px-6 py-2 rounded-xl hover:bg-primary/10 transition"
//         >
//           আবার রেজিস্টার করুন
//         </Link>

//         <p className="text-sm text-muted-foreground mt-4">
//           {isRedirecting
//             ? "রিডিরেক্ট হচ্ছে..."
//             : `রিডিরেক্ট হচ্ছে ${countdown} সেকেন্ডে...`}
//         </p>
//       </div>
//     </div>
//   );
// }













// "use client";

// import axios from "axios";
// import { CheckCircle, Loader2, XCircle } from "lucide-react";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function EmailVerificationFailedPage() {
//   const [countdown, setCountdown] = useState(8);
//   const [isRedirecting, setIsRedirecting] = useState(false);
//   const [resending, setResending] = useState(false);
//   const [resendSuccess, setResendSuccess] = useState(false);
//   const [resendError, setResendError] = useState("");
//   const [email, setEmail] = useState("");

//   const searchParams = useSearchParams();
//   const reason = searchParams.get("reason");
//   const router = useRouter();

//   // 📌 Frontend fallback: localStorage
//   useEffect(() => {
//     const emailFromQuery = searchParams.get("email");
//     const emailFromStorage = localStorage.getItem("pendingEmail");

//     if (emailFromQuery) {
//       setEmail(emailFromQuery);
//       localStorage.setItem("pendingEmail", emailFromQuery); // save for fallback
//     } else if (emailFromStorage) {
//       setEmail(emailFromStorage);
//     }

//     const timer = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           setIsRedirecting(true);
//           setTimeout(() => router.push("/register"), 1000);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [router, searchParams]);

//   // 🧠 বাংলা মেসেজ
//   let message = "আপনার ভেরিফিকেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
//   if (reason === "expired")
//     message = "ভেরিফিকেশন লিঙ্কটির মেয়াদ শেষ হয়েছে। অনুগ্রহ করে নতুন লিঙ্ক পাঠান।";
//   else if (reason === "invalid")
//     message = "ভেরিফিকেশন লিঙ্কটি অবৈধ। পুনরায় রেজিস্টার করুন।";
//   else if (reason === "invalid-user")
//     message = "ইউজার পাওয়া যায়নি। দয়া করে নতুন করে রেজিস্টার করুন।";

//   // 🔁 নতুন লিংক পাঠানো ফাংশন
//   const handleResendVerification = async () => {
//     if (!email) {
//       setResendError("ইমেইল পাওয়া যায়নি। দয়া করে রেজিস্টার করুন।");
//       return;
//     }

//     setResending(true);
//     setResendError("");
//     setResendSuccess(false);

//     try {
//       const res = await axios.post(
//         `${process.env.BACKEND_BASE_URL}/resend-verification`,
//         { email }
//       );

//       if (res.data.success) {
//         setResendSuccess(true);
//       } else {
//         setResendError(res.data.message || "লিংক পাঠানো ব্যর্থ হয়েছে।");
//       }
//     } catch (err) {
//       setResendError(err.response?.data?.message || "লিংক পাঠানো ব্যর্থ হয়েছে।");
//     } finally {
//       setResending(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-background px-4">
//       <div className="bg-card rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-border">
//         <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
//         <h1 className="text-2xl font-bold text-foreground">
//           ইমেইল ভেরিফিকেশন ব্যর্থ ❌
//         </h1>

//         <p className="text-muted-foreground mt-3">{message}</p>

//         {reason === "expired" && (
//           <div className="mt-5">
//             {resendSuccess ? (
//               <div className="flex items-center justify-center gap-2 text-green-600">
//                 <CheckCircle className="w-5 h-5" />
//                 <span>নতুন ভেরিফিকেশন লিংক পাঠানো হয়েছে ✅</span>
//               </div>
//             ) : (
//               <button
//                 onClick={handleResendVerification}
//                 disabled={resending}
//                 className="bg-primary text-primary-foreground px-5 py-2 rounded-xl hover:bg-primary/80 transition disabled:opacity-50"
//               >
//                 {resending ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <Loader2 className="w-4 h-4 animate-spin" /> পাঠানো হচ্ছে...
//                   </span>
//                 ) : (
//                   "নতুন লিংক পাঠাও"
//                 )}
//               </button>
//             )}
//             {resendError && (
//               <p className="text-destructive text-sm mt-2">{resendError}</p>
//             )}
//           </div>
//         )}

//         <Link
//           href="/register"
//           className="mt-6 inline-block border border-primary text-primary px-6 py-2 rounded-xl hover:bg-primary/10 transition"
//         >
//           আবার রেজিস্টার করুন
//         </Link>

//         <p className="text-sm text-muted-foreground mt-4">
//           {isRedirecting
//             ? "রিডিরেক্ট হচ্ছে..."
//             : `রিডিরেক্ট হচ্ছে ${countdown} সেকেন্ডে...`}
//         </p>
//       </div>
//     </div>
//   );
// }











"use client";

import axios from "axios";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EmailVerificationFailedPage() {
  const [countdown, setCountdown] = useState(8);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");
  const [email, setEmail] = useState("");

  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const router = useRouter();

  // 📌 Frontend fallback: localStorage
  useEffect(() => {
    //const emailFromQuery = searchParams.get("email");
    const emailFromQuery = decodeURIComponent(searchParams.get("email") || "");
    const emailFromStorage = localStorage.getItem("pendingEmail");

    if (emailFromQuery) {
      const decodedEmail = decodeURIComponent(emailFromQuery); // ✅ decodeURIComponent
      setEmail(decodedEmail);
      localStorage.setItem("pendingEmail", decodedEmail); // save for fallback
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRedirecting(true);
          setTimeout(() => router.push("/register"), 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, searchParams]);

  // 🧠 বাংলা মেসেজ
  let message = "আপনার ভেরিফিকেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
  if (reason === "expired")
    message = "ভেরিফিকেশন লিঙ্কটির মেয়াদ শেষ হয়েছে। অনুগ্রহ করে নতুন লিঙ্ক পাঠান।";
  else if (reason === "invalid")
    message = "ভেরিফিকেশন লিঙ্কটি অবৈধ। পুনরায় রেজিস্টার করুন।";
  else if (reason === "invalid-user")
    message = "ইউজার পাওয়া যায়নি। দয়া করে নতুন করে রেজিস্টার করুন।";

  // 🔁 নতুন লিংক পাঠানো ফাংশন
  const handleResendVerification = async () => {
    if (!email) {
      setResendError("ইমেইল পাওয়া যায়নি। দয়া করে রেজিস্টার করুন।");
      return;
    }

    setResending(true);
    setResendError("");
    setResendSuccess(false);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/resend-verification`,
        { email }
      );

      if (res.data.success) {
        setResendSuccess(true);
      } else {
        setResendError(res.data.message || "লিংক পাঠানো ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      setResendError(err.response?.data?.message || "লিংক পাঠানো ব্যর্থ হয়েছে।");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="bg-card rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-border">
        <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground">
          ইমেইল ভেরিফিকেশন ব্যর্থ ❌
        </h1>

        <p className="text-muted-foreground mt-3">{message}</p>

        {reason === "expired" && (
          <div className="mt-5">
            {resendSuccess ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>নতুন ভেরিফিকেশন লিংক পাঠানো হয়েছে ✅</span>
              </div>
            ) : (
              <button
                onClick={handleResendVerification}
                disabled={resending}
                className="bg-primary text-primary-foreground px-5 py-2 rounded-xl hover:bg-primary/80 transition disabled:opacity-50"
              >
                {resending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> পাঠানো হচ্ছে...
                  </span>
                ) : (
                  "নতুন লিংক পাঠাও"
                )}
              </button>
            )}
            {resendError && (
              <p className="text-destructive text-sm mt-2">{resendError}</p>
            )}
          </div>
        )}

        <Link
          href="/register"
          className="mt-6 inline-block border border-primary text-primary px-6 py-2 rounded-xl hover:bg-primary/10 transition"
        >
          আবার রেজিস্টার করুন
        </Link>

        <p className="text-sm text-muted-foreground mt-4">
          {isRedirecting
            ? "রিডিরেক্ট হচ্ছে..."
            : `রিডিরেক্ট হচ্ছে ${countdown} সেকেন্ডে...`}
        </p>
      </div>
    </div>
  );
}
