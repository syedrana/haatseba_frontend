// "use client";

// import axios from "axios";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function ProductRegistrationForm() {
//   const searchParams = useSearchParams();

//   // Auto-filled from Agent Stock Page
//   const registrationType = searchParams.get("registrationType");
//   const productId = searchParams.get("productId");
//   const agentId = searchParams.get("agentId");
//   const joiningQuantity = searchParams.get("joiningQuantity");

//   const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "",
//     address: "",
//     referralCode: "",
//     placementPosition: "",
//     nomineeFirst: "",
//     nomineeLast: "",
//     nomineeRelation: "",
//     nomineePhone: "",
//     nomineeAddress: "",
//   });

//   const [imagePreview, setImagePreview] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [product, setProduct] = useState(null);

//   // 🔥 Load selected product details
//   useEffect(() => {
//     if (!productId) return;

//     const load = async () => {
//       try {
//         const res = await axios.get(`${API_BASE}/singleproduct/${productId}`);
//         setProduct(res.data);
//       } catch (err) {
//         console.error("Product load failed:", err);
//       }
//     };

//     load();
//   }, [API_BASE, productId]);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleImage = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!imageFile) return alert("Image required!");

//     setLoading(true);

//     try {
//       const token =
//         typeof window !== "undefined"
//           ? localStorage.getItem("token")
//           : null;

//       const fd = new FormData();
//       Object.keys(form).forEach((key) => fd.append(key, form[key]));

//       fd.append("registrationType", registrationType);
//       fd.append("productId", productId);
//       fd.append("agentId", agentId);
//       fd.append("joiningQuantity", joiningQuantity);

//       fd.append(
//         "nominee",
//         JSON.stringify({
//           firstName: form.nomineeFirst,
//           lastName: form.nomineeLast,
//           relation: form.nomineeRelation,
//           phone: form.nomineePhone,
//           address: form.nomineeAddress,
//         })
//       );

//       fd.append("image", imageFile);

//       const res = await axios.post(`${API_BASE}/registeruser`, fd, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       alert("User Registered Successfully!");
//     } catch (err) {
//       alert(err?.response?.data?.message || "Registration Failed");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-4 md:p-10">
//       {/* ⭐ Product Summary */}
//       {product && (
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6"
//         >
//           <h2 className="font-bold text-lg text-blue-700 mb-2">
//             Product Selected:
//           </h2>
//           <div className="flex items-center gap-4">
//             <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-white shadow">
//               <Image src={product.image} fill alt="Product" />
//             </div>
//             <div>
//               <p className="font-bold text-gray-800">{product.name}</p>
//               <p className="text-gray-600 text-sm">{product.description}</p>
//               <p className="text-blue-600 font-semibold">
//                 Joining Qty: {joiningQuantity}
//               </p>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {/* ⭐ Card with folding effect */}
//       <motion.div
//         initial={{ scale: 0.9, rotateX: -15, opacity: 0 }}
//         animate={{ scale: 1, rotateX: 0, opacity: 1 }}
//         className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200"
//       >
//         <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
//           Product Registration
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* --- Name --- */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
//             <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
//           </div>

//           {/* --- Email / Phone --- */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input label="Email" name="email" value={form.email} onChange={handleChange} />
//             <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
//           </div>

//           <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />

//           <Input label="Address" name="address" value={form.address} onChange={handleChange} />

//           <Input label="Referral Code (Optional)" name="referralCode" value={form.referralCode} onChange={handleChange} />

//           {/* --- Placement --- */}
//           <div>
//             <label className="text-sm font-semibold text-gray-700">Placement Position</label>
//             <select
//               name="placementPosition"
//               value={form.placementPosition}
//               onChange={handleChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             >
//               <option value="">Select Position</option>
//               <option value="line one">Line One</option>
//               <option value="line two">Line Two</option>
//               <option value="line three">Line Three</option>
//             </select>
//           </div>

//           {/* --- Nominee Section --- */}
//           <div className="pt-4 border-t">
//             <h2 className="font-bold text-lg text-gray-800">Nominee Info</h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
//               <Input label="Nominee First Name" name="nomineeFirst" value={form.nomineeFirst} onChange={handleChange} />
//               <Input label="Nominee Last Name" name="nomineeLast" value={form.nomineeLast} onChange={handleChange} />
//             </div>

