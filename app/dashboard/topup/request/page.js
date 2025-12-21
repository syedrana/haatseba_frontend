// "use client";

// import axios from "axios";
// import { Loader2, UploadCloud, X } from "lucide-react";
// import { useState } from "react";
// import toast from "react-hot-toast";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

// export default function TopUpRequestForm() {
//   const [amount, setAmount] = useState("");
//   const [method, setMethod] = useState("");
//   const [reference, setReference] = useState("");
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   /* -------------------------
//      Image handlers
//   ------------------------- */
//   const handleImage = (file) => {
//     if (!file || !file.type.startsWith("image/")) {
//       toast.error("Only image files allowed");
//       return;
//     }

//     setImage(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     handleImage(e.dataTransfer.files[0]);
//   };

//   const resetImage = () => {
//     setImage(null);
//     setPreview(null);
//   };

//   /* -------------------------
//      Submit
//   ------------------------- */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!amount || amount <= 0)
//       return toast.error("Enter a valid amount");
//     if (!method) return toast.error("Select payment method");
//     if (!reference) return toast.error("Enter transaction reference");
//     if (!image) return toast.error("Upload payment screenshot");

//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("amount", amount);
//       formData.append("method", method);
//       formData.append("reference", reference);
//       formData.append("proof", image);

//       const res = await axios.post(
//         `${API_BASE}/createtopuprequest`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       toast.success("Top-up request submitted");
//       setAmount("");
//       setMethod("");
//       setReference("");
//       resetImage();
//     } catch (err) {
//       const msg =
//         err.response?.data?.message || "Top-up request failed";
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
//       <h2 className="text-2xl font-bold mb-6 text-center">
//         Wallet Top-Up Request
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Amount */}
//         <FloatingInput
//           label="Amount"
//           type="number"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//         />

//         {/* Payment Method */}
//         <FloatingSelect
//           label="Payment Method"
//           value={method}
//           onChange={(e) => setMethod(e.target.value)}
//           options={[
//             { value: "bkash", label: "bKash" },
//             { value: "nagad", label: "Nagad" },
//             { value: "rocket", label: "Rocket" },
//             { value: "bank", label: "Bank Transfer" },
//           ]}
//         />

//         {/* Reference */}
//         <FloatingInput
//           label="Transaction Reference"
//           value={reference}
//           onChange={(e) => setReference(e.target.value)}
//         />

//         {/* Image Upload */}
//         <div>
//           <label className="block text-sm font-medium mb-2">
//             Payment Screenshot
//           </label>

//           {!preview ? (
//             <div
//               onDrop={handleDrop}
//               onDragOver={(e) => e.preventDefault()}
//               className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 transition"
//             >
//               <input
//                 type="file"
//                 accept="image/*"
//                 hidden
//                 id="proof"
//                 onChange={(e) => handleImage(e.target.files[0])}
//               />
//               <label htmlFor="proof" className="cursor-pointer">
//                 <UploadCloud className="mx-auto mb-2 text-gray-500" />
//                 <p className="text-sm text-gray-600">
//                   Drag & drop or click to upload
//                 </p>
//               </label>
//             </div>
//           ) : (
//             <div className="relative rounded-xl overflow-hidden border">
//               <img
//                 src={preview}
//                 alt="Preview"
//                 className="w-full h-56 object-cover"
//               />
//               <button
//                 type="button"
//                 onClick={resetImage}
//                 className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Submit */}
//         <button
//           disabled={loading}
//           className={`w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2
//             ${
//               loading
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-indigo-600 hover:bg-indigo-700"
//             }
//           `}
//         >
//           {loading && <Loader2 className="animate-spin" size={18} />}
//           Submit Top-Up Request
//         </button>
//       </form>
//     </div>
//   );
// }

// /* -------------------------
//    Floating Inputs
// ------------------------- */

// function FloatingInput({ label, ...props }) {
//   return (
//     <div className="relative">
//       <input
//         {...props}
//         placeholder=" "
//         className="peer w-full border rounded-xl px-4 pt-5 pb-2 outline-none focus:border-indigo-600"
//       />
//       <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all
//         peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
//         peer-focus:top-3 peer-focus:text-sm peer-focus:text-indigo-600">
//         {label}
//       </label>
//     </div>
//   );
// }

