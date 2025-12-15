// "use client";

// import axios from "axios";
// import { Edit2, Loader2, Plus, Trash2, XCircle } from "lucide-react";
// import Image from "next/image";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { toast } from "react-hot-toast";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// /* -----------------------------------------------
//        CUSTOM ASYNC PRODUCT SELECT COMPONENT
// ------------------------------------------------- */
// function AsyncProductSelect({ value, onChange, loadOptions, placeholder }) {
//   const [inputValue, setInputValue] = useState(value?.label || "");
//   const [options, setOptions] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [highlightIndex, setHighlightIndex] = useState(0);
//   const wrapperRef = useRef(null);
//   const debounceRef = useRef(null);

//   // Debounce search
//   const fetchOptions = (text) => {
//     clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(async () => {
//       const data = await loadOptions(text);
//       setOptions(data);
//       setOpen(true);
//       setHighlightIndex(0);
//     }, 300);
//   };

//   // Click outside to close
//   useEffect(() => {
//     const handleClick = (e) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   const handleKeyDown = (e) => {
//     if (!open) return;
//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setHighlightIndex((prev) => Math.min(prev + 1, options.length - 1));
//     }
//     if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setHighlightIndex((prev) => Math.max(prev - 0, 0));
//     }
//     if (e.key === "Enter") {
//       e.preventDefault();
//       if (options[highlightIndex]) {
//         onChange(options[highlightIndex]);
//         setOpen(false);
//       }
//     }
//     if (e.key === "Escape") {
//       setOpen(false);
//     }
//   };

//   const highlightMatch = (text) => {
//     if (!inputValue) return text;
//     const regex = new RegExp(`(${inputValue})`, "gi");
//     return text.replace(regex, "<b class='text-blue-500 dark:text-blue-400'>$1</b>");
//   };

//   return (
//     <div ref={wrapperRef} className="relative w-full">
//       <input
//         value={value?.label || inputValue}
//         onChange={(e) => {
//           setInputValue(e.target.value);
//           fetchOptions(e.target.value);
//         }}
//         onKeyDown={handleKeyDown}
//         onFocus={() => inputValue && setOpen(true)}
//         placeholder={placeholder}
//         className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
//       />