//             <Input label="Nominee Relation" name="nomineeRelation" value={form.nomineeRelation} onChange={handleChange} />

//             <Input label="Nominee Phone" name="nomineePhone" value={form.nomineePhone} onChange={handleChange} />

//             <Input label="Nominee Address" name="nomineeAddress" value={form.nomineeAddress} onChange={handleChange} />
//           </div>

//           {/* --- Image Upload --- */}
//           <div>
//             <label className="text-sm font-semibold text-gray-700">User Image</label>
//             <input type="file" accept="image/*" onChange={handleImage} className="mt-2" />

//             {imagePreview && (
//               <div className="mt-3 w-28 h-28 relative rounded-lg overflow-hidden">
//                 <Image src={imagePreview} fill alt="Preview" />
//               </div>
//             )}
//           </div>

//           <button
//             disabled={loading}
//             className="w-full mt-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow"
//           >
//             {loading ? "Registering..." : "Register User"}
//           </button>
//         </form>
//       </motion.div>
//     </div>
//   );
// }

// /* ---------------------------- INPUT COMPONENT --------------------------- */
// function Input({ label, ...props }) {
//   return (
//     <div>
//       <label className="text-sm font-semibold text-gray-700">{label}</label>
//       <input
//         {...props}
//         className="w-full p-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
//       />
//     </div>
//   );
// }