// function FloatingSelect({ label, options, ...props }) {
//   return (
//     <div className="relative">
//       <select
//         {...props}
//         className="peer w-full border rounded-xl px-4 pt-5 pb-2 bg-white outline-none focus:border-indigo-600"
//       >
//         <option value="" disabled hidden />
//         {options.map((o) => (
//           <option key={o.value} value={o.value}>
//             {o.label}
//           </option>
//         ))}
//       </select>
//       <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all
//         peer-focus:text-indigo-600">
//         {label}
//       </label>
//     </div>
//   );
// }













"use client";

import axios from "axios";
import { Image as ImageIcon, UploadCloud } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

/* -------------------------
   Floating Input Component
------------------------- */
function FloatingInput({ label, value, onChange, type = "text" }) {
  return (
    <div className="relative w-full">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="peer block w-full rounded-xl border px-3 pt-5 pb-2 text-sm bg-transparent h-14 focus:outline-none focus:ring-2"
      />
      <label
        className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-gray-500 text-sm transition-all
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:-translate-y-1/2
      peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-indigo-600"
      >
        {label}
      </label>
    </div>
  );
}

/* -------------------------
   Floating Select Component
------------------------- */
function FloatingSelect({ label, value, onChange, options }) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={onChange}
        className="peer block w-full rounded-xl border px-3 pt-5 pb-2 text-sm bg-white h-14 focus:outline-none focus:ring-2"
      >
        {/* Placeholder option */}
        <option value="" disabled hidden></option>

        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <label
        className={`absolute left-3 text-gray-500 text-sm transition-all bg-white px-1
        ${!value ? "top-1/2 -translate-y-1/2 text-gray-400 text-sm" : "top-0 -translate-y-1/2 text-indigo-600 text-xs"}
        peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-indigo-600`}
      >
        {label}
      </label>
    </div>
  );
}


/* -------------------------
   Main Page
------------------------- */
export default function TopUpRequestPage() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [reference, setReference] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* -------------------------
     Image handlers
  ------------------------- */
  const handleImage = (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) {
      handleImage(e.dataTransfer.files[0]);
    }
  };

  /* -------------------------
     Submit
  ------------------------- */
  const handleSubmit = async () => {
    if (!amount || !method || !reference || !image) {
      return toast.error("All fields are required");
    }

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("method", method);
    formData.append("reference", reference);
    formData.append("proof", image);

    try {
      setLoading(true);

      await axios.post(`${API_BASE}/createtopuprequest`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Top-up request submitted");
      setAmount("");
      setMethod("");
      setReference("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Wallet Top-Up Request
        </h2>
        <div className="p-4 mb-6 rounded-lg bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm">
            <p>
            Please <strong>Send Money</strong> your <strong>Top Up</strong> to the following official <strong>Personal BKash/Nagad/Rocket</strong> account:
            </p>
            <p className="text-lg font-semibold mt-1">📱 01304245543</p>
            <p className="mt-1 text-gray-600">
            After pay, enter your <strong>Transaction ID</strong> below.
            </p>
        </div>

        <FloatingInput
          label="Transaction Reference"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />

        <FloatingInput
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <FloatingSelect
          label="Payment Method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          options={[
            { value: "bkash", label: "bKash" },
            { value: "nagad", label: "Nagad" },
            { value: "rocket", label: "Rocket" },
            { value: "bank", label: "Bank Transfer" },
          ]}
        />

        {/* Image Upload */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center
                     hover:border-indigo-500 transition cursor-pointer"
          onClick={() => document.getElementById("proof").click()}
        >
          <input
            type="file"
            id="proof"
            hidden
            accept="image/*"
            onChange={(e) => handleImage(e.target.files[0])}
          />

          {!preview ? (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <UploadCloud size={32} />
              <span className="text-sm">
                Drag & drop screenshot or click to upload
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon size={24} className="text-indigo-600" />
              <img
                src={preview}
                alt="preview"
                className="max-h-40 rounded-lg"
              />
            </div>
          )}
        </div>

        <button
          disabled={loading}
          onClick={handleSubmit}
          className={`w-full py-3 rounded-xl font-semibold text-white
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
        >
          {loading ? "Submitting..." : "Submit Top-Up Request"}
        </button>
      </div>
    </div>
  );
}
