// "use client";

// import axios from "axios";
// import { useEffect, useRef, useState } from "react";

// export default function VendorAddProductPage() {
//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     costPrice: "",
//     discount: 0,
//     stock: "",
//     category: null,
//     brand: null,
//   });

//   const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // 🔍 Search states
//   const [catQuery, setCatQuery] = useState("");
//   const [brandQuery, setBrandQuery] = useState("");
//   const [catResults, setCatResults] = useState([]);
//   const [brandResults, setBrandResults] = useState([]);

//   const catBox = useRef(null);
//   const brandBox = useRef(null);

//   // 🔍 Category search (NO preload)
//   useEffect(() => {
//     if (!catQuery.trim()) {
//       setCatResults([]);
//       return;
//     }
//     const t = setTimeout(async () => {
//       const res = await axios.get(`${API_BASE}/allcategorie?q=${catQuery}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCatResults(res.data.categories || []);
//     }, 300);
//     return () => clearTimeout(t);
//   }, [API_BASE, catQuery, token]);

//   // 🔍 Brand search (NO preload)
//   useEffect(() => {
//     if (!brandQuery.trim()) {
//       setBrandResults([]);
//       return;
//     }
//     const t = setTimeout(async () => {
//       const res = await axios.get(`${API_BASE}/allbrands?q=${brandQuery}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBrandResults(res.data.brands || []);
//     }, 300);
//     return () => clearTimeout(t);
//   }, [API_BASE, brandQuery, token]);

//   const submit = async () => {
//     setLoading(true);
//     const fd = new FormData();
//     Object.entries(form).forEach(([k, v]) => {
//       if (v && typeof v === "object") fd.append(k, v._id);
//       else fd.append(k, v);
//     });
//     fd.append("image", image);

//     await axios.post(`${API_BASE}/vendoraddproduct`, fd, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     setLoading(false);
//     alert("Product submitted for approval");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6 text-white">
//       <div className="max-w-5xl mx-auto bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
//         <h1 className="text-3xl font-bold mb-8">➕ Add New Product</h1>

//         {/* BASIC INFO */}
//         <div className="grid md:grid-cols-2 gap-6">
//           <input className="input" placeholder="Product Name" onChange={e => setForm({ ...form, name: e.target.value })} />
//           <input className="input" type="number" placeholder="Price" onChange={e => setForm({ ...form, price: e.target.value })} />
//           <input className="input" type="number" placeholder="Cost Price" onChange={e => setForm({ ...form, costPrice: e.target.value })} />
//           <input className="input" type="number" placeholder="Stock" onChange={e => setForm({ ...form, stock: e.target.value })} />
//         </div>

//         <textarea className="input mt-6 h-32" placeholder="Product Description" onChange={e => setForm({ ...form, description: e.target.value })} />

//         {/* CATEGORY SEARCH */}
//         <div className="relative mt-6" ref={catBox}>
//           <input
//             className="input"
//             placeholder={form.category ? form.category.name : "Search Category"}
//             value={catQuery}
//             onChange={e => setCatQuery(e.target.value)}
//           />
//           {catResults.length > 0 && (
//             <div className="absolute z-20 w-full bg-gray-800 rounded-xl mt-2 max-h-56 overflow-auto">
//               {catResults.map(c => (
//                 <div
//                   key={c._id}
//                   onClick={() => {
//                     setForm({ ...form, category: c });
//                     setCatQuery("");
//                     setCatResults([]);
//                   }}
//                   className="px-4 py-2 hover:bg-indigo-600 cursor-pointer"
//                 >
//                   {c.name}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* BRAND SEARCH */}
//         <div className="relative mt-6" ref={brandBox}>
//           <input
//             className="input"
//             placeholder={form.brand ? form.brand.name : "Search Brand"}
//             value={brandQuery}
//             onChange={e => setBrandQuery(e.target.value)}
//           />
//           {brandResults.length > 0 && (
//             <div className="absolute z-20 w-full bg-gray-800 rounded-xl mt-2 max-h-56 overflow-auto">
//               {brandResults.map(b => (
//                 <div
//                   key={b._id}
//                   onClick={() => {
//                     setForm({ ...form, brand: b });
//                     setBrandQuery("");
//                     setBrandResults([]);
//                   }}
//                   className="px-4 py-2 hover:bg-indigo-600 cursor-pointer"
//                 >
//                   {b.name}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* IMAGE */}
//         <input type="file" className="mt-6" onChange={e => setImage(e.target.files[0])} />

//         <button
//           disabled={loading}
//           onClick={submit}
//           className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-semibold"
//         >
//           {loading ? "Submitting..." : "Submit Product"}
//         </button>
//       </div>

//       {/* Tailwind helper */}
//       <style jsx>{`
//         .input {
//           width: 100%;
//           padding: 12px 14px;
//           border-radius: 14px;
//           background: #111827;
//           border: 1px solid #1f2937;
//         }
//         .input:focus {
//           outline: none;
//           border-color: #6366f1;
//         }
//       `}</style>
//     </div>
//   );
// }