//       {open && options.length > 0 && (
//         <div className="absolute z-20 w-full max-h-60 overflow-auto mt-1 bg-white dark:bg-gray-800 border rounded shadow">
//           {options.map((opt, idx) => (
//             <div
//               key={opt.value}
//               onClick={() => {
//                 onChange(opt);
//                 setOpen(false);
//               }}
//               className={`flex items-center gap-2 p-2 cursor-pointer ${
//                 idx === highlightIndex
//                   ? "bg-blue-100 dark:bg-blue-700"
//                   : ""
//               }`}
//             >
//               {opt.image && (
//                 <Image src={opt.image} alt="" fill className="w-8 h-8 object-cover rounded" />
//               )}
//               <span
//                 dangerouslySetInnerHTML={{
//                   __html: highlightMatch(opt.label),
//                 }}
//               />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// /* -----------------------------------------------
//             MAIN CREATE / EDIT PAGE
// ------------------------------------------------- */
// export default function ManagePackagesPage() {
//   const [packageName, setPackageName] = useState("");
//   const [price, setPrice] = useState("");
//   const [products, setProducts] = useState([
//     { productId: "", productName: "", quantity: "" },
//   ]);
//   const [packages, setPackages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentToken, setCurrentToken] = useState("");
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => {
//     const t = localStorage.getItem("token");
//     if (t) setCurrentToken(t);
//   }, []);

  

//   const fetchPackages = useCallback(async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/getallpackages`, {
//         headers: { Authorization: `Bearer ${currentToken}` },
//       });
//       setPackages(res.data.packages || []);
//     } catch (err) {
//       toast.error("Failed to fetch packages");
//     }
//   },[currentToken]);

//   useEffect(() => {
//     if (currentToken) fetchPackages();
//   }, [currentToken, fetchPackages]);

//   const loadProductOptions = async (query) => {
//     if (!query || !currentToken) return [];
//     try {
//       const res = await axios.get(`${API_BASE}/searchproduct?query=${query}`, {
//         headers: { Authorization: `Bearer ${currentToken}` },
//       });
//       return (res.data.products || []).map((p) => ({
//         value: p._id,
//         label: p.name,
//         image: p.image || null,
//       }));
//     } catch (err) {
//       toast.error("Product search failed");
//       return [];
//     }
//   };

//   const addRow = () => {
//     setProducts([...products, { productId: "", productName: "", quantity: "" }]);
//   };

//   const removeRow = (index) => {
//     if (products.length === 1) return toast.error("At least 1 product required");
//     setProducts(products.filter((_, i) => i !== index));
//   };

//   const handleSelectProduct = (index, selected) => {
//     const updated = [...products];
//     updated[index].productId = selected?.value || "";
//     updated[index].productName = selected?.label || "";
//     setProducts(updated);
//   };

//   const handleRowChange = (index, field, value) => {
//     const updated = [...products];
//     updated[index][field] = value;
//     setProducts(updated);
//   };

//   const startEdit = (pkg) => {
//     setEditingId(pkg._id);
//     setPackageName(pkg.name);
//     setPrice(pkg.price);
//     setProducts(pkg.products.map(p => ({
//       productId: p.productId,
//       productName: p.name,
//       quantity: p.quantity
//     })));
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setPackageName("");
//     setPrice("");
//     setProducts([{ productId: "", productName: "", quantity: "" }]);
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this package?")) return;
//     try {
//       await axios.delete(`${API_BASE}/deletepackage/${id}`, {
//         headers: { Authorization: `Bearer ${currentToken}` },
//       });
//       toast.success("Package deleted!");
//       fetchPackages();
//     } catch (err) {
//       toast.error("Failed to delete package");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!packageName.trim()) return toast.error("Package name required");
//     if (!price || Number(price) <= 0) return toast.error("Valid price required");

//     const formattedProducts = [];
//     for (let p of products) {
//       if (!p.productId) return toast.error("Select product");
//       if (!p.quantity || Number(p.quantity) <= 0)
//         return toast.error("Quantity must be > 0");
//       formattedProducts.push({ productId: p.productId, quantity: Number(p.quantity) });
//     }

//     try {
//       setLoading(true);
//       if (editingId) {
//         await axios.put(`${API_BASE}/updatepackage/${editingId}`, {
//           name: packageName,
//           price: Number(price),
//           products: formattedProducts,
//         }, { headers: { Authorization: `Bearer ${currentToken}` }});
//         toast.success("Package updated!");
//       } else {
//         await axios.post(`${API_BASE}/createpackage`, {
//           name: packageName,
//           price: Number(price),
//           products: formattedProducts,
//         }, { headers: { Authorization: `Bearer ${currentToken}` }});
//         toast.success("Package created!");
//       }
//       cancelEdit();
//       fetchPackages();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto p-4">
//       <h2 className="text-xl font-bold mb-4 text-center">
//         {editingId ? "Edit Package" : "Create New Package"}
//       </h2>

//       {/* FORM */}
//       <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow space-y-4">
//         <div>
//           <label className="font-medium">Package Name</label>
//           <input
//             type="text"
//             value={packageName}
//             onChange={(e) => setPackageName(e.target.value)}
//             className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
//           />
//         </div>

//         <div>
//           <label className="font-medium">Price</label>
//           <input
//             type="number"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
//           />
//         </div>

//         <h3 className="font-semibold">Products</h3>

//         {products.map((row, idx) => (
//           <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-gray-50 dark:bg-gray-700 p-2 rounded">
//             <div className="col-span-7">
//               <AsyncProductSelect
//                 value={row.productId ? { value: row.productId, label: row.productName } : null}
//                 onChange={(sel) => handleSelectProduct(idx, sel)}
//                 loadOptions={loadProductOptions}
//                 placeholder="Search product..."
//               />
//             </div>
//             <input
//               type="number"
//               className="col-span-3 p-2 border rounded dark:bg-gray-600 dark:text-white dark:border-gray-500"
//               placeholder="Qty"
//               value={row.quantity}
//               onChange={(e) => handleRowChange(idx, "quantity", e.target.value)}
//             />
//             <button
//               type="button"
//               onClick={() => removeRow(idx)}
//               className="col-span-2 bg-red-500 text-white rounded flex items-center justify-center"
//             >
//               <Trash2 size={18} />
//             </button>
//           </div>
//         ))}

//         <button
//           type="button"
//           onClick={addRow}
//           className="w-full p-2 bg-blue-500 text-white rounded flex items-center justify-center gap-2"
//         >
//           <Plus size={18} /> Add Product
//         </button>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full p-3 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2"
//         >
//           {loading && <Loader2 size={20} className="animate-spin" />} {editingId ? "Update Package" : "Create Package"}
//         </button>

//         {editingId && (
//           <button
//             type="button"
//             onClick={cancelEdit}
//             className="w-full p-2 bg-gray-500 text-white rounded flex items-center justify-center gap-2"
//           >
//             <XCircle size={18} /> Cancel Edit
//           </button>
//         )}
//       </form>

//       {/* ALL PACKAGES TABLE */}
//       <h3 className="mt-8 font-bold text-lg">All Packages</h3>
//       <div className="overflow-auto mt-2">
//         <table className="w-full border-collapse border dark:border-gray-600">
//           <thead>
//             <tr className="bg-gray-200 dark:bg-gray-700">
//               <th className="p-2 border dark:border-gray-600">Name</th>
//               <th className="p-2 border dark:border-gray-600">Price</th>
//               <th className="p-2 border dark:border-gray-600">Products</th>
//               <th className="p-2 border dark:border-gray-600">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {packages.map((pkg) => (
//               <tr key={pkg._id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
//                 <td className="p-2 border dark:border-gray-600">{pkg.name}</td>
//                 <td className="p-2 border dark:border-gray-600">{pkg.price}</td>
//                 <td className="p-2 border dark:border-gray-600">
//                   {pkg.products.map(p => `${p.name} (${p.quantity})`).join(", ")}
//                 </td>
//                 <td className="p-2 border dark:border-gray-600 flex gap-2">
//                   <button
//                     onClick={() => startEdit(pkg)}
//                     className="p-1 bg-yellow-500 text-white rounded flex items-center justify-center"
//                   >
//                     <Edit2 size={16} />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(pkg._id)}
//                     className="p-1 bg-red-600 text-white rounded flex items-center justify-center"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }















// "use client";

// import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
// import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import axios from "axios";
// import { Edit2, Loader2, Move, Plus, Trash2, XCircle } from "lucide-react";
// import Image from "next/image";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { toast } from "react-hot-toast";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// /* -----------------------------
//    Async Product Select Component
// ------------------------------- */
// function AsyncProductSelect({ value, onChange, loadOptions, placeholder }) {
//   const [inputValue, setInputValue] = useState("");
//   const [options, setOptions] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [highlightIndex, setHighlightIndex] = useState(0);
//   const wrapperRef = useRef(null);
//   const debounceRef = useRef(null);

//   const fetchOptions = (text) => {
//     clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(async () => {
//       const data = await loadOptions(text);
//       setOptions(data);
//       setOpen(true);
//       setHighlightIndex(0);
//     }, 300);
//   };

//   useEffect(() => {
//     const handler = (e) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const handleKeyDown = (e) => {
//     if (!open) return;
//     if (e.key === "ArrowDown") { e.preventDefault(); setHighlightIndex(Math.min(highlightIndex + 1, options.length - 1)); }
//     if (e.key === "ArrowUp") { e.preventDefault(); setHighlightIndex(Math.max(highlightIndex - 1, 0)); }
//     if (e.key === "Enter") { e.preventDefault(); if(options[highlightIndex]) { onChange(options[highlightIndex]); setOpen(false); } }
//   };

//   const highlightText = (text) => {
//     if (!inputValue) return text;
//     const regex = new RegExp(`(${inputValue})`, "gi");
//     return text.replace(regex, "<b class='text-blue-500 dark:text-blue-400'>$1</b>");
//   };

//   return (
//     <div ref={wrapperRef} className="relative w-full">
//       <input
//         type="text"
//         value={value?.label || inputValue}
//         onChange={e => { setInputValue(e.target.value); fetchOptions(e.target.value); }}
//         onFocus={() => inputValue && setOpen(true)}
//         onKeyDown={handleKeyDown}
//         placeholder={placeholder}
//         className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
//       />
//       {open && options.length > 0 && (
//         <div className="absolute z-20 w-full max-h-60 overflow-auto rounded border bg-white dark:bg-gray-900 shadow mt-1">
//           {options.map((opt, i) => (
//             <div
//               key={opt.value}
//               className={`flex items-center gap-2 p-2 cursor-pointer ${i===highlightIndex?'bg-blue-100 dark:bg-blue-900':''}`}
//               onClick={()=>{onChange(opt); setOpen(false);}}
//             >
//               <div className="w-8 h-8 relative rounded-full overflow-hidden shadow-md dark:shadow-gray-700 transform transition-transform duration-300 hover:scale-110">
//                 {opt.image && <Image src={opt.image} alt={opt.label} fill className="w-8 h-8 rounded"/>}
//               </div>
//               <span dangerouslySetInnerHTML={{__html:highlightText(opt.label)}} className="truncate"/>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// /* -----------------------------
//    Sortable Card for DnD
// ------------------------------- */
// function SortableCard({ pkg, index, handleEdit, handleDelete, isSelected, toggleSelect }) {
//   const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: pkg._id});
//   const style = { transform: CSS.Transform.toString(transform), transition };
//   return (
//     <div ref={setNodeRef} style={style} {...attributes} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 relative">
//       <div className="absolute top-2 left-2 flex items-center gap-1">
//         <input type="checkbox" checked={isSelected} onChange={toggleSelect}/>
//         <Move size={18} {...listeners} className="cursor-grab"/>
//       </div>
//       <h2 className="font-bold text-lg dark:text-white">{pkg.name}</h2>
//       <p className="text-gray-600 dark:text-gray-300 mb-2">Price: ${pkg.price}</p>
//       <div className="flex flex-col gap-4">
//         {pkg.products.map((p) => (
//           <div
//             key={p.productId}
//             className="w-full p-4 rounded-lg dark:bg-gray-800 flex flex-col items-center text-center dark:border-gray-700"
//           >
//             {/* Product Image */}
//             <div className="relative w-35 h-35 overflow-hidden rounded-lg">
//               {p.productId.image && (
//                 <Image
//                   src={p.productId.image}
//                   alt={p.productId.name}
//                   fill
//                   className="object-cover rounded-lg"
//                 />
//               )}
//             </div>

//             {/* Product Name */}
//             <div className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-100">
//               {p.productId.name}
//             </div>

//             {/* Quantity */}
//             <div className="mt-1 text-xs text-gray-500 dark:text-gray-300">
//               Qty: {p.quantity}
//             </div>

//             {/* Quantity */}
//             <div className="mt-1 text-xs text-gray-500 dark:text-gray-300">
//               Price: {p.productId.price}
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="flex gap-2 mt-3">
//         <button onClick={()=>handleEdit(index)} className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white p-2 rounded"><Edit2 size={16}/> Edit</button>
//         <button onClick={()=>handleDelete(pkg._id)} className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white p-2 rounded"><XCircle size={16}/> Delete</button>
//       </div>
//     </div>
//   );
// }

// /* -----------------------------
//    MAIN MANAGE PACKAGES PAGE
// ------------------------------- */
// export default function ManagePackagesPage() {
//   const [packages, setPackages] = useState([]);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentToken, setCurrentToken] = useState("");
//   const [editingIndex, setEditingIndex] = useState(null);

//   const [packageName, setPackageName] = useState("");
//   const [price, setPrice] = useState("");
//   const [products, setProducts] = useState([{ productId:"", productName:"", quantity:"" }]);

//   useEffect(()=>{const t=localStorage.getItem("token"); if(t) setCurrentToken(t);},[]);

//   const fetchPackages = useCallback(async ()=>{
//     if(!currentToken) return;
//     try{
//       const res = await axios.get(`${API_BASE}/getallpackages`,{headers:{Authorization:`Bearer ${currentToken}`}});
//       setPackages(res.data.packages||[]);
//     }catch{ toast.error("Failed to load packages"); }
//   },[currentToken]);
//   useEffect(()=>{ fetchPackages(); },[currentToken, fetchPackages]);

//   const loadProductOptions = async (inputValue)=>{
//     if(!inputValue||!currentToken) return [];
//     try{
//       const res = await axios.get(`${API_BASE}/searchproduct?query=${inputValue}`,{headers:{Authorization:`Bearer ${currentToken}`}});
//       return (res.data.products||[]).map(p=>({value:p._id,label:p.name,image:p.image}));
//     }catch{return [];}
//   };

//   const addProductRow = ()=> setProducts([...products,{productId:"",productName:"",quantity:""}]);
//   const removeProductRow = (i)=> setProducts(products.filter((_,idx)=>idx!==i));
//   const handleProductChange = (i,field,value)=>{const u=[...products]; u[i][field]=value; setProducts(u);}
//   const handleSelectProduct = (i,opt)=>{handleProductChange(i,"productId",opt?.value||""); handleProductChange(i,"productName",opt?.label||"");}

//   const handleSubmit = async (e)=>{
//     e.preventDefault();
//     if(!packageName.trim()) return toast.error("Package name required");
//     if(!price||Number(price)<=0) return toast.error("Valid price required");
//     const formattedProducts = [];
//     for(let p of products){
//       if(!p.productId) return toast.error("Select product");
//       if(!p.quantity||Number(p.quantity)<=0) return toast.error("Quantity >0");
//       formattedProducts.push({productId:p.productId,quantity:Number(p.quantity)});
//     }
//     try{
//       setLoading(true);
//       if(editingIndex!==null){
//         const pkg=packages[editingIndex];
//         await axios.put(`${API_BASE}/updatepackage/${pkg._id}`,{name:packageName,price:Number(price),products:formattedProducts},{headers:{Authorization:`Bearer ${currentToken}`}});
//         toast.success("Package updated!");
//       }else{
//         await axios.post(`${API_BASE}/createpackage`,{name:packageName,price:Number(price),products:formattedProducts},{headers:{Authorization:`Bearer ${currentToken}`}});
//         toast.success("Package created!");
//       }
//       setPackageName(""); setPrice(""); setProducts([{productId:"",productName:"",quantity:""}]); setEditingIndex(null);
//       fetchPackages();
//     }catch{toast.error("Failed to save package");}finally{setLoading(false);}
//   };

//   const handleEditPackage = (i)=>{
//     const pkg=packages[i];
//     setEditingIndex(i);
//     setPackageName(pkg.name);
//     setPrice(pkg.price);
//     setProducts(pkg.products.map(p=>({productId:p.productId,productName:p.name,quantity:p.quantity})));
//     window.scrollTo({top:0,behavior:"smooth"});
//   };

//   const handleDeletePackage = async (id)=>{
//     if(!confirm("Delete this package?")) return;
//     try{ await axios.delete(`${API_BASE}/deletepackage/${id}`,{headers:{Authorization:`Bearer ${currentToken}`}}); toast.success("Deleted!"); fetchPackages(); }
//     catch{toast.error("Delete failed");}
//   };

//   const toggleSelect = (id)=>{ setSelectedIds(prev=> prev.includes(id)? prev.filter(x=>x!==id):[...prev,id]); }

//   const handleBulkDelete = async ()=>{
//     if(selectedIds.length===0) return toast.error("Select packages first");
//     if(!confirm("Delete selected packages?")) return;
//     try{
//       await Promise.all(selectedIds.map(id=>axios.delete(`${API_BASE}/deletepackage/${id}`,{headers:{Authorization:`Bearer ${currentToken}`}})));
//       toast.success("Deleted selected!");
//       setSelectedIds([]);
//       fetchPackages();
//     }catch{toast.error("Bulk delete failed");}
//   }

//   /* DnD */
//   const sensors = useSensors(useSensor(PointerSensor));
//   const handleDragEnd = (event)=>{
//     const {active,over}=event;
//     if(active.id!==over.id){
//       const oldIndex = packages.findIndex(p=>p._id===active.id);
//       const newIndex = packages.findIndex(p=>p._id===over.id);
//       setPackages(arrayMove(packages,oldIndex,newIndex));
//     }
//   }

//   return (
//     <div className="p-4 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4 text-center dark:text-white">Manage Packages</h1>

//       {/* FORM */}
//       <form className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-6 space-y-4" onSubmit={handleSubmit}>
//         <div>
//           <label className="font-medium dark:text-gray-200">Package Name</label>
//           <input className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" value={packageName} onChange={e=>setPackageName(e.target.value)} />
//         </div>
//         <div>
//           <label className="font-medium dark:text-gray-200">Price</label>
//           <input className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" type="number" value={price} onChange={e=>setPrice(e.target.value)} />
//         </div>
//         <h3 className="font-semibold dark:text-gray-200">Products</h3>
//         {products.map((row,i)=>(
//           <div key={i} className="grid grid-cols-12 gap-2 items-center bg-gray-50 dark:bg-gray-700 p-2 rounded">
//             <div className="col-span-7">
//               <AsyncProductSelect value={row.productId?{value:row.productId,label:row.productName}:null} onChange={opt=>handleSelectProduct(i,opt)} loadOptions={loadProductOptions} placeholder="Search product..."/>
//             </div>
//             <input type="number" placeholder="Qty" className="col-span-3 p-2 border rounded dark:bg-gray-600 dark:text-white" value={row.quantity} onChange={e=>handleProductChange(i,"quantity",e.target.value)} />
//             <button type="button" className="col-span-2 flex items-center justify-center bg-red-500 text-white rounded" onClick={()=>removeProductRow(i)}><Trash2 size={18}/></button>
//           </div>
//         ))}
//         <button type="button" onClick={addProductRow} className="w-full flex items-center justify-center gap-2 p-2 bg-blue-500 text-white rounded"><Plus size={18}/> Add Product</button>
//         <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 p-3 bg-green-600 text-white rounded">{loading && <Loader2 className="animate-spin"/>}{editingIndex!==null?"Update Package":"Create Package"}</button>
//       </form>

//       {/* BULK DELETE */}
//       <div className="flex justify-end mb-2">
//         <button onClick={handleBulkDelete} className="flex items-center gap-2 bg-red-600 text-white p-2 rounded"><XCircle size={16}/> Delete Selected</button>
//       </div>

//       {/* PACKAGE CARDS DnD */}
//       <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//         <SortableContext items={packages.map(p=>p._id)} strategy={verticalListSortingStrategy}>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {packages.map((pkg,i)=>(
//               <SortableCard key={pkg._id} pkg={pkg} index={i} handleEdit={handleEditPackage} handleDelete={handleDeletePackage} isSelected={selectedIds.includes(pkg._id)} toggleSelect={()=>toggleSelect(pkg._id)} />
//             ))}
//           </div>
//         </SortableContext>
//       </DndContext>
//     </div>
//   );
// }



















// app/admin/dashboard/agent/edit-package/[id]/page.jsx
"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AsyncProductSelect from "../../../../../components/agent/AsyncProductSelect"; // আপনার Async select কম্পোনেন্ট

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export default function EditPackagePage() {
  const router = useRouter();
  const { id } = useParams();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const [packageName, setPackageName] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load package
  useEffect(() => {
    const loadPackage = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/getpackagebyid/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pkg = res.data.package;
        setPackageName(pkg.name);
        setPrice(pkg.price);
        setProducts(pkg.products.map(p => ({
          productId: p.productId._id,
          productName: p.productId.name,
          image: p.productId.image,
          quantity: p.quantity,
          joining_quantity: p.joining_quantity,
          joining_stock: p.joining_stock
        })));
      } catch (err) {
        toast.error("Failed 1 to load package");
      } finally {
        setLoading(false);
      }
    };
    if (id) loadPackage();
  }, [id, token]);

  // Add / remove row
  const addRow = () => {
    setProducts([...products, { productId: "", productName: "", quantity: 1, joining_quantity: 1, joining_stock: 1 }]);
  };
  const removeRow = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  // Select product
  const handleSelectProduct = (index, selected) => {
    const updated = [...products];
    updated[index].productId = selected?.value || "";
    updated[index].productName = selected?.label || "";
    updated[index].image = selected?.image || "";
    setProducts(updated);
  };

  // Change quantity / joining quantity
  const handleRowChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = Number(value);
    // auto calculate joining_stock
    if (field === "quantity" || field === "joining_quantity") {
      const q = updated[index].quantity || 1;
      const jq = updated[index].joining_quantity || 1;
      updated[index].joining_stock = Math.floor(q / jq);
    }
    setProducts(updated);
  };

  // Update package
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!packageName.trim()) return toast.error("Package name required");
    if (!price || Number(price) <= 0) return toast.error("Valid price required");
    for (let p of products) {
      if (!p.productId) return toast.error("Select product");
      if (!p.quantity || Number(p.quantity) <= 0) return toast.error("Quantity must be > 0");
    }

    try {
      setLoading(true);
      await axios.put(`${API_BASE}/updatepackage/${id}`, {
        name: packageName,
        price: Number(price),
        products: products.map(p => ({
          productId: p.productId,
          quantity: p.quantity,
          joining_quantity: p.joining_quantity,
          joining_stock: p.joining_stock
        }))
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Package updated");
      router.push("/admin/dashboard/agent/all-package");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Edit Package</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="font-medium">Package Name</label>
          <input
            type="text"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div>
          <label className="font-medium">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <h3 className="font-semibold">Products</h3>

        {products.map((row, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-2 rounded">
            <div className="col-span-6">
              <AsyncProductSelect
                value={row.productId ? { value: row.productId, label: row.productName, image: row.image } : null}
                onChange={(selected) => handleSelectProduct(index, selected)}
                token={token}
              />
            </div>
            <input
              type="number"
              className="col-span-2 p-2 border rounded"
              placeholder="Qty"
              value={row.quantity}
              onChange={(e) => handleRowChange(index, "quantity", e.target.value)}
            />
            <input
              type="number"
              className="col-span-2 p-2 border rounded"
              placeholder="Joining Qty"
              value={row.joining_quantity}
              onChange={(e) => handleRowChange(index, "joining_quantity", e.target.value)}
            />
            <div className="col-span-1 text-center font-semibold">{row.joining_stock}</div>
            <button type="button" onClick={() => removeRow(index)} className="col-span-1 bg-red-500 text-white rounded flex items-center justify-center">Delete</button>
          </div>
        ))}

        <button type="button" onClick={addRow} className="w-full p-2 bg-blue-500 text-white rounded">Add Product</button>

        <button type="submit" disabled={loading} className="w-full p-3 bg-green-600 text-white rounded flex items-center justify-center">
          {loading ? "Updating..." : "Update Package"}
        </button>
      </form>
    </div>
  );
}









