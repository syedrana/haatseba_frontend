// // app/admin/dashboard/page.jsx
// "use client";

// import { Card, CardContent } from "@/components/ui/card";
// import axios from "axios";
// import { ArrowDownCircle, CheckCircle2, Clock, UserCheck, Users, UserX, Wallet } from "lucide-react";
// import { useEffect, useState } from "react";
// import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";
// const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

// export default function AdminDashboard() {
//   const [summary, setSummary] = useState(null);
//   const [latestWithdraws, setLatestWithdraws] = useState([]);
//   const [withdrawTrend, setWithdrawTrend] = useState([]);

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         const [summaryRes, latestRes, trendRes] = await Promise.all([
//           axios.get(`${API_BASE}/adminsummary`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API_BASE}/withdrawslatest`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API_BASE}/withdrawstrend`, { headers: { Authorization: `Bearer ${token}` } }),
//         ]);

//         setSummary(summaryRes.data);
//         setLatestWithdraws(Array.isArray(latestRes.data) ? latestRes.data : []);
//         setWithdrawTrend(Array.isArray(trendRes.data) ? trendRes.data : []);
//       } catch (error) {
//         console.error("Dashboard fetch error:", error);
//       }
//     };
//     fetchDashboard();
//   }, []);

//   if (!summary) {
//     return <div className="p-6 text-center text-gray-500">Loading dashboard...</div>;
//   }

//   const cards = [
//     { title: "Total Users", value: summary.totalUsers, icon: <Users className="text-blue-500 w-6 h-6" />, color: "from-blue-100 to-blue-50" },
//     { title: "Total Wallet Balance", value: `$${summary.totalWalletBalance}`, icon: <Wallet className="text-green-500 w-6 h-6" />, color: "from-green-100 to-green-50" },
//     { title: "Total Withdraws", value: `$${summary.totalWithdraws}`, icon: <ArrowDownCircle className="text-purple-500 w-6 h-6" />, color: "from-purple-100 to-purple-50" },
//     { title: "Pending Withdraws", value: summary.pendingWithdrawsCount, icon: <Clock className="text-orange-500 w-6 h-6" />, color: "from-orange-100 to-orange-50" },
//     { title: "Approved Users", value: summary.approvalUserCount, icon: <CheckCircle2 className="text-green-600 w-6 h-6" />, color: "from-green-200 to-green-100" },
//     { title: "Pending Users", value: summary.pendingUserCount, icon: <UserCheck className="text-yellow-600 w-6 h-6" />, color: "from-yellow-100 to-yellow-50" },
//     { title: "Rejected Users", value: summary.rejectedUserCount, icon: <UserX className="text-red-600 w-6 h-6" />, color: "from-red-100 to-red-50" },
//   ];

//   const userPieData = [
//     { name: "Approved", value: summary.approvalUserCount },
//     { name: "Pending", value: summary.pendingUserCount },
//     { name: "Rejected", value: summary.rejectedUserCount },
//   ];
//   const COLORS = ["#22c55e", "#facc15", "#ef4444"];

//   return (
//     <div className="p-6 space-y-8">
//       <h1 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h1>

//       {/* KPI Cards */}
//       <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         {cards.map((card, index) => (
//           <Card key={index} className={`shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${card.color} rounded-2xl`}>
//             <CardContent className="flex items-center justify-between p-6">
//               <div>
//                 <p className="text-sm text-gray-500">{card.title}</p>
//                 <h2 className="text-2xl font-semibold">{card.value}</h2>
//               </div>
//               <div className="p-3 bg-white rounded-full shadow">{card.icon}</div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card className="p-6 shadow-md rounded-2xl">
//           <h2 className="text-xl font-semibold mb-4">📈 Withdraw Trend</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={withdrawTrend}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} />
//             </LineChart>
//           </ResponsiveContainer>
//         </Card>

//         <Card className="p-6 shadow-md rounded-2xl">
//           <h2 className="text-xl font-semibold mb-4">👥 User Distribution</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie data={userPieData} dataKey="value" nameKey="name" outerRadius={120} label>
//                 {userPieData.map((_, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Legend />
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </Card>
//       </div>

//       {/* Latest Withdraw Table */}
//       <Card className="p-6 shadow-md rounded-2xl">
//         <h2 className="text-xl font-semibold mb-4">💸 Latest Withdraws</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm border">
//             <thead className="bg-gray-100 text-left">
//               <tr>
//                 <th className="px-4 py-2 border">User</th>
//                 <th className="px-4 py-2 border">Amount</th>
//                 <th className="px-4 py-2 border">Status</th>
//                 <th className="px-4 py-2 border">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {latestWithdraws.map((w, i) => (
//                 <tr key={i} className="hover:bg-gray-50">
//                   <td className="px-4 py-2 border">{w.user?.name || "N/A"}</td>
//                   <td className="px-4 py-2 border">${w.amount}</td>
//                   <td className={`px-4 py-2 border font-medium ${w.status === "approved" ? "text-green-600" : w.status === "pending" ? "text-yellow-600" : "text-red-600"}`}>
//                     {w.status}
//                   </td>
//                   <td className="px-4 py-2 border">{new Date(w.createdAt).toLocaleDateString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>
//     </div>
//   );
// }















// // app/admin/dashboard/page.jsx
// "use client";

// import { Card, CardContent } from "@/components/ui/card";
// import axios from "axios";
// import { ArrowDownCircle, CheckCircle2, Clock, UserCheck, Users, UserX, Wallet } from "lucide-react";
// import { useEffect, useState } from "react";
// import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";
// const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

// export default function AdminDashboard() {
//   const [summary, setSummary] = useState(null);
//   const [latestWithdraws, setLatestWithdraws] = useState([]);
//   const [withdrawTrend, setWithdrawTrend] = useState([]);

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         const [summaryRes, latestRes, trendRes] = await Promise.all([
//           axios.get(`${API_BASE}/adminsummary`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API_BASE}/withdrawslatest`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API_BASE}/withdrawstrend`, { headers: { Authorization: `Bearer ${token}` } }),
//         ]);

//         setSummary(summaryRes.data);
//         setLatestWithdraws(Array.isArray(latestRes.data) ? latestRes.data : []);
//         setWithdrawTrend(Array.isArray(trendRes.data) ? trendRes.data : []);
//       } catch (error) {
//         console.error("Dashboard fetch error:", error);
//       }
//     };
//     fetchDashboard();
//   }, []);

//   if (!summary) {
//     return <div className="p-6 text-center text-gray-500">Loading dashboard...</div>;
//   }

//   const cards = [
//     { title: "Total Users", value: summary.totalUsers, icon: <Users className="text-blue-500 w-6 h-6" />, color: "from-blue-400 to-blue-200" },
//     { title: "Total Wallet Balance", value: `$${summary.totalWalletBalance}`, icon: <Wallet className="text-green-500 w-6 h-6" />, color: "from-green-400 to-green-200" },
//     { title: "Total Withdraws", value: `$${summary.totalWithdraws}`, icon: <ArrowDownCircle className="text-purple-500 w-6 h-6" />, color: "from-purple-400 to-purple-200" },
//     { title: "Pending Withdraws", value: summary.pendingWithdrawsCount, icon: <Clock className="text-orange-500 w-6 h-6" />, color: "from-orange-400 to-orange-200" },
//     { title: "Approved Users", value: summary.approvalUserCount, icon: <CheckCircle2 className="text-green-700 w-6 h-6" />, color: "from-green-500 to-green-300" },
//     { title: "Pending Users", value: summary.pendingUserCount, icon: <UserCheck className="text-yellow-600 w-6 h-6" />, color: "from-yellow-400 to-yellow-200" },
//     { title: "Rejected Users", value: summary.rejectedUserCount, icon: <UserX className="text-red-600 w-6 h-6" />, color: "from-red-400 to-red-200" },
//   ];

//   const userPieData = [
//     { name: "Approved", value: summary.approvalUserCount },
//     { name: "Pending", value: summary.pendingUserCount },
//     { name: "Rejected", value: summary.rejectedUserCount },
//   ];
//   const COLORS = ["#22c55e", "#facc15", "#ef4444"];

//   return (
//     <div className="p-6 space-y-8">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Admin Dashboard</h1>

//       {/* KPI Cards */}
//       <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         {cards.map((card, index) => (
//           <Card key={index} className={`transition-transform transform hover:-translate-y-1 hover:scale-105 shadow-lg rounded-2xl bg-gradient-to-br ${card.color}`}>
//             <CardContent className="flex items-center justify-between p-6">
//               <div>
//                 <p className="text-sm font-medium text-gray-700">{card.title}</p>
//                 <h2 className="text-2xl font-bold text-gray-900">{card.value}</h2>
//               </div>
//               <div className="p-3 bg-white rounded-full shadow">{card.icon}</div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Withdraw Trend */}
//         <Card className="shadow-md rounded-2xl p-6">
//           <h2 className="text-xl font-semibold mb-4 text-gray-800">📈 Withdraw Trend</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={withdrawTrend}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </Card>

//         {/* User Pie Chart */}
//         <Card className="shadow-md rounded-2xl p-6">
//           <h2 className="text-xl font-semibold mb-4 text-gray-800">👥 User Distribution</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie data={userPieData} dataKey="value" nameKey="name" outerRadius={120} label>
//                 {userPieData.map((_, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Legend />
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </Card>
//       </div>

//       {/* Latest Withdraw Table */}
//       <Card className="shadow-md rounded-2xl p-6 overflow-x-auto">
//         <h2 className="text-xl font-semibold mb-4 text-gray-800">💸 Latest Withdraws</h2>
//         <table className="min-w-full divide-y divide-gray-200 text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-2 text-left font-medium text-gray-700">User</th>
//               <th className="px-4 py-2 text-left font-medium text-gray-700">Amount</th>
//               <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
//               <th className="px-4 py-2 text-left font-medium text-gray-700">Date</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {latestWithdraws.map((w, i) => (
//               <tr key={i} className="hover:bg-gray-50 transition-colors">
//                 <td className="px-4 py-2">{w.user?.name || "N/A"}</td>
//                 <td className="px-4 py-2">${w.amount}</td>
//                 <td className={`px-4 py-2 font-medium ${w.status === "approved" ? "text-green-600" : w.status === "pending" ? "text-yellow-600" : "text-red-600"}`}>
//                   {w.status}
//                 </td>
//                 <td className="px-4 py-2">{new Date(w.createdAt).toLocaleDateString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </Card>
//     </div>
//   );
// }

















// app/admin/dashboard/page.jsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { ArrowDownCircle, CheckCircle2, Clock, UserCheck, Users, UserX, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:7000";
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

export default function AdminDashboard({ darkMode }) {
  const [summary, setSummary] = useState(null);
  const [latestWithdraws, setLatestWithdraws] = useState([]);
  const [withdrawTrend, setWithdrawTrend] = useState([]);
  //const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [summaryRes, latestRes, trendRes] = await Promise.all([
          axios.get(`${API_BASE}/adminsummary`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE}/withdrawslatest`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE}/withdrawstrend`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setSummary(summaryRes.data);
        setLatestWithdraws(Array.isArray(latestRes.data) ? latestRes.data : []);
        setWithdrawTrend(Array.isArray(trendRes.data) ? trendRes.data : []);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };
    fetchDashboard();
  }, []);

  if (!summary) return <div className="p-6 text-center text-gray-500">Loading dashboard...</div>;

  const cards = [
    { title: "Total Users", value: summary.totalUsers, icon: <Users className="w-6 h-6" />, color: "bg-blue-200" },
    { title: "Total Wallet Balance", value: summary.totalWalletBalance, icon: <Wallet className="w-6 h-6" />, color: "bg-green-200" },
    { title: "Total Withdraws", value: summary.totalWithdraws, icon: <ArrowDownCircle className="w-6 h-6" />, color: "bg-purple-200" },
    { title: "Pending Withdraws", value: summary.pendingWithdrawsCount, icon: <Clock className="w-6 h-6" />, color: "bg-orange-200" },
    { title: "Approved Users", value: summary.approvalUserCount, icon: <CheckCircle2 className="w-6 h-6" />, color: "bg-green-300" },
    { title: "Pending Users", value: summary.pendingUserCount, icon: <UserCheck className="w-6 h-6" />, color: "bg-yellow-200" },
    { title: "Rejected Users", value: summary.rejectedUserCount, icon: <UserX className="w-6 h-6" />, color: "bg-red-200" },
  ];

  const userPieData = [
    { name: "Approved", value: summary.approvalUserCount },
    { name: "Pending", value: summary.pendingUserCount },
    { name: "Rejected", value: summary.rejectedUserCount },
  ];
  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  return (
    <div className="p-6 space-y-8 bg-gray-50 text-gray-900">
      {/* Header + Dark Mode Toggle */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h1>
        {/* <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-transform"
        >
          {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
        </button> */}
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card, index) => (
          <Card
            key={index}
            className={`shadow-xl rounded-2xl p-6 transform transition-transform hover:-translate-y-1 hover:scale-105 ${darkMode ? "bg-gray-800" : card.color}`}
          >
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{card.title}</p>
                <h2 className="text-2xl font-bold">
                  <CountUp end={card.value} duration={1.5} separator="," prefix={card.title.includes("Wallet") || card.title.includes("Withdraw") ? "$" : ""} />
                </h2>
              </div>
              <div className={`p-3 rounded-full shadow-md ${darkMode ? "bg-gray-700" : "bg-white"}`}>{card.icon}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Withdraw Trend */}
        <Card className={`shadow-md rounded-2xl p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-4">📈 Withdraw Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={withdrawTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#555" : "#ccc"} />
              <XAxis dataKey="date" stroke={darkMode ? "#ccc" : "#333"} />
              <YAxis stroke={darkMode ? "#ccc" : "#333"} />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* User Pie Chart */}
        <Card className={`shadow-md rounded-2xl p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-4">👥 User Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={userPieData} dataKey="value" nameKey="name" outerRadius={120} label>
                {userPieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Latest Withdraw Table */}
      <Card className={`shadow-md rounded-2xl p-6 overflow-x-auto ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className="text-xl font-semibold mb-4">💸 Latest Withdraws</h2>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
            <tr>
              <th className="px-4 py-2 text-left font-medium">User</th>
              <th className="px-4 py-2 text-left font-medium">Amount</th>
              <th className="px-4 py-2 text-left font-medium">Status</th>
              <th className="px-4 py-2 text-left font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {latestWithdraws.map((w, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-4 py-2">{w.user?.name || "N/A"}</td>
                <td className="px-4 py-2">${w.amount}</td>
                <td className={`px-4 py-2 font-medium ${w.status === "approved" ? "text-green-500" : w.status === "pending" ? "text-yellow-500" : "text-red-500"}`}>
                  {w.status}
                </td>
                <td className="px-4 py-2">{new Date(w.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}














