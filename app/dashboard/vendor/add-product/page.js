// "use client";

// import { Button } from "@/components/ui/button";
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/components/ui/use-toast";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import * as z from "zod";


// // 🧾 Validation Schema (Zod)
// const formSchema = z.object({
//   name: z.string().min(3, "Name must be at least 3 characters"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   price: z.number().min(0, "Price cannot be negative"),
//   costPrice: z.number().min(0, "Cost cannot be negative"),
//   discount: z.number().min(0).max(100),
//   category: z.string().min(1, "Category is required"),
//   brand: z.string().min(1, "Brand is required"),
//   stock: z.number().min(1, "Stock is required"),
//   image: z.any(),
// });

// export default function VendorAddProductPage() {
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { toast } = useToast();

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       description: "",
//       price: 0,
//       costPrice: 0,
//       discount: 0,
//       category: "",
//       brand: "",
//       stock: 0,
//       image: null,
//     },
//   });

//   // 🧠 Category & Brand fetch
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [catRes, brandRes] = await Promise.all([
//           axios.get("/allcategories"),
//           axios.get("/api/brand"),
//         ]);
//         setCategories(catRes.data?.categories || []);
//         setBrands(brandRes.data?.brands || []);
//       } catch (error) {
//         console.error("Failed to fetch:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   // 🪄 Submit Handler
//   const onSubmit = async (data) => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       Object.keys(data).forEach((key) => {
//         if (key === "image") {
//           formData.append("image", data.image[0]);
//         } else {
//           formData.append(key, data[key]);
//         }
//       });

//       const res = await axios.post("/api/vendor/product", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       toast({
//         title: "✅ Product Submitted",
//         description: "Waiting for admin approval.",
//       });

//       form.reset();
//     } catch (err) {
//       toast({
//         title: "❌ Error",
//         description: err.response?.data?.message || "Failed to submit product",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       className="max-w-3xl mx-auto p-6"
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//     >
//       <Card className="shadow-xl border-t-4 border-indigo-500 rounded-2xl">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-indigo-700">
//             🛍️ Add New Product
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
//             {/* Product Name */}
//             <div className="relative">
//               <Input
//                 placeholder=" "
//                 {...form.register("name")}
//                 className="peer"
//               />
//               <Label className="absolute text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base top-[-10px] left-2 bg-white px-1">
//                 Product Name
//               </Label>
//             </div>

//             {/* Description */}
//             <div className="relative">
//               <Textarea
//                 placeholder=" "
//                 {...form.register("description")}
//                 rows={4}
//                 className="peer"
//               />
//               <Label className="absolute text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base top-[-10px] left-2 bg-white px-1">
//                 Description
//               </Label>
//             </div>

//             {/* Price, Cost, Discount */}
//             <div className="grid grid-cols-3 gap-4">
//               <div>
//                 <Label>Price</Label>
//                 <Input type="number" {...form.register("price", { valueAsNumber: true })} />
//               </div>
//               <div>
//                 <Label>Cost Price</Label>
//                 <Input type="number" {...form.register("costPrice", { valueAsNumber: true })} />
//               </div>
//               <div>
//                 <Label>Discount (%)</Label>
//                 <Input type="number" {...form.register("discount", { valueAsNumber: true })} />
//               </div>
//             </div>

//             {/* Category */}
//             <div>
//               <Label>Category</Label>
//               <Select onValueChange={(val) => form.setValue("category", val)}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {categories.map((cat) => (
//                     <SelectItem key={cat._id} value={cat._id}>
//                       {cat.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Brand */}
//             <div>
//               <Label>Brand</Label>
//               <Select onValueChange={(val) => form.setValue("brand", val)}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select brand" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {brands.map((b) => (
//                     <SelectItem key={b._id} value={b._id}>
//                       {b.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Stock */}
//             <div>
//               <Label>Stock Quantity</Label>
//               <Input type="number" {...form.register("stock", { valueAsNumber: true })} />
//             </div>

//             {/* Image Upload */}
//             <div>
//               <Label>Product Image</Label>
//               <Input type="file" accept="image/*" {...form.register("image")} />
//             </div>

//             {/* Submit */}
//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
//             >
//               {loading ? "Submitting..." : "Submit Product"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }









// "use client";

// import { Button } from "@/components/ui/button";
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/components/ui/use-toast";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import * as z from "zod";

// // ✅ Validation Schema
// const formSchema = z.object({
//   name: z.string().min(3, "Product name must be at least 3 characters"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   price: z.coerce.number().min(0, "Price must be positive"),
//   costPrice: z.coerce.number().min(0, "Cost price must be positive"),
//   discount: z.coerce.number().min(0).max(100, "Discount must be between 0 and 100"),
//   category: z.string().min(1, "Please select a category"),
//   brand: z.string().min(1, "Please select a brand"),
//   stock: z.coerce.number().min(1, "Stock quantity is required"),
//   image: z.any().refine((files) => files?.length === 1, "Product image is required"),
// });

// export default function VendorAddProductPage() {
//   const { toast } = useToast();
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       description: "",
//       price: "",
//       costPrice: "",
//       discount: "",
//       category: "",
//       brand: "",
//       stock: "",
//       image: null,
//     },
//   });

//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;


//   // 🔄 Fetch Category & Brand
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [catRes, brandRes] = await Promise.all([
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/allcategories`,{
//             headers: {  
//                 Authorization: `Bearer ${token}`
//             },
//           }),
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/allbrands`,{
//             headers: {  
//                 Authorization: `Bearer ${token}`
//             },
//           }),
//         ]);
//         setCategories(catRes.data?.categories || []);
//         setBrands(brandRes.data?.brands || []);
//       } catch (err) {
//         console.error("❌ Fetch error:", err);
//       }
//     };
//     fetchData();
//   }, []);

//   // 🖼️ Image Preview
//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       form.setValue("image", e.target.files);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   // 🪄 Submit Handler
//   const onSubmit = async (data) => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       Object.entries(data).forEach(([key, value]) => {
//         if (key === "image") {
//           formData.append("image", value[0]);
//         } else {
//           formData.append(key, value);
//         }
//       });

//       const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/vendoraddproduct`, formData, {
//         headers: { 
//             "Content-Type": "multipart/form-data", 
//             Authorization: `Bearer ${token}`
//         },
//       });

//       toast({
//         title: "✅ Product Submitted",
//         description: "Waiting for admin approval.",
//       });

//       form.reset();
//       setPreview(null);
//     } catch (err) {
//       toast({
//         title: "❌ Error",
//         description: err.response?.data?.message || "Failed to submit product",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       className="max-w-3xl mx-auto p-6"
//       initial={{ opacity: 0, y: 40 }}
//       animate={{ opacity: 1, y: 0 }}
//     >
//       <Card className="shadow-2xl border-t-4 border-indigo-500 rounded-2xl">
//         <CardHeader>
//           <CardTitle className="text-3xl font-bold text-indigo-700">
//             🛍️ Add New Product
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             {/* Floating Inputs */}
//             {[
//               { name: "name", label: "Product Name" },
//               { name: "description", label: "Description", textarea: true },
//             ].map(({ name, label, textarea }) => (
//               <div key={name} className="relative">
//                 {textarea ? (
//                   <Textarea
//                     placeholder=" "
//                     rows={4}
//                     {...form.register(name)}
//                     className="peer"
//                   />
//                 ) : (
//                   <Input placeholder=" " {...form.register(name)} className="peer" />
//                 )}
//                 <Label className="absolute left-2 bg-white px-1 top-[-10px] text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base">
//                   {label}
//                 </Label>
//                 {form.formState.errors[name] && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {form.formState.errors[name].message}
//                   </p>
//                 )}
//               </div>
//             ))}

//             {/* Price Fields */}
//             <div className="grid grid-cols-3 gap-4">
//               {[
//                 { name: "price", label: "Price (৳)" },
//                 { name: "costPrice", label: "Cost Price (৳)" },
//                 { name: "discount", label: "Discount (%)" },
//               ].map(({ name, label }) => (
//                 <div key={name}>
//                   <Label>{label}</Label>
//                   <Input type="number" {...form.register(name)} />
//                   {form.formState.errors[name] && (
//                     <p className="text-red-500 text-xs">
//                       {form.formState.errors[name].message}
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Category */}
//             <div>
//               <Label>Category</Label>
//               <Select onValueChange={(val) => form.setValue("category", val)}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {categories.map((cat) => (
//                     <SelectItem key={cat._id} value={cat._id}>
//                       {cat.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {form.formState.errors.category && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {form.formState.errors.category.message}
//                 </p>
//               )}
//             </div>

//             {/* Brand */}
//             <div>
//               <Label>Brand</Label>
//               <Select onValueChange={(val) => form.setValue("brand", val)}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select brand" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {brands.map((b) => (
//                     <SelectItem key={b._id} value={b._id}>
//                       {b.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {form.formState.errors.brand && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {form.formState.errors.brand.message}
//                 </p>
//               )}
//             </div>

//             {/* Stock */}
//             <div>
//               <Label>Stock Quantity</Label>
//               <Input type="number" {...form.register("stock")} />
//               {form.formState.errors.stock && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {form.formState.errors.stock.message}
//                 </p>
//               )}
//             </div>

//             {/* Image Upload */}
//             <div>
//               <Label>Product Image</Label>
//               <Input type="file" accept="image/*" onChange={handleImageChange} />
//               {preview && (
//                 <Image
//                   src={preview}
//                   alt="preview"
//                   width={400} 
//                   height={300}
//                   className="w-32 h-32 object-cover mt-3 rounded-lg border"
//                 />
//               )}
//               {form.formState.errors.image && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {form.formState.errors.image.message}
//                 </p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700"
//             >
//               {loading ? "Submitting..." : "Submit Product"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }













"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

// ✅ Validation Schema
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price cannot be negative"),
  costPrice: z.number().min(0, "Cost price cannot be negative"),
  discount: z.number().min(0).max(100),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  stock: z.number().min(1, "Stock is required"),
  image: z.any().refine((files) => files?.length > 0, "Image is required"),
});

export default function VendorAddProductPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      costPrice: 0,
      discount: 0,
      category: "",
      brand: "",
      stock: 0,
      image: null,
    },
  });

  // 🔄 Fetch Categories & Brands
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return console.error("⚠️ No token found.");
      try {
        const [catRes, brandRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/allcategories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/allbrands`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCategories(catRes.data?.categories || catRes.data?.data || []);
        setBrands(brandRes.data?.brands || brandRes.data?.data || []);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      }
    };
    fetchData();
  }, [token]);

  // 🖼️ Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", e.target.files, { shouldValidate: true });
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🚀 Submit Handler
  const onSubmit = async (data) => {
    if (!token) return toast({ title: "❌ Error", description: "User not authenticated." });

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "image") formData.append("image", value[0]);
        else formData.append(key, value);
      });

      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/vendoraddproduct`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "✅ Product Submitted",
        description: "Waiting for admin approval.",
      });

      form.reset();
      setPreview(null);
    } catch (err) {
      toast({
        title: "❌ Error",
        description: err.response?.data?.message || "Failed to submit product.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="shadow-2xl border-t-4 border-indigo-600 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-indigo-700">
            🛍️ Add New Product
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Floating Input Fields */}
            <div className="relative">
              <Input placeholder=" " {...form.register("name")} className="peer" />
              <Label className="floating-label">Product Name</Label>
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="relative">
              <Textarea placeholder=" " {...form.register("description")} rows={4} className="peer" />
              <Label className="floating-label">Description</Label>
              {form.formState.errors.description && (
                <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>
              )}
            </div>

            {/* Price Section */}
            <div className="grid grid-cols-3 gap-4">
              <div className="relative">
                <Input type="number" {...form.register("price", { valueAsNumber: true })} className="peer" />
                <Label className="floating-label">Price</Label>
              </div>

              <div className="relative">
                <Input type="number" {...form.register("costPrice", { valueAsNumber: true })} className="peer" />
                <Label className="floating-label">Cost Price</Label>
              </div>

              <div className="relative">
                <Input type="number" {...form.register("discount", { valueAsNumber: true })} className="peer" />
                <Label className="floating-label">Discount (%)</Label>
              </div>
            </div>

            {/* Category */}
            <div>
              <Label>Category</Label>
              <Select onValueChange={(val) => form.setValue("category", val, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-red-500 text-sm">{form.formState.errors.category.message}</p>
              )}
            </div>

            {/* Brand */}
            <div>
              <Label>Brand</Label>
              <Select onValueChange={(val) => form.setValue("brand", val, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.brand && (
                <p className="text-red-500 text-sm">{form.formState.errors.brand.message}</p>
              )}
            </div>

            {/* Stock */}
            <div className="relative">
              <Input type="number" {...form.register("stock", { valueAsNumber: true })} className="peer" />
              <Label className="floating-label">Stock Quantity</Label>
            </div>

            {/* Image Upload + Preview */}
            <div>
              <Label>Product Image</Label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {preview && (
                <Image src={preview} width={400} height={300} alt="Preview" className="mt-3 w-40 h-40 object-cover rounded-lg shadow-md" />
              )}
            </div>

            {/* Submit */}
            <Button type="submit" disabled={loading} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">
              {loading ? "Submitting..." : "Submit Product"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Floating Label CSS */}
      <style jsx>{`
        .floating-label {
          position: absolute;
          top: -10px;
          left: 10px;
          background: white;
          padding: 0 4px;
          color: #6b7280;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }
        .peer::placeholder-shown + .floating-label {
          top: 10px;
          font-size: 1rem;
          color: #9ca3af;
        }
      `}</style>
    </motion.div>
  );
}
