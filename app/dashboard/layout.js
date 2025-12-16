// 'use client';

// import axios from 'axios';
// import clsx from 'clsx';
// import { AnimatePresence, motion } from 'framer-motion';
// import { Boxes, Briefcase, ChevronDown, FileCheck, Gift, LogOut, Menu, Moon, Network, Package, Receipt, ShoppingCart, Store, Sun, Trophy, User, UserPlus, Wallet, X } from 'lucide-react';
// import Image from "next/image";
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { useEffect, useMemo, useState } from 'react';
// import { Toaster } from "react-hot-toast";

// export default function DashboardLayout({ children }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [sidebarHover, setSidebarHover] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [openMenus, setOpenMenus] = useState({});
//   const [user, setUser] = useState(null);

//   const pathname = usePathname(); // Next.js hook for current route
//   const router = useRouter();

//   const menuItems = useMemo(() => {
//   if (!user) return [];

//   const isVendor = Boolean(user.isVendor);
//   console.log("isVendor:", user?.isVendor);


//   const items = [
//     {
//       name: "Marketplace",
//       icon: Store,
//       children: [
//         //{ name: "Shop", href: "/dashboard/marketplace/shop", icon: ShoppingBag },
//         { name: "My Orders", href: "/dashboard/orders", icon: Receipt },
//       ]
//     },
//     {
//       name: 'MLM Integration',
//       icon: Gift,
//       children: [
//         { name: 'Earnings & Network', href: '/dashboard', icon: Network },
//         { name: 'Downline Tree', href: '/dashboard/downline', icon: Network },
//         { name: 'My Referral', href: "/dashboard/my-referral", icon: Trophy },
//         { name: 'Levels & Matrix', href: "/dashboard/levels&matrix", icon: FileCheck },
//       ]
//     },
//     {
//       name: 'Rewards Zone',
//       icon: Gift,
//       children: [
//         { name: 'My Rewards', href: "/dashboard/my-rewards", icon: Trophy },
//         { name: 'My Claims', href: "/dashboard/my-rewards/claims", icon: FileCheck },
//         { name: 'My Wallet', href: "/dashboard/withdraw/requests", icon: Wallet },
//       ]
//     },
//     {
//       name: "Joining Products",
//       icon: Package,
//       children: [
//         { name: 'Buy Joining Product', href: "/dashboard/agent/request", icon: ShoppingCart },
//         { name: 'My Joining Stock', href: "/dashboard/agent/stock", icon: Boxes },
//       ]
//     },

//     // 🟩 Vendor Section
//     isVendor
//       ? {
//           name: "Vendor Portal",
//           icon: Briefcase,
//           children: [
//             { name: 'Add Product', href: "/dashboard/vendor/add-product", icon: ShoppingCart },
//             { name: 'My Stock', href: "/dashboard/vendor/stock", icon: Boxes },
//           ]
//         }
//       : {
//           name: "Become A Vendor",
//           href: "/dashboard/vendor/request",
//           icon: UserPlus
//         },

//     {
//       name: 'Profile Zone',
//       icon: User,
//       children: [
//         { name: 'View Profile', href: '/dashboard/profile/view', icon: User },
//         { name: 'Edit Profile', href: "/dashboard/profile/edit-profile", icon: FileCheck },
//         { name: 'Change Password', href: "/dashboard/profile/change-password", icon: Lock },
//       ]
//     },
//   ];

//   return items;
// }, [user]);




//   // Auto-expand parent if child is active
//   useEffect(() => {
//     const newOpenMenus = {};
//     menuItems.forEach(item => {
//       if (item.children) {
//         item.children.forEach(child => {
//           if (pathname.startsWith(child.href)) {
//             newOpenMenus[item.name] = true;
//           }
//         });
//       }
//     });
//     setOpenMenus(newOpenMenus);
//   }, [menuItems, pathname]);

