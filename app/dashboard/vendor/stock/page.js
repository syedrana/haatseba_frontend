// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { CheckCircle, Package, PlusCircle, Search, XCircle } from "lucide-react";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// export default function VendorProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");

//   const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await axios.get(`${API_BASE}/vendorproducts`, {
//             headers: { Authorization: `Bearer ${token}` },
//         })
//         setProducts(res.data.products || []);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [API_BASE, token]);

//   const filtered = products.filter((p) =>
//     p.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold">📦 My Products</h1>
//           <p className="text-muted-foreground text-sm">Manage your products</p>
//         </div>
//         <Button className="rounded-2xl shadow">
//           <PlusCircle className="h-4 w-4 mr-2" /> Add New Product
//         </Button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
//         <Card className="rounded-2xl">
//           <CardContent className="p-4 flex items-center gap-3">
//             <Package />
//             <div>
//               <p className="text-sm">Total Products</p>
//               <p className="text-xl font-bold">{products.length}</p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="rounded-2xl">
//           <CardContent className="p-4 flex items-center gap-3">
//             <CheckCircle className="text-green-500" />
//             <div>
//               <p className="text-sm">Approved</p>
//               <p className="text-xl font-bold">
//                 {products.filter((p) => p.isApproved).length}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="rounded-2xl">
//           <CardContent className="p-4 flex items-center gap-3">
//             <XCircle className="text-red-500" />
//             <div>
//               <p className="text-sm">Pending</p>
//               <p className="text-xl font-bold">
//                 {products.filter((p) => !p.isApproved).length}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="rounded-2xl">
//           <CardContent className="p-4 flex items-center gap-3">
//             <PlusCircle className="text-blue-500" />
//             <div>
//               <p className="text-sm">Add New</p>
//               <p className="text-xl font-bold">Quick Action</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Search */}
//       <div className="relative max-w-md">
//         <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//         <Input
//           placeholder="Search product by name"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="pl-9 rounded-xl"
//         />
//       </div>

//       {/* Products Grid */}
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6">
//           {filtered.map((p) => (
//             <motion.div
//               key={p._id}
//               whileHover={{ scale: 1.02 }}
//               transition={{ duration: 0.2 }}
//             >
//               <Card className="rounded-2xl shadow-lg overflow-hidden">
//                 <div className="relative h-64 w-full bg-gray-100">
//                   <Image
//                     src={p.image}
//                     alt={p.name}
//                     fill
//                     className="object-contain"
//                     sizes="(max-width: 768px) 100vw, 25vw"
//                   />
//                 </div>

//                 <CardContent className="p-4 space-y-3">
//                   <div className="flex justify-between items-start">
//                     <h3 className="font-semibold text-lg line-clamp-1">
//                       {p.name}
//                     </h3>
//                     <Badge variant={p.isApproved ? "default" : "secondary"}>
//                       {p.isApproved ? "Approved" : "Pending"}
//                     </Badge>
//                   </div>

//                   <p className="text-sm text-muted-foreground line-clamp-2">
//                     {p.description}
//                   </p>

//                   <div className="flex justify-between text-sm">
//                     <span>💰 ৳{p.price}</span>
//                     <span>📦 Stock: {p.stock}</span>
//                   </div>

//                   <div className="flex gap-2 pt-2">
//                     <Button size="sm" variant="outline" className="rounded-xl">
//                       Edit
//                     </Button>
//                     <Button size="sm" variant="destructive" className="rounded-xl">
//                       Delete
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }






















"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, Edit2, Package, PlusCircle, Search, Trash2, XCircle } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function VendorProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [editProduct, setEditProduct] = useState(null);
  const [editData, setEditData] = useState({ name: '', price: 0, stock: 0, discount: 0, description: '', image: null });
  const [modalOpen, setModalOpen] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/vendorproducts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  },[API_BASE, token]);

  useEffect(() => {
    fetchProducts();
  }, [API_BASE, fetchProducts, token]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_BASE}/vendorproductdelete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setEditData({
      name: product.name || '',
      price: product.price || 0,
      stock: product.stock || 0,
      discount: product.discount || 0,
      description: product.description || '',
      image: null
    });
    setModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('price', editData.price);
      formData.append('stock', editData.stock);
      formData.append('discount', editData.discount);
      formData.append('description', editData.description);
      if (editData.image) formData.append('image', editData.image);

      await axios.put(`${API_BASE}/vendorproductupdate/${editProduct._id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditData({ ...editData, image: e.target.files[0] });
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">📦 My Products</h1>
          <p className="text-muted-foreground text-sm">Manage your products</p>
        </div>
        <Button className="rounded-2xl shadow">
          <PlusCircle className="h-4 w-4 mr-2" /> Add New Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <Package />
            <div>
              <p className="text-sm">Total Products</p>
              <p className="text-xl font-bold">{products.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="text-green-500" />
            <div>
              <p className="text-sm">Approved</p>
              <p className="text-xl font-bold">
                {products.filter((p) => p.isApproved).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="text-red-500" />
            <div>
              <p className="text-sm">Pending</p>
              <p className="text-xl font-bold">
                {products.filter((p) => !p.isApproved).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <PlusCircle className="text-blue-500" />
            <div>
              <p className="text-sm">Add New</p>
              <p className="text-xl font-bold">Quick Action</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search product by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl"
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <motion.div key={p._id} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card className="rounded-2xl shadow-lg overflow-hidden">
                <div className="relative h-64 w-full bg-gray-100">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>

                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg line-clamp-1">{p.name}</h3>
                    <Badge variant={p.isApproved ? "default" : "secondary"}>
                      {p.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>

                  <div className="flex justify-between text-sm">
                    <span>💰 ৳{p.price}</span>
                    <span>📦 Stock: {p.stock}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="rounded-xl flex items-center gap-1" onClick={() => openEditModal(p)}>
                      <Edit2 className="h-4 w-4" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" className="rounded-xl flex items-center gap-1" onClick={() => handleDelete(p._id)}>
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Name" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
            <Input type="number" placeholder="Price" value={editData.price} onChange={(e) => setEditData({ ...editData, price: e.target.value })} />
            <Input type="number" placeholder="Stock" value={editData.stock} onChange={(e) => setEditData({ ...editData, stock: e.target.value })} />
            <Input type="number" placeholder="Discount" value={editData.discount} onChange={(e) => setEditData({ ...editData, discount: e.target.value })} />
            <Input placeholder="Description" value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <DialogFooter>
            <Button onClick={handleEditSubmit} className="rounded-xl">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