"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function VendorAddProductPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    costPrice: "",
    discount: 0,
    stock: "",
    category: null,
    brand: null,
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ validation & toast
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  // 🔍 Search states
  const [catQuery, setCatQuery] = useState("");
  const [brandQuery, setBrandQuery] = useState("");
  const [catResults, setCatResults] = useState([]);
  const [brandResults, setBrandResults] = useState([]);

  const catBox = useRef(null);
  const brandBox = useRef(null);

  // 🔍 Category search (NO preload)
  useEffect(() => {
    if (!catQuery.trim()) {
      setCatResults([]);
      return;
    }
    const t = setTimeout(async () => {
      const res = await axios.get(`${API_BASE}/allcategories?q=${catQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCatResults(res.data.categories || []);
    }, 300);
    return () => clearTimeout(t);
  }, [API_BASE, catQuery, token]);

  // 🔍 Brand search (NO preload)
  useEffect(() => {
    if (!brandQuery.trim()) {
      setBrandResults([]);
      return;
    }
    const t = setTimeout(async () => {
      const res = await axios.get(`${API_BASE}/allbrands?q=${brandQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBrandResults(res.data.brands || []);
    }, 300);
    return () => clearTimeout(t);
  }, [API_BASE, brandQuery, token]);

  // 🧠 Field validation
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.price) e.price = "Price is required";
    if (!form.costPrice) e.costPrice = "Cost price is required";
    if (!form.stock) e.stock = "Stock is required";
    if (!form.description || form.description.length < 10) e.description = "Description minimum 10 characters";
    if (!form.category) e.category = "Category is required";
    if (!form.brand) e.brand = "Brand is required";
    if (!image) e.image = "Product image is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) {
      setToast({ type: "error", msg: "Please fix validation errors" });
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v && typeof v === "object") fd.append(k, v._id);
        else fd.append(k, v);
      });
      fd.append("image", image);

      await axios.post(`${API_BASE}/vendoraddproduct`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setToast({ type: "success", msg: "Product submitted for admin approval" });
      setForm({ name: "", description: "", price: "", costPrice: "", discount: 0, stock: "", category: null, brand: null });
      setImage(null);
      setPreview(null);
      setErrors({});
    } catch (err) {
      setToast({ type: "error", msg: err.response?.data?.message || "Submission failed" });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:p-10">
      {/* 🔔 Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">➕ Add New Product</h1>

        {/* BASIC INFO */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <input className="input" placeholder="Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            {errors.name && <p className="err">{errors.name}</p>}
          </div>
          <div>
            <input className="input" type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            {errors.price && <p className="err">{errors.price}</p>}
          </div>
          <div>
            <input className="input" type="number" placeholder="Cost Price" value={form.costPrice} onChange={e => setForm({ ...form, costPrice: e.target.value })} />
            {errors.costPrice && <p className="err">{errors.costPrice}</p>}
          </div>
          <div>
            <input className="input" type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
            {errors.stock && <p className="err">{errors.stock}</p>}
          </div>
        </div>

        <div className="mt-4">
          <textarea className="input h-28" placeholder="Product Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          {errors.description && <p className="err">{errors.description}</p>}
        </div>

        {/* CATEGORY */}
        <div className="relative mt-4">
          <input className="input" placeholder={form.category ? form.category.name : "Search Category"} value={catQuery} onChange={e => setCatQuery(e.target.value)} />
          {errors.category && <p className="err">{errors.category}</p>}
          {catResults.length > 0 && (
            <div className="absolute z-20 w-full bg-white border rounded-xl mt-1 max-h-52 overflow-auto">
              {catResults.map(c => (
                <div key={c._id} onClick={() => { setForm({ ...form, category: c }); setCatQuery(""); setCatResults([]); }} className="option">{c.name}</div>
              ))}
            </div>
          )}
        </div>

        {/* BRAND */}
        <div className="relative mt-4">
          <input className="input" placeholder={form.brand ? form.brand.name : "Search Brand"} value={brandQuery} onChange={e => setBrandQuery(e.target.value)} />
          {errors.brand && <p className="err">{errors.brand}</p>}
          {brandResults.length > 0 && (
            <div className="absolute z-20 w-full bg-white border rounded-xl mt-1 max-h-52 overflow-auto">
              {brandResults.map(b => (
                <div key={b._id} onClick={() => { setForm({ ...form, brand: b }); setBrandQuery(""); setBrandResults([]); }} className="option">{b.name}</div>
              ))}
            </div>
          )}
        </div>

        {/* IMAGE */}
        {/* <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Product Image</label>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="btn">
              Choose Image
              <input type="file" hidden accept="image/*" onChange={e => { const f = e.target.files[0]; setImage(f); setPreview(URL.createObjectURL(f)); }} />
            </label>
            <div className="w-20 w-20 object-cover rounded-xl border">
              {preview && <Image src={preview} alt="Product Image" fill />}
            </div>
          </div>
          {errors.image && <p className="err">{errors.image}</p>}
        </div> */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Product Image</label>

          <div className="flex items-center gap-4 flex-wrap">
            <label className="btn">
              Choose Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }}
              />
            </label>

            {preview && (
              <div className="relative h-30 w-30 rounded-xl border overflow-hidden">
                <Image
                  src={preview}
                  alt="Product Preview"
                  className="h-full w-full object-cover"
                  fill
                />
              </div>
            )}
          </div>

          {errors.image && <p className="err">{errors.image}</p>}
        </div>


        <button disabled={loading} onClick={submit} className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold">
          {loading ? "Submitting..." : "Submit Product"}
        </button>
      </div>

      <style jsx>{`
        .input { width: 100%; padding: 12px 14px; border-radius: 14px; border: 1px solid #e5e7eb; }
        .input:focus { outline: none; border-color: #6366f1; }
        .err { color: #dc2626; font-size: 12px; margin-top: 4px; }
        .option { padding: 8px 12px; cursor: pointer; }
        .option:hover { background: #eef2ff; }
        .btn { background: #4f46e5; color: white; padding: 8px 14px; border-radius: 12px; cursor: pointer; }
      `}</style>
    </div>
  );
}
