"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  Check,
  Clock,
  CreditCard,
  Gift,
  GraduationCap,
  Loader,
  Shield,
  ShoppingBag,
  Sparkles,
  Truck,
  UploadCloud,
  User,
  X
} from "lucide-react";

/**
 * Vendor Request page (Next.js client component)
 * - Tailwind for styling
 * - Framer Motion for subtle animations
 * - Validations on client side
 * - Sends multipart/form-data to backend (/vendorrequest)
 *
 * Usage: place at /app/vendor-request/page.jsx
 */

const benefits = [
  {
    icon: Gift,
    title: "Zero Commission Offers",
    description:
      "Occasional promotional windows where new sellers pay 0% commission for eligible categories — keep more of your revenue during launch campaigns.",
  },
  {
    icon: ShoppingBag,
    title: "Free Listing / No Entry Fee",
    description:
      "No signup or listing fee — register and publish your first products without extra onboarding charges.",
  },
  {
    icon: Truck,
    title: "Free Pickup & Storage",
    description:
      "Select campaigns include free pickup and warehousing support for new sellers to simplify logistics.",
  },
  {
    icon: CreditCard,
    title: "Promotional Credit & Marketing Support",
    description:
      "Get promotional credits and marketplace marketing support to boost visibility in the early days.",
  },
  {
    icon: GraduationCap,
    title: "Onboarding & Education",
    description:
      "Access seller webinars, guides and onboarding support to grow sales and optimize listings.",
  },
  {
    icon: Clock,
    title: "Express Onboarding",
    description:
      "Fast-track sign-up flows so you can start selling as soon as possible with guided steps.",
  },
  {
    icon: Shield,
    title: "Secure & Timely Payments",
    description:
      "Reliable payment settlement processes to ensure you receive payouts on schedule.",
  },
  {
    icon: User,
    title: "Individual Sellers Welcome",
    description:
      "You can sell as an individual (NID) — company registration isn't required for many categories.",
  },
];

const faqs = [
  {
    q: "How can I sell on Daraz?",
    a:
      "To start selling, create an account on the Seller Center using your phone number, verify your email, add pickup address and upload required documents. After approval add your first product and start selling. Customize your store via the Store Builder.",
  },
  {
    q: "What categories can I sell on Daraz?",
    a:
      "Daraz supports multiple categories — fashion, electronics, FMCG, lifestyle and more. Avoid listing counterfeit, restricted or prohibited products. Check category rules on the Seller Center for details.",
  },
  {
    q: "How much commission does Daraz charge?",
    a:
      "Opening a shop is free. Commission is deducted per order and varies by category. Promotional windows may offer reduced or 0% commission for new sellers. Refer to the commission schedule for category-specific rates.",
  },
  {
    q: "What is the payment policy for Daraz?",
    a:
      "Payments are processed for orders marked as 'Delivered' and settled on a weekly schedule. If a payment date falls on a weekend or public holiday, disbursement occurs on the next business day.",
  },
];



const phoneRegex = /^01[0-9]{9}$/;
const emailRegex = /^\S+@\S+\.\S+$/;