//   // Fetch dashboard profile
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/getdashboardprofile`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(res.data);
//       } catch (err) {
//         console.error(err);
//         if (err?.response?.status === 401 || err?.response?.status === 403) {
//           localStorage.removeItem("token");
//           router.push("/login");
//         }
//       }
//     };
//     fetchProfile();
//   }, [router]);

//    // ✅ Logout handler
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     router.push("/login");
//   };

//   const toggleMenu = (name) => {
//     setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
//   }

//   const isActive = (href) => pathname === href;

//   return (
//     <div className={clsx('flex h-screen', darkMode ? 'dark' : '')}>

//       {/* Mobile Sidebar */}
//       <AnimatePresence>
//         {sidebarOpen && (
//           <>
//             <motion.div 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 0.5 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.2 }}
//               className="fixed inset-0 bg-black z-40 md:hidden"
//               onClick={() => setSidebarOpen(false)}
//             />
//             <motion.aside
//               initial={{ x: -260, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: -260, opacity: 0 }}
//               transition={{ type: 'spring', stiffness: 80, damping: 20 }}
//               className="fixed inset-y-0 left-0 z-50 bg-gray-800 text-white w-64 shadow-lg md:hidden"
//             >
//               <div className="flex items-center justify-between px-4 py-6 border-b border-gray-700">
//                 <span className="text-xl font-bold">Haat Seba</span>
//                 <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-gray-700">
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               {/* ✅ User Profile */}
//               {user && (
//                 <div className="flex flex-col items-center py-6 border-b border-gray-700">
//                   {user.image ? (
//                     <Image
//                       src={user.image}
//                       alt="Profile"
//                       width={64}
//                       height={64}
//                       className="w-16 h-16 rounded-full bg-gray-400 dark:bg-gray-600 mb-2"
//                       unoptimized
//                     />
//                   ) : (
//                     <User className="w-16 h-16 text-gray-400 mb-2" />
//                   )}
//                   <span className="font-semibold text-white">
//                     {user.firstName} {user.lastName}
//                   </span>
//                   <span className="text-sm text-gray-400">{user.email}</span>
//                 </div>
//               )}

//               {/* Menu */}
//               <nav className="mt-6 flex flex-col gap-1">
//                 {menuItems.map(item => (
//                   <div key={item.name} className="flex flex-col">
//                     {item.children ? (
//                       <>
//                         <button 
//                           onClick={() => toggleMenu(item.name)}
//                           className={clsx(
//                             'flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded w-full justify-between',
//                             openMenus[item.name] && 'bg-gray-700'
//                           )}
//                         >
//                           <div className="flex items-center gap-3">
//                             <item.icon className="w-5 h-5" />
//                             <span>{item.name}</span>
//                           </div>
//                           <ChevronDown className={clsx("w-4 h-4 transition-transform", openMenus[item.name] ? "rotate-180" : "")} />
//                         </button>
//                         <AnimatePresence>
//                           {openMenus[item.name] && (
//                             <motion.div
//                               initial={{ height: 0, opacity: 0 }}
//                               animate={{ height: 'auto', opacity: 1 }}
//                               exit={{ height: 0, opacity: 0 }}
//                               transition={{ duration: 0.2 }}
//                               className="flex flex-col pl-10 bg-gray-700"
//                             >
//                               {item.children.map(child => (
//                                 <Link 
//                                   key={child.name} 
//                                   href={child.href} 
//                                   className={clsx(
//                                     'py-2 hover:bg-gray-600 rounded px-2',
//                                     isActive(child.href) && 'bg-blue-600 font-semibold'
//                                   )}
//                                   onClick={() => setSidebarOpen(false)}
//                                 >
//                                   {child.name}
//                                 </Link>
//                               ))}
//                             </motion.div>
//                           )}
//                         </AnimatePresence>
//                       </>
//                     ) : (
//                       <Link href={item.href} className={clsx(
//                         'flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded',
//                         isActive(item.href) && 'bg-blue-600 font-semibold'
//                       )}>
//                         <item.icon className="w-5 h-5" />
//                         <span>{item.name}</span>
//                       </Link>
//                     )}
//                   </div>
//                 ))}
//               </nav>

//               {/* Mobile Logout */}
//               <div className="mt-6 px-4">
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center gap-3 w-full px-4 py-3 rounded hover:bg-red-600 bg-red-500 text-white"
//                 >
//                   <LogOut className="w-5 h-5" />
//                   <span className="font-medium">Logout</span>
//                 </button>
//               </div>

//             </motion.aside>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Desktop Sidebar */}
//       <motion.aside
//         initial={{ width: 80 }}
//         animate={{ width: sidebarHover ? 256 : 80 }}
//         transition={{ type: 'spring', stiffness: 90, damping: 20 }}
//         onMouseEnter={() => setSidebarHover(true)}
//         onMouseLeave={() => setSidebarHover(false)}
//         className="hidden md:flex flex-col bg-gray-800 text-white border-r border-gray-700 relative"
//       >
//         {/* Top Section */}
//         <div className="flex flex-col items-center border-b border-gray-700 px-4 py-6">
//           <motion.div className="flex items-center gap-2 mb-4 cursor-pointer">
//             <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
//               H
//             </div>
//             {sidebarHover && (
//               <motion.span
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="text-lg font-bold"
//               >
//                 Haat Seba
//               </motion.span>
//             )}
//           </motion.div>
//           {user && (
//             <div className="relative group w-full flex flex-col items-center">
//               {/* Profile Image */}
//               <motion.div
//                 whileHover={{ scale: 1.1 }}
//                 transition={{ type: "spring", stiffness: 120 }}
//                 className="mb-2 cursor-pointer"
//               >
//                 {user.image ? (
//                   <Image
//                     src={user.image}
//                     alt="Profile"
//                     width={40}
//                     height={40}
//                     className="w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-600"
//                   />
//                 ) : (
//                   <User className="w-10 h-10 text-gray-500" />
//                 )}
//               </motion.div>

//               {/* User Name + Email */}
//               {sidebarHover ? (
//                 <motion.div
//                   initial={{ opacity: 0, y: -5 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="text-center"
//                 >
//                   <span className="block text-white font-medium">
//                     {user.firstName} {user.lastName}
//                   </span>
//                   <span className="block text-gray-300 text-sm">{user.email}</span>
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   initial={{ opacity: 0, x: 10 }}
//                   whileHover={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.2 }}
//                   className="absolute left-full top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded shadow-lg whitespace-nowrap pointer-events-none z-50"
//                 >
//                   <div className="flex flex-col">
//                     <span className="font-medium">
//                       {user.firstName} {user.lastName}
//                     </span>
//                     <span className="text-gray-300 text-sm">{user.email}</span>
//                   </div>
//                 </motion.div>
//               )}
//             </div>
//           )}

//         </div>

//         {/* Menu */}
//         <nav className="mt-6 flex-1 flex flex-col gap-1">
//           {menuItems.map(item => (
//             <div key={item.name} className="relative group">
//               {item.children ? (
//                 <>
//                   <button 
//                     onClick={() => toggleMenu(item.name)}
//                     className={clsx(
//                       'flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded w-full justify-between',
//                       openMenus[item.name] && 'bg-gray-700'
//                     )}
//                   >
//                     <div className="flex items-center gap-3">
//                       <item.icon className="w-5 h-5" />
//                       <motion.span
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: sidebarHover ? 1 : 0 }}
//                         transition={{ duration: 0.2 }}
//                       >
//                         {item.name}
//                       </motion.span>
//                     </div>
//                     <ChevronDown className={clsx("w-4 h-4 transition-transform", openMenus[item.name] ? "rotate-180" : "")} />
//                   </button>
//                   <AnimatePresence>
//                     {openMenus[item.name] && (
//                       <motion.div
//                         initial={{ height: 0, opacity: 0 }}
//                         animate={{ height: 'auto', opacity: 1 }}
//                         exit={{ height: 0, opacity: 0 }}
//                         transition={{ duration: 0.2 }}
//                         className="flex flex-col pl-10 bg-gray-700"
//                       >
//                         {item.children.map(child => (
//                           <Link 
//                             key={child.name} 
//                             href={child.href} 
//                             className={clsx(
//                               'py-2 hover:bg-gray-600 rounded px-2',
//                               isActive(child.href) && 'bg-blue-600 font-semibold'
//                             )}
//                           >
//                             {child.name}
//                           </Link>
//                         ))}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </>
//               ) : (
//                 <Link href={item.href} className={clsx(
//                   'flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded',
//                   isActive(item.href) && 'bg-blue-600 font-semibold'
//                 )}>
//                   <item.icon className="w-5 h-5" />
//                   <motion.span
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: sidebarHover ? 1 : 0 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     {item.name}
//                   </motion.span>
//                 </Link>
//               )}
//             </div>
//           ))}

//           {/* Logout button as menu item */}
// <div className="mt-auto">
//   <motion.button
//     onClick={handleLogout}
//     className="flex items-center gap-3 w-full px-4 py-3 rounded hover:bg-red-600"
//   >
//     <LogOut className="w-5 h-5 flex-shrink-0 text-white" />
//     <motion.span
//       initial={{ opacity: 0 }}
//       animate={{ opacity: sidebarHover ? 1 : 0 }}
//       transition={{ duration: 0.2 }}
//       className="flex-1 text-white font-medium"
//     >
//       Logout
//     </motion.span>
//   </motion.button>
// </div>



//         </nav>

//         {/* Logout button */}
//         {/* <div className="mt-auto px-4 py-2">
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 w-full px-4 py-3 rounded hover:bg-red-600 bg-red-500 text-white"
//           >
//             <LogOut className="w-5 h-5" />
//             <span className="font-medium">Logout</span>
//           </button>
//         </div> */}

    

//       </motion.aside>

//       {/* Main Content */}
//       <div className="flex-1 bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
//         <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
//           <div className="flex items-center gap-2">
//             <button 
//               onClick={() => setSidebarOpen(true)} 
//               className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
//             >
//               <Menu className="w-6 h-6 text-gray-800 dark:text-gray-200" />
//             </button>
//             <Link href="/dashboard/marketplace/shop" className="flex items-center gap-2">
//               <h1 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200"> Haatseba </h1>
//             </Link>
//           </div>
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setDarkMode(!darkMode)}
//               className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
//             >
//               {darkMode 
//                 ? <Sun className="w-5 h-5 text-yellow-400" /> 
//                 : <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />}
//             </button>
//           </div>
//         </header>

//         <main className="flex-1 overflow-y-auto p-4 md:p-6">
//           {children}
//           <Toaster position="top-center" reverseOrder={false} />
//         </main>
//       </div>
//     </div>
//   );
// }
















'use client';

import axios from 'axios';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Boxes,
  Briefcase,
  ChevronDown,
  FileCheck,
  Gift,
  Lock,
  LogOut,
  Menu,
  Moon,
  Network,
  Package,
  Receipt,
  ShoppingCart,
  Store,
  Sun,
  Trophy,
  User,
  UserPlus,
  Wallet
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHover, setSidebarHover] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const [user, setUser] = useState(null);

  const pathname = usePathname();
  const router = useRouter();

  const menuItems = useMemo(() => {
    if (!user) return [];

    const isVendor = Boolean(user.isVendor);

    return [
      {
        name: 'Marketplace',
        icon: Store,
        children: [
          { name: 'My Shop', href: '/dashboard/marketplace/shop', icon: Receipt },
          { name: 'My Orders', href: '/dashboard/orders', icon: Receipt },
        ],
      },
      {
        name: 'MLM Integration',
        icon: Gift,
        children: [
          { name: 'Earnings & Network', href: '/dashboard', icon: Network },
          { name: 'Downline Tree', href: '/dashboard/downline', icon: Network },
          { name: 'My Referral', href: '/dashboard/my-referral', icon: Trophy },
          { name: 'Levels & Matrix', href: '/dashboard/levels&matrix', icon: FileCheck },
        ],
      },
      {
        name: 'Rewards Zone',
        icon: Trophy,
        children: [
          { name: 'My Rewards', href: '/dashboard/my-rewards', icon: Trophy },
          { name: 'My Claims', href: '/dashboard/my-rewards/claims', icon: FileCheck },
          { name: 'My Wallet', href: '/dashboard/withdraw/requests', icon: Wallet },
        ],
      },
      {
        name: 'Joining Products',
        icon: Package,
        children: [
          { name: 'Buy Joining Product', href: '/dashboard/agent/request', icon: ShoppingCart },
          { name: 'My Joining Stock', href: '/dashboard/agent/stock', icon: Boxes },
        ],
      },
      isVendor
        ? {
            name: 'Vendor Portal',
            icon: Briefcase,
            children: [
              { name: 'Add Product', href: '/dashboard/vendor/add-product', icon: ShoppingCart },
              { name: 'My Stock', href: '/dashboard/vendor/stock', icon: Boxes },
            ],
          }
        : {
            name: 'Become A Vendor',
            href: '/dashboard/vendor/request',
            icon: UserPlus,
          },
      {
        name: 'Profile Zone',
        icon: User,
        children: [
          { name: 'View Profile', href: '/dashboard/profile/view', icon: User },
          { name: 'Edit Profile', href: '/dashboard/profile/edit-profile', icon: FileCheck },
          { name: 'Change Password', href: '/dashboard/profile/change-password', icon: Lock },
        ],
      },
    ];
  }, [user]);

  // Auto-expand parent only if current route matches a child
  useEffect(() => {
    const newOpenMenus = {};
    menuItems.forEach(item => {
      if (item.children) {
        // Check if any child path is active
        const activeChild = item.children.find(child => pathname === child.href);
        if (activeChild) {
          newOpenMenus[item.name] = true;
        }
      }
    });
    setOpenMenus(newOpenMenus);
  }, [menuItems, pathname]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/getdashboardprofile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        if ([401, 403].includes(err?.response?.status)) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      }
    };
    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const toggleMenu = name => setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  const isActive = href => pathname === href;

  return (
    <div className={clsx('flex h-screen', darkMode && 'dark')}>
      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              className="fixed inset-y-0 left-0 z-50 bg-gray-800 text-white w-64 shadow-lg md:hidden flex flex-col"
            >
              {/* USER PROFILE */}
              {user && (
                <div className="flex flex-col items-center py-6 border-b border-gray-700">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt="Profile"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full mb-2"
                      unoptimized
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400 mb-2" />
                  )}
                  <span className="font-semibold">{user.firstName} {user.lastName}</span>
                  <span className="text-sm text-gray-400">{user.email}</span>
                </div>
              )}

              <nav className="flex-1 overflow-y-auto px-2 mt-2">
                {menuItems.map(item => (
                  <div key={item.name} className="mb-1">
                    {item.children ? (
                      <>
                        <button
                          onClick={() => toggleMenu(item.name)}
                          className={clsx(
                            'flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-700 transition',
                            openMenus[item.name] && 'bg-gray-700'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                          </div>
                          <ChevronDown
                            className={clsx(
                              'w-4 h-4 transition-transform',
                              openMenus[item.name] && 'rotate-180'
                            )}
                          />
                        </button>
                        {openMenus[item.name] && (
                          <div className="ml-4 mt-1 space-y-1">
                            {item.children.map(child => (
                              <Link
                                key={child.name}
                                href={child.href}
                                className={clsx(
                                  'block px-3 py-2 rounded-md text-sm hover:bg-gray-600 transition',
                                  isActive(child.href) && 'bg-blue-600'
                                )}
                                onClick={() => setSidebarOpen(false)}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={clsx(
                          'flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition',
                          isActive(item.href) && 'bg-blue-600'
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <div className="p-3 border-t border-gray-700">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-600 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <motion.aside
        initial={{ width: 80 }}
        animate={{ width: sidebarHover ? 256 : 80 }}
        transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
        className="hidden md:flex flex-col bg-gray-800 text-white border-r border-gray-700 h-screen"
      >
        {/* TOP */}
        <div className="sticky top-0 z-10 bg-gray-800 border-b border-gray-700 px-4 py-6 flex flex-col items-center">
          {user && (
            <div className="flex flex-col items-center text-center">
              {user.image ? (
                <Image
                  src={user.image}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full"
                  unoptimized
                />
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
              {sidebarHover && (
                <>
                  <span className="mt-2 font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs text-gray-400">{user.email}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* MENU */}
        <nav className="flex-1 overflow-y-auto px-2 mt-2">
          {menuItems.map(item => (
            <div key={item.name} className="mb-1">
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={clsx(
                      'flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-700 transition',
                      openMenus[item.name] && 'bg-gray-700'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {sidebarHover && <span>{item.name}</span>}
                    </div>
                    <ChevronDown
                      className={clsx(
                        'w-4 h-4 transition-transform',
                        openMenus[item.name] && 'rotate-180'
                      )}
                    />
                  </button>
                  {openMenus[item.name] && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map(child => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={clsx(
                            'block px-3 py-2 rounded-md text-sm hover:bg-gray-600 transition',
                            isActive(child.href) && 'bg-blue-600'
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition',
                    isActive(item.href) && 'bg-blue-600'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {sidebarHover && <span>{item.name}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-700 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            {sidebarHover && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
        <header className="flex justify-between items-center p-4 border-b bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Menu />
            </button>
            <Link href="/dashboard/marketplace/shop" className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              HaatSeba
            </Link>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
          <Toaster position="top-center" />
        </main>
      </div>
    </div>
  );
}
