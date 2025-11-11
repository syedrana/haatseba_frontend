// "use client";
// import axios from "axios";
// import { ChevronDown, ChevronRight, User } from "lucide-react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// function TreeNode({ node }) {
//   const [expanded, setExpanded] = useState(false);
//   const router = useRouter();

//   const handleProfileClick = () => {
//     // 👉 প্রতিটি node অনুযায়ী আলাদা প্রোফাইল পেজে যাবে
    
//     router.push(`/dashboard/ownprofile/${node.userId}`);
//   };

//   return (
//     <div className="ml-4 mt-2">
//         <div
//             onClick={handleProfileClick}
//             className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 flex items-center justify-between cursor-pointer hover:shadow-lg transition"
//         >
//             <div className="flex items-center space-x-3">
//             {node.image ? (
//                 <Image
//                 src={node.image}
//                 alt={node.name}
//                 width={40}
//                 height={40}
//                 className="w-10 h-10 rounded-full object-cover border"
//                 />
//             ) : (
//                 <User className="w-10 h-10 text-blue-500 border rounded-full p-1" />
//             )}

//             <div>
//                 <p className="font-semibold text-gray-800 dark:text-gray-100">
//                 {node.name}
//                 </p>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                 {node.email}
//                 </p>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                 {node.phone}
//                 </p>
//                 <p className="text-xs text-gray-400 dark:text-gray-500">
//                 Referral: {node.referralCode || "N/A"} | Level: {node.level}
//                 </p>
//             </div>
//             </div>

//             {node.children && node.children.length > 0 && (
//             <button
//                 onClick={(e) => {
//                 e.stopPropagation(); // ✅ expand button এ ক্লিক করলে প্রোফাইল পেজে যাবে না
//                 setExpanded(!expanded);
//                 }}
//                 className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
//             >
//                 {expanded ? (
//                 <ChevronDown className="w-5 h-5 text-gray-700 dark:text-gray-200" />
//                 ) : (
//                 <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
//                 )}
//             </button>
//             )}
//         </div>

//       {expanded && node.children && (
//         <div className="ml-6 border-l border-gray-300 dark:border-gray-700 pl-4">
//           {node.children.map((child) => (
//             <TreeNode key={child.userId} node={child} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default function DownlineTree() {
//   const [treeData, setTreeData] = useState(null);

//   useEffect(() => {
//     async function fetchTree() {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE}/usertree/${node.userId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = res.data;

//         setTreeData({
//           userId: data.userId,
//           name: data.name,
//           email: data.email,
//           phone: data.phone,
//           image: data.image,
//           referralCode: data.referralCode,
//           level: data.level,
//           children: data.tree,
//         });
//       } catch (err) {
//         console.error("Tree fetch error:", err);
//       }
//     }
//     fetchTree();
//   }, []);

//   if (!treeData) {
//     return <p className="text-center mt-6">Loading tree...</p>;
//   }

//   return (
//     <div className="p-4 md:p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
//         My Downline Tree
//       </h1>
//       <TreeNode node={treeData} />
//     </div>
//   );
// }
















"use client";

import axios from "axios";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function TreeNode({ node }) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const handleProfileClick = () => {
    router.push(`/dashboard/ownprofile/${node.userId}`);
  };

  return (
    <div className="ml-4 mt-2">
      <div
        onClick={handleProfileClick}
        className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 flex items-center justify-between cursor-pointer hover:shadow-lg transition"
      >
        <div className="flex items-center space-x-3">
          {node.image ? (
            <Image
              src={node.image}
              alt={node.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border"
            />
          ) : (
            <User className="w-10 h-10 text-blue-500 border rounded-full p-1" />
          )}

          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100">
              {node.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {node.email}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {node.phone}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Referral: {node.referralCode || "N/A"} | Level: {node.level ?? 0}
            </p>
          </div>
        </div>

        {node.children && node.children.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // expand এ ক্লিক করলে প্রোফাইল রিডাইরেক্ট ট্রিগার হবে না
              setExpanded(!expanded);
            }}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {expanded ? (
              <ChevronDown className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            )}
          </button>
        )}
      </div>

      {expanded && node.children && (
        <div className="ml-6 border-l border-gray-300 dark:border-gray-700 pl-4">
          {node.children.map((child) => (
            <TreeNode key={child.userId} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DownlineTree() {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams(); // next/navigation থেকে
  const { id } = params || {}; // route param: [id]

  useEffect(() => {
    if (!id) return;

    async function fetchTree() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";
        // Note: no ":" before id
        const res = await axios.get(`${API_BASE}/usertree/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;
        setTreeData({
          userId: data.userId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          image: data.image,
          referralCode: data.referralCode,
          level: data.level,
          children: data.tree || [],
        });
      } catch (err) {
        console.error("Tree fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTree();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-6">Loading tree...</p>;
  }

  if (!treeData) {
    return <p className="text-center mt-6">No tree data available.</p>;
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        My Downline Tree
      </h1>
      <TreeNode node={treeData} />
    </div>
  );
}