export default function VendorRequestPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const [form, setForm] = useState({
    businessName: "",
    businessAddress: "",
    tradeLicenseNumber: "",
    businessPhone: "",
    businessEmail: "",
    bankAccount: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      branchName: "",
      bkashNumber: "",
      nagadNumber: "",
    },
  });

  const [documents, setDocuments] = useState([]); // File objects
  const [previews, setPreviews] = useState([]); // preview urls
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    if (name.startsWith("bank.")) {
      const key = name.split(".")[1];
      setForm((p) => ({ ...p, bankAccount: { ...p.bankAccount, [key]: value } }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  }

  function handleFiles(files) {
    if (!files || !files.length) return;
    const arr = Array.from(files).slice(0, 6); // limit to 6 docs
    setDocuments((prev) => [...prev, ...arr]);
    const newPreviews = arr.map((f) => ({ id: cryptoPreviewId(), name: f.name, url: URL.createObjectURL(f) }));
    setPreviews((p) => [...p, ...newPreviews]);
  }

  function cryptoPreviewId() {
    return Math.random().toString(36).slice(2, 9);
  }

  function removeDocument(index) {
    setDocuments((d) => d.filter((_, i) => i !== index));
    setPreviews((p) => p.filter((_, i) => i !== index));
  }

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function validate() {
    const e = {};
    if (!form.businessName.trim()) e.businessName = "Business name required";
    if (!form.businessAddress.trim() || form.businessAddress.trim().length < 5) e.businessAddress = "Address required (min 5 chars)";
    if (!phoneRegex.test(form.businessPhone || "")) e.businessPhone = "Valid Bangladeshi phone required";

    if (!emailRegex.test(form.businessEmail || "")) e.businessEmail = "Invalid email";
    if (!form.businessEmail.trim()) e.businessEmail = "Business email required";

    // trade license optional but if provided limited chars
    if (!form.tradeLicenseNumber.trim() || !/^[A-Za-z0-9-]*$/.test(form.tradeLicenseNumber)) e.tradeLicenseNumber = "Trade license only letters, numbers, hyphen";
    if (!form.tradeLicenseNumber.trim()) e.tradeLicenseNumber = "Trade license required";
    
    // bank account minimal validation (if provided)
    if (form.bankAccount.bkashNumber && !phoneRegex.test(form.bankAccount.bkashNumber)) e.bkashNumber = "Invalid bKash number";
    if (form.bankAccount.nagadNumber && !phoneRegex.test(form.bankAccount.nagadNumber)) e.nagadNumber = "Invalid Nagad number";
    
    // documents optional; if none maybe warn
    if (!documents.length) e.documents = "At least one document recommended";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setErrors({});
    setSuccessMessage("");
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    try {
      // Build FormData
      const formData = new FormData();
      formData.append("businessName", form.businessName.trim());
      formData.append("businessAddress", form.businessAddress.trim());
      formData.append("tradeLicenseNumber", form.tradeLicenseNumber.trim() || "");
      formData.append("businessPhone", form.businessPhone.trim());
      formData.append("businessEmail", form.businessEmail?.trim() || "");

      // bank account as JSON string
      formData.append("bankAccount", JSON.stringify(form.bankAccount || {}));

      // append files (documents) - name "documents"
      documents.forEach((file) => {
        formData.append("documents", file); // backend should accept req.files or parse
      });

      // auth (from localStorage token)
      // const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/vendorrequest`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
            // ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          //timeout: 300000,
        }
      );

      setSuccessMessage(res.data?.message || "Request submitted");
      // optionally redirect after short delay
      setTimeout(() => {
        router.push("/dashboard"); // or wherever
      }, 3000);
    } catch (err) {
      console.error("Vendor submit error:", err);
      const msg = err.response?.data?.message || "Submission failed. Try again.";
      setErrors({ submit: msg });
    } finally {
      setSubmitting(false);
    }
  }

  const [myRequest, setMyRequest] = useState(null);
  const [loadingRequest, setLoadingRequest] = useState(true);

  useEffect(() => {
    async function fetchMyRequest() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setLoadingRequest(false);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/myrequest`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyRequest(res.data?.request || null);
      } catch (err) {
        console.log("My Vendor Request fetch error:", err);
      } finally {
        setLoadingRequest(false);
      }
    }
    fetchMyRequest();
  }, []);



// bg-gradient-to-b from-slate-50 to-white
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:to-gray-800 p-6 md:p-12">
      {/* HERO */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-orange-400 to-indigo-500 rounded-3xl shadow-xl p-8 md:p-12 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
                Start Selling with Confidence
              </h1>
              <p className="mt-3 text-indigo-100 max-w-xl">
                Join our platform to reach thousands of customers. Fast onboarding, promotional support, and secure payouts — everything to launch your online store quickly.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={scrollToForm}
                  className="inline-flex items-center gap-3 bg-white text-orange-600 px-5 py-3 rounded-xl font-semibold shadow hover:scale-[1.01] transition"
                >
                  <Sparkles className="w-5 h-5" />
                  Start Selling
                </button>

                <a
                  href="#benefits"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  Learn More
                </a>
              </div>
            </div>

            <div className="hidden md:flex justify-end">
              <div className="w-full max-w-md">
                {/* <Image
                  src="/globe.svg"
                  alt="Seller illustration"
                  fill
                  className="w-full rounded-xl shadow-lg object-cover"
                /> */}
              </div>
            </div>
          </div>

          {/* decorative circles */}
          <div className="absolute -right-20 -bottom-20 opacity-30 w-72 h-72 rounded-full bg-white/10 blur-3xl"></div>
        </div>
      </header>

      

      {/* যদি নিজের রিকোয়েস্ট পাওয়া যায় */}
      {!loadingRequest && myRequest ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto p-6 md:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vendor Request Status</h1>
            <span className="text-sm text-gray-500">Need help? <span className="text-indigo-600">haatseba@gmail.com</span></span>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center mb-6">
            <div
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border 
                ${
                  myRequest.status === "approved"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : myRequest.status === "rejected"
                    ? "bg-rose-100 text-rose-800 border-rose-200"
                    : "bg-amber-100 text-amber-800 border-amber-200"
                }`}
            >
              {myRequest.status === "approved" && "✅ Approved"}
              {myRequest.status === "pending" && "⏳ Pending Review"}
              {myRequest.status === "rejected" && "❌ Rejected"}
            </div>
          </div>

          
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 mb-3">
            You have submitted your vendor request at {new Date(myRequest.createdAt).toLocaleString()}
          </p>
          
          

          {/* Submitted Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-200 mb-6">
            <p><b>Business Name:</b> {myRequest.businessName}</p>
            <p><b>Business Email:</b> {myRequest.businessEmail || "N/A"}</p>
            <p><b>Address:</b> {myRequest.businessAddress}</p>
            <p><b>Trade License:</b> {myRequest.tradeLicenseNumber || "N/A"}</p>
            <p><b>Phone:</b> {myRequest.businessPhone}</p>
          </div>

          {/* Admin Note (for rejected requests) */}
          {myRequest.status === "rejected" && myRequest.adminNote && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-5 rounded-xl border border-rose-200 bg-rose-50 shadow-sm flex gap-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-rose-600 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3C6.477 3 2 7.477 2 13c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" />
              </svg>
              <div>
                <h3 className="font-semibold text-rose-800">Admin Note</h3>
                <p className="text-sm text-rose-700 mt-1">{myRequest.adminNote}</p>
                {myRequest.reviewedAt && (
                  <p className="text-xs text-gray-500 mt-1">Reviewed on: {new Date(myRequest.reviewedAt).toLocaleString()}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Approved Message */}
          {myRequest.status === "approved" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-5 rounded-xl border border-emerald-200 bg-emerald-50 shadow-sm text-sm text-emerald-700"
            >
              🎉 Congratulations! Your vendor account is approved.  
              You can now access your vendor dashboard and start adding products.
              {myRequest.reviewedAt && (
                <p className="text-xs text-gray-500 mt-1">Reviewed on: {new Date(myRequest.reviewedAt).toLocaleString()}</p>
              )}
            </motion.div>
          )}

          {/* Dashboard Button */}
          {/* <div className="flex justify-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md"
            >
              Go to Dashboard
            </button>
          </div> */}
        </motion.div>

      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 md:p-8 mb-6 border">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                  Become a Seller
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Submit your business details. Our team will review & approve your seller account.
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block text-sm text-gray-500">Need help?</span>
                <div className="text-xs text-indigo-600">haatseba@gmail.com</div>
              </div>
            </div>
          </div>
          
          {/* Form card */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ scale: 0.998 }}
            whileHover={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border"
          >
            {/* top errors */}
            {Object.keys(errors).length > 0 && (
              <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 text-sm">
                {errors.submit ? (
                  <div>{errors.submit}</div>
                ) : (
                  <div>Please fix the highlighted fields below.</div>
                )}
              </div>
            )}

            {/* Business info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Business name *</label>
                <input
                  name="businessName"
                  value={form.businessName}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-xl border px-3 py-2 bg-transparent
                    ${errors.businessName ? "border-rose-400 focus:ring-rose-200" : "border-gray-300 focus:ring-indigo-200"}`}
                  placeholder="Ex: ABC Traders"
                />
                {errors.businessName && <p className="text-xs text-rose-600 mt-1">{errors.businessName}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Business phone *</label>
                <input
                  name="businessPhone"
                  value={form.businessPhone}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-xl border px-3 py-2 bg-transparent
                    ${errors.businessPhone ? "border-rose-400 focus:ring-rose-200" : "border-gray-300 focus:ring-indigo-200"}`}
                  placeholder="01XXXXXXXXX"
                />
                {errors.businessPhone && <p className="text-xs text-rose-600 mt-1">{errors.businessPhone}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Business address *</label>
                <textarea
                  name="businessAddress"
                  value={form.businessAddress}
                  onChange={handleChange}
                  rows={3}
                  className={`mt-1 block w-full rounded-xl border px-3 py-2 bg-transparent resize-none
                    ${errors.businessAddress ? "border-rose-400 focus:ring-rose-200" : "border-gray-300 focus:ring-indigo-200"}`}
                  placeholder="Full address, area, city"
                />
                {errors.businessAddress && <p className="text-xs text-rose-600 mt-1">{errors.businessAddress}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Business email</label>
                <input
                  name="businessEmail"
                  value={form.businessEmail}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-xl border px-3 py-2 bg-transparent
                    ${errors.businessEmail ? "border-rose-400 focus:ring-rose-200" : "border-gray-300 focus:ring-indigo-200"}`}
                  placeholder="Optional, for transactions"
                />
                {errors.businessEmail && <p className="text-xs text-rose-600 mt-1">{errors.businessEmail}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Trade license no.</label>
                <input
                  name="tradeLicenseNumber"
                  value={form.tradeLicenseNumber}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-xl border px-3 py-2 bg-transparent
                    ${errors.tradeLicenseNumber ? "border-rose-400 focus:ring-rose-200" : "border-gray-300 focus:ring-indigo-200"}`}
                  placeholder="Optional"
                />
                {errors.tradeLicenseNumber && <p className="text-xs text-rose-600 mt-1">{errors.tradeLicenseNumber}</p>}
              </div>
            </div>

            {/* Bank info */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Payment / Bank info (optional)</h3>
              <p className="text-xs text-gray-500 mb-3">Where you&apos;d like payouts (if applicable)</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  name="bank.accountName"
                  value={form.bankAccount.accountName}
                  onChange={handleChange}
                  className="rounded-xl border px-3 py-2 bg-transparent border-gray-300"
                  placeholder="Account holder name"
                />
                <input
                  name="bank.accountNumber"
                  value={form.bankAccount.accountNumber}
                  onChange={handleChange}
                  className="rounded-xl border px-3 py-2 bg-transparent border-gray-300"
                  placeholder="Account number"
                />
                <input
                  name="bank.bankName"
                  value={form.bankAccount.bankName}
                  onChange={handleChange}
                  className="rounded-xl border px-3 py-2 bg-transparent border-gray-300"
                  placeholder="Bank name"
                />
                <input
                  name="bank.branchName"
                  value={form.bankAccount.branchName}
                  onChange={handleChange}
                  className="rounded-xl border px-3 py-2 bg-transparent border-gray-300"
                  placeholder="Branch"
                />

                <input
                  name="bank.bkashNumber"
                  value={form.bankAccount.bkashNumber}
                  onChange={handleChange}
                  className={`rounded-xl border px-3 py-2 bg-transparent ${errors.bkashNumber ? "border-rose-400" : "border-gray-300"}`}
                  placeholder="bKash (01XXXXXXXXX)"
                />
                <input
                  name="bank.nagadNumber"
                  value={form.bankAccount.nagadNumber}
                  onChange={handleChange}
                  className={`rounded-xl border px-3 py-2 bg-transparent ${errors.nagadNumber ? "border-rose-400" : "border-gray-300"}`}
                  placeholder="Nagad (01XXXXXXXXX)"
                />
              </div>
              {(errors.bkashNumber || errors.nagadNumber) && (
                <p className="text-xs text-rose-600 mt-2">{errors.bkashNumber || errors.nagadNumber}</p>
              )}
            </div>

            {/* Documents upload */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Documents (optional)</h3>
              <p className="text-xs text-gray-500 mb-3">Upload trade license, NID, bank screenshot, etc. (jpg, png, pdf)</p>

              <div className="flex items-center gap-3">
                <label
                  htmlFor="docs"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700 transition"
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload documents
                </label>
                <input
                  id="docs"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                />
                <span className="text-sm text-gray-500">{documents.length} selected (max 6)</span>
              </div>

              {/* previews */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {previews.map((p, idx) => (
                  <div key={p.id} className="relative rounded-lg border overflow-hidden">
                    {p.url.endsWith(".pdf") || p.name.endsWith(".pdf") ? (
                      <div className="flex items-center justify-center h-28 bg-gray-50 dark:bg-gray-700">
                        <div className="text-xs text-gray-500">{p.name}</div>
                      </div>
                    ) : (
                      <Image src={p.url} alt={p.name} width={400} height={300} className="object-cover h-28 w-full" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeDocument(idx)}
                      className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-rose-600 hover:bg-white"
                      aria-label="Remove document"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                By submitting, you agree to our <span className="text-indigo-600">terms</span>.
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-5 py-2 rounded-xl"
              >
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Submit Vendor Request
                  </>
                )}
              </button>
            </div>

            {/* success */}
            {successMessage && (
              <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2">
                {successMessage}
              </div>
            )}
          </motion.form>
        </motion.div>
      )}
      
      
      



      <section className="relative py-24">
        {/* glow background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/10 via-white to-orange-200/30 blur-3xl" />

        <div className="relative max-w-6xl mx-auto text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-14"
          >
            <div className="flex justify-center mb-3">
              <Sparkles className="text-orange-500" size={36} />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
              Exclusive Benefits for Our New Vendor
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start selling on our platform and enjoy all these features.
            </p>
          </motion.div>

          {/* Benefit cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {benefits.map(({ icon: Icon, title, description, link }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative bg-white/80 backdrop-blur-sm border border-orange-100 shadow-md hover:shadow-2xl hover:-translate-y-2 rounded-3xl p-6 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 bg-gradient-to-bl from-orange-100 via-transparent to-transparent rounded-tl-3xl h-20 w-20 opacity-70" />
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-orange-100 group-hover:bg-orange-200 rounded-full text-orange-600 transition">
                    <Icon size={32} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }} className="max-w-6xl mx-auto mb-8 bg-white rounded-2xl shadow p-6 border">
            <h3 className="text-lg font-semibold text-gray-800">Frequently Asked Questions</h3>
            <p className="text-sm text-gray-500 mt-2">Quick answers to common seller questions.</p>

            <div className="mt-4 space-y-3">
              {faqs.map((f, idx) => (
                <FAQItem key={f.q} q={f.q} a={f.a} index={idx} />
              ))}
            </div>
          </motion.div>
    </div>
  );
}


/* -------------------------
   FAQ accordion component
   ------------------------- */
function FAQItem({ q, a, index = 0 }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.05 }} className="border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        className="w-full px-4 py-3 flex items-center justify-between text-left bg-white hover:bg-gray-50"
      >
        <div>
          <div className="text-sm font-medium text-gray-800">{q}</div>
          <div className="text-xs text-gray-500 mt-1 hidden md:block">Click to expand</div>
        </div>
        <div className="text-orange-500">{open ? <X /> : <Check />}</div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} className="px-4 py-3 bg-gray-50 text-sm text-gray-700">
            {a}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