"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterWizard() {
  const searchParams = useSearchParams();

  // Autofill from Sell Button
  const registrationType = searchParams.get("registrationType");
  const productId = searchParams.get("productId");
  const agentId = searchParams.get("agentId");
  const joiningQuantity = searchParams.get("joiningQuantity");

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

  const [step, setStep] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form States
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    referralCode: "",
    placementPosition: "",
    nomineeFirst: "",
    nomineeLast: "",
    nomineeRelation: "",
    nomineePhone: "",
    nomineeAddress: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* -------------------------------------------------------
      Step Animation Variants
  ------------------------------------------------------- */
  const variants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  /* -------------------------------------------------------
      Load Product Info (Auto from Sell Button)
  ------------------------------------------------------- */
  useEffect(() => {
    if (!productId) return;
    axios.get(`${API_BASE}/singleproduct/${productId}`, {headers: { Authorization: `Bearer ${token}` }},).then((res) => {
      setProduct(res.data.product);
    });
  }, [API_BASE, productId, token]);

  /* -------------------------------------------------------
      Handle Input
  ------------------------------------------------------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const f = e.target.files[0];
    setImage(f);
    setImagePreview(URL.createObjectURL(f));
  };

  /* -------------------------------------------------------
      Submit Registration
  ------------------------------------------------------- */
  const submitForm = async () => {
    if (!image) return alert("Image is required!");

    setLoading(true);

    try {
      
      const fd = new FormData();
      Object.keys(form).forEach((key) => fd.append(key, form[key]));

      fd.append("registrationType", registrationType);
      fd.append("productId", productId);
      fd.append("agentId", agentId);
      fd.append("joiningQuantity", joiningQuantity);

      fd.append(
        "nominee",
        JSON.stringify({
          firstName: form.nomineeFirst,
          lastName: form.nomineeLast,
          relation: form.nomineeRelation,
          phone: form.nomineePhone,
          address: form.nomineeAddress,
        })
      );

      fd.append("image", image);

      await axios.post(`${API_BASE}/registeruser`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("User Registered Successfully!");
      setStep(4);
    } catch (err) {
      alert(err?.response?.data?.message || "Registration Failed");
    }

    setLoading(false);
  };

  /* -------------------------------------------------------
     COMPONENT UI
  ------------------------------------------------------- */
  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* PRODUCT SUMMARY */}
      {product && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-8"
        >
          <h2 className="font-bold text-lg text-blue-700 mb-2">
            Product Selected
          </h2>

          <div className="flex items-center gap-4">
            <div className="w-24 h-24 relative rounded-xl overflow-hidden border">
              <Image src={product.image} alt="prod" fill />
            </div>

            <div>
              <p className="font-bold">{product.name}</p>
              <p className="font-bold">৳ {product.price}</p>
              <p className="text-sm text-gray-600">
                {product.description?.slice(0, 60)}...
              </p>
              <p className="text-blue-600 font-semibold">
                Joining Qty: {joiningQuantity}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* MULTI STEP CARD */}
      <div className="bg-white rounded-2xl shadow-xl border p-6">
        {/* Step Indicator */}
        <div className="flex justify-between mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
                step === s ? "bg-blue-600" : "bg-gray-400"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ---------------- STEP 1 ---------------- */}
          {step === 1 && (
            <motion.div
              key={1}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-bold mb-4">Basic Information</h2>

              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
                <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
              </div>

              <Input label="Email" name="email" value={form.email} onChange={handleChange} />
              <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
              <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />

              <button
                onClick={() => setStep(2)}
                className="w-full mt-5 bg-blue-600 text-white py-3 rounded-xl"
              >
                Next
              </button>
            </motion.div>
          )}

          {/* ---------------- STEP 2 ---------------- */}
          {step === 2 && (
            <motion.div
              key={2}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-bold mb-4">Placement & Address</h2>

              <Input label="Address" name="address" value={form.address} onChange={handleChange} />

              <div>
                <label className="font-semibold text-sm">Placement Position</label>
                <select
                  name="placementPosition"
                  value={form.placementPosition}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg mt-1"
                >
                  <option value="">Select Position</option>
                  <option value="line one">Line One</option>
                  <option value="line two">Line Two</option>
                  <option value="line three">Line Three</option>
                </select>
              </div>

              <Input
                label="Referral Code (Optional)"
                name="referralCode"
                value={form.referralCode}
                onChange={handleChange}
              />

              <button
                onClick={() => setStep(3)}
                className="w-full mt-5 bg-blue-600 text-white py-3 rounded-xl"
              >
                Next
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full mt-2 bg-gray-300 py-3 rounded-xl"
              >
                Back
              </button>
            </motion.div>
          )}

          {/* ---------------- STEP 3 ---------------- */}
          {step === 3 && (
            <motion.div
              key={3}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-bold mb-4">Nominee & Image</h2>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Nominee First" name="nomineeFirst" value={form.nomineeFirst} onChange={handleChange} />
                <Input label="Nominee Last" name="nomineeLast" value={form.nomineeLast} onChange={handleChange} />
              </div>

              <Input label="Nominee Relation" name="nomineeRelation" value={form.nomineeRelation} onChange={handleChange} />
              <Input label="Nominee Phone" name="nomineePhone" value={form.nomineePhone} onChange={handleChange} />
              <Input label="Nominee Address" name="nomineeAddress" value={form.nomineeAddress} onChange={handleChange} />

              {/* IMAGE UPLOAD */}
              <label className="font-semibold text-sm mt-3">User Image</label>
              <input type="file" accept="image/*" onChange={handleImage} className="mt-2" />

              {imagePreview && (
                <div className="mt-3 w-28 h-28 relative rounded-xl overflow-hidden border">
                  <Image src={imagePreview} alt="Preview" fill />
                </div>
              )}

              {/* Submit */}
              <button
                disabled={loading}
                onClick={submitForm}
                className="w-full mt-5 bg-green-600 text-white py-3 rounded-xl"
              >
                {loading ? "Submitting..." : "Finish Registration"}
              </button>

              <button
                onClick={() => setStep(2)}
                className="w-full mt-2 bg-gray-300 py-3 rounded-xl"
              >
                Back
              </button>
            </motion.div>
          )}

          {/* ---------------- SUCCESS PAGE ---------------- */}
          {step === 4 && (
            <motion.div
              key={4}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold text-green-600 mb-4">
                Registration Successful 🎉
              </h1>
              <p className="text-gray-600">
                The new user has been registered successfully.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   Reusable Input Component
------------------------------------------------------- */
function Input({ label, ...props }) {
  return (
    <div className="mb-3">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        {...props}
        className="w-full p-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
