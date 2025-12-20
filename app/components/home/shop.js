// "use client";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import ProductCard from "../marketplace/ProductCard";
// import CheckoutDrawer from "../package/CheckoutDrawer";

// export default function ShopPage() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true)
//   const [selected, setSelected] = useState(null);
//     const [qty, setQty] = useState(1);
//     const [paymentType, setPaymentType] = useState("cod");
//     const [showDrawer, setShowDrawer] = useState(false);
//     const [placing, setPlacing] = useState(false);
//     const [error, setError] = useState("");
//     const [successData, setSuccessData] = useState(null);

//   //const [showDrawer, setShowDrawer] = useState(false);

//   const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

//   useEffect(() => {
//     const load = async () => {
//         try {
//             const res = await axios.get(`${API_BASE}/getmarketplaceproducts`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setProducts(res.data.products || []);
//             } catch (e) {
//             console.error(e);
//             } finally {
//             setLoading(false);
//         }
//     }
//     load();
//   }, [API_BASE, token]);

//   const handleSelect = (p) => {
//     setSelected(p);
//     setQty(1);
//     setPaymentType("cod");
//     setShowDrawer(true);
//     setError("");
//   };

//   const handleConfirm = async () => {
//     if (!selected) return setError("Select a package first.");
//     if (!qty || qty < 1) return setError("Invalid quantity.");

//     // client-side stock check (optional)
//     if (selected.stock != null && qty > selected.stock) {
//       return setError("Quantity exceeds available stock.");
//     }

//     setPlacing(true);
//     setError("");

//     try {
//       const payload = {
//         packageId: selected._id,
//         quantity: qty,
//         paymentType,
//       };

//       const res = await axios.post(`${API_BASE}/placeagentorder`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setSuccessData(res.data);
//       toast.success("Order placed successfully");
//       setShowDrawer(false);
//       // Optional: mark package as selected/disabled or refresh list
//       // reload packages to reflect new stock
//       (async () => {
//         try {
//           const r = await axios.get(`${API_BASE}/loadagentpackages`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           setPkgList(r.data.packages || []);
//         } catch { /* ignore */ }
//       })();
//     } catch (err) {
//       console.error(err);
//       const msg = err.response?.data?.message || "Order failed. Try again.";
//       setError(msg);
//       toast.error(msg);
//     } finally {
//       setPlacing(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {/* <h1 className="text-3xl font-bold mb-6">Marketplace</h1> */}

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {products.map((p) => (
//           <ProductCard 
//             key={p._id} 
//             product={p}
//             selected={selected?._id === p._id}
//             onSelect={handleSelect} 
//           />
//         ))}
//       </div>
//       {/* Checkout Drawer */}
//             <CheckoutDrawer
//               open={showDrawer}
//               onClose={() => setShowDrawer(false)}
//               pkg={selected}
//               qty={qty}
//               setQty={setQty}
//               paymentType={paymentType}
//               setPaymentType={setPaymentType}
//               onConfirm={handleConfirm}
//               loading={placing}
//             />
//             {/* success panel */}
//       {successData && (
//         <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded flex items-start gap-3">
//           <div className="p-2 bg-green-100 rounded-full">
//             <Check size={20} className="text-green-700" />
//           </div>
//           <div>
//             <div className="font-semibold text-green-800">Order submitted</div>
//             <div className="text-sm text-gray-700 mt-1">{successData.message || "Your order is pending approval."}</div>
//             <div className="text-xs text-gray-500 mt-1">Order id: <span className="font-mono">{successData.order?._id || "—"}</span></div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }












"use client";

import axios from "axios";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ProductCard from "../marketplace/ProductCard";
import CheckoutDrawer from "../package/CheckoutDrawer";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [paymentType, setPaymentType] = useState("cod");
  const [showDrawer, setShowDrawer] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : "";

  /* -------------------------
     Load marketplace products
     ------------------------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/getmarketplaceproducts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(res.data.products || []);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [API_BASE, token]);

  /* -------------------------
     Select product
     ------------------------- */
  const handleSelect = (product) => {
    setSelected(product);
    setQty(1);
    setPaymentType("cod");
    setShowDrawer(true);
    setError("");
  };

  /* -------------------------
     Place order
     ------------------------- */
  const handleConfirm = async () => {
    if (!selected) return setError("Select a product first.");
    if (qty < 1) return setError("Invalid quantity.");

    if (selected.stock != null && qty > selected.stock) {
      return setError("Quantity exceeds available stock.");
    }

    setPlacing(true);
    setError("");

    try {
      const payload = {
        productId: selected._id,
        quantity: qty,
        paymentType,
      };

      const res = await axios.post(
        `${API_BASE}/placemarketplaceorder`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessData(res.data);
      toast.success("Order placed successfully");
      setShowDrawer(false);

      // reload products to reflect stock
      const r = await axios.get(
        `${API_BASE}/getmarketplaceproducts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(r.data.products || []);

    } catch (err) {
      const msg =
        err.response?.data?.message || "Order failed. Try again.";
      toast.error(msg);
      setError(msg);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            selected={selected?._id === p._id}
            onSelect={() => setSelected(p)}   // শুধু select
            onBuyNow={() => handleSelect(p)}  // 🔥 checkout open
          />
        ))}
      </div>

      {/* checkout drawer */}
      <CheckoutDrawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        pkg={selected}
        qty={qty}
        setQty={setQty}
        paymentType={paymentType}
        setPaymentType={setPaymentType}
        onConfirm={handleConfirm}
        loading={placing}
      />

      {/* success panel */}
      {successData && (
        <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded flex gap-3">
          <div className="p-2 bg-green-100 rounded-full">
            <Check size={20} className="text-green-700" />
          </div>
          <div>
            <div className="font-semibold text-green-800">
              Order submitted
            </div>
            <div className="text-sm text-gray-700 mt-1">
              {successData.message || "Your order is pending approval."}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Order ID:
              <span className="font-mono ml-1">
                {successData.order?._id || "—"}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
