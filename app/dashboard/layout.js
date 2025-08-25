// 'use client';

// import clsx from 'clsx';
// import { AnimatePresence, motion } from 'framer-motion';
// import { CreditCard, FileText, Home, Menu, Moon, Sun, Upload, User, X } from 'lucide-react';
// import Link from 'next/link';
// import { useState } from 'react';

// export default function DashboardLayout({ children }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile
//   const [sidebarHover, setSidebarHover] = useState(false); // Desktop hover
//   const [darkMode, setDarkMode] = useState(false);

//   const menuItems = [
//     { name: 'Dashboard', href: '/dashboard', icon: Home },
//     { name: 'Deposit', href: '/dashboard/deposit', icon: CreditCard },
//     { name: 'Withdraw', href: '/dashboard/withdraw', icon: Upload },
//     { name: 'Transactions', href: '/dashboard/transactions', icon: FileText },
//     { name: 'Profile', href: '/dashboard/profile', icon: User },
//   ];

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
//                 <span className="text-xl font-bold">MyMLM</span>
//                 <button 
//                   onClick={() => setSidebarOpen(false)} 
//                   className="p-1 rounded hover:bg-gray-700"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//               <nav className="mt-6 space-y-1">
//                 {menuItems.map((item) => (
//                   <Link 
//                     key={item.name} 
//                     href={item.href} 
//                     className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition rounded"
//                     onClick={() => setSidebarOpen(false)}
//                   >
//                     <item.icon className="w-5 h-5" />
//                     <span>{item.name}</span>
//                   </Link>
//                 ))}
//               </nav>
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
//         {/* Top Section: Logo + User */}
//         <div className="flex flex-col items-center border-b border-gray-700 px-4 py-6">
//           {/* Logo */}
//           <motion.div
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 0.3 }}
//             className="flex items-center gap-2 mb-4 cursor-pointer"
//           >
//             <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
//               M
//             </div>
//             {sidebarHover && (
//               <motion.span
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="text-lg font-bold"
//               >
//                 MyMLM
//               </motion.span>
//             )}
//           </motion.div>

//           {/* User Avatar */}
//           <div className="relative group w-full flex flex-col items-center">
//             <motion.div
//               className="w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-600 mb-2 cursor-pointer"
//               whileHover={{ scale: 1.1 }}
//               transition={{ type: 'spring', stiffness: 120 }}
//             />
//             {sidebarHover ? (
//               <motion.span
//                 initial={{ opacity: 0, y: -5 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="text-white font-medium"
//               >
//                 Syed Rana
//               </motion.span>
//             ) : (
//               // Tooltip
//               <motion.div
//                 initial={{ opacity: 0, x: 10 }}
//                 whileHover={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="absolute left-full top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-50"
//               >
//                 Syed Rana
//               </motion.div>
//             )}
//           </div>
//         </div>

//         {/* Menu Items */}
//         <nav className="mt-6 flex-1 flex flex-col gap-1">
//           {menuItems.map((item) => (
//             <div key={item.name} className="relative group">
//               <Link 
//                 href={item.href} 
//                 className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition rounded"
//               >
//                 <item.icon className="w-5 h-5" />
//                 <motion.span
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: sidebarHover ? 1 : 0 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   {item.name}
//                 </motion.span>
//               </Link>
//               {!sidebarHover && (
//                 <motion.div
//                   initial={{ opacity: 0, x: 10 }}
//                   whileHover={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.2 }}
//                   className="absolute left-full top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-50"
//                 >
//                   {item.name}
//                 </motion.div>
//               )}
//             </div>
//           ))}
//         </nav>
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
//             <h1 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
//               Dashboard
//             </h1>
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
//         </main>
//       </div>
//     </div>
//   );
// }






















// 'use client';

// import clsx from 'clsx';
// import { AnimatePresence, motion } from 'framer-motion';
// import { ChevronDown, CreditCard, FileText, Home, Menu, Moon, Sun, User, X } from 'lucide-react';
// import Link from 'next/link';
// import { useState } from 'react';

// export default function DashboardLayout({ children }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile
//   const [sidebarHover, setSidebarHover] = useState(false); // Desktop hover
//   const [darkMode, setDarkMode] = useState(false);
//   const [openMenus, setOpenMenus] = useState({}); // Track which parent menus are open

//   // Nested menu structure
//   const menuItems = [
//     { name: 'Dashboard', href: '/dashboard', icon: Home },
//     { 
//       name: 'Finance', 
//       icon: CreditCard,
//       children: [
//         { name: 'Deposit', href: '/dashboard/deposit' },
//         { name: 'Withdraw', href: '/dashboard/withdraw' },
//       ]
//     },
//     { name: 'Transactions', href: '/dashboard/transactions', icon: FileText },
//     { name: 'Profile', href: '/dashboard/profile', icon: User },
//   ];

//   const toggleMenu = (name) => {
//     setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
//   }

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
//               {/* Top Section */}
//               <div className="flex items-center justify-between px-4 py-6 border-b border-gray-700">
//                 <span className="text-xl font-bold">MyMLM</span>
//                 <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-gray-700">
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               {/* Menu */}
//               <nav className="mt-6 flex flex-col gap-1">
//                 {menuItems.map(item => (
//                   <div key={item.name} className="flex flex-col">
//                     {item.children ? (
//                       <>
//                         <button 
//                           onClick={() => toggleMenu(item.name)}
//                           className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded w-full justify-between"
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
//                                   className="py-2 hover:bg-gray-600 rounded px-2"
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
//                       <Link href={item.href} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded">
//                         <item.icon className="w-5 h-5" />
//                         <span>{item.name}</span>
//                       </Link>
//                     )}
//                   </div>
//                 ))}
//               </nav>
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
//               M
//             </div>
//             {sidebarHover && (
//               <motion.span
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="text-lg font-bold"
//               >
//                 MyMLM
//               </motion.span>
//             )}
//           </motion.div>
//           <div className="relative group w-full flex flex-col items-center">
//             <motion.div
//               className="w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-600 mb-2 cursor-pointer"
//               whileHover={{ scale: 1.1 }}
//               transition={{ type: 'spring', stiffness: 120 }}
//             />
//             {sidebarHover ? (
//               <motion.span
//                 initial={{ opacity: 0, y: -5 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="text-white font-medium"
//               >
//                 Syed Rana
//               </motion.span>
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0, x: 10 }}
//                 whileHover={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="absolute left-full top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-50"
//               >
//                 Syed Rana
//               </motion.div>
//             )}
//           </div>
//         </div>

//         {/* Menu */}
//         <nav className="mt-6 flex-1 flex flex-col gap-1">
//           {menuItems.map(item => (
//             <div key={item.name} className="relative group">
//               {item.children ? (
//                 <>
//                   <button 
//                     onClick={() => toggleMenu(item.name)}
//                     className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded w-full justify-between"
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
//                             className="py-2 hover:bg-gray-600 rounded px-2"
//                           >
//                             {child.name}
//                           </Link>
//                         ))}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </>
//               ) : (
//                 <Link href={item.href} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded">
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
//         </nav>
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
//             <h1 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
//               Dashboard
//             </h1>
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
//         </main>
//       </div>
//     </div>
//   );
// }




















'use client';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, CreditCard, FileText, Home, Menu, Moon, Sun, User, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHover, setSidebarHover] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [openMenus, setOpenMenus] = useState({});

  const pathname = usePathname(); // Next.js hook for current route

  // Nested menu structure
  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { 
      name: 'Finance', 
      icon: CreditCard,
      children: [
        { name: 'Deposit', href: '/dashboard/deposit' },
        { name: 'Withdraw', href: '/dashboard/withdraw' },
      ]
    },
    { name: 'Transactions', href: '/dashboard/transactions', icon: FileText },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  // Auto-expand parent if child is active
  useEffect(() => {
    const newOpenMenus = {};
    menuItems.forEach(item => {
      if (item.children) {
        item.children.forEach(child => {
          if (pathname.startsWith(child.href)) {
            newOpenMenus[item.name] = true;
          }
        });
      }
    });
    setOpenMenus(newOpenMenus);
  }, [pathname]);

  const toggleMenu = (name) => {
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  }

  const isActive = (href) => pathname === href;

  return (
    <div className={clsx('flex h-screen', darkMode ? 'dark' : '')}>

      {/* Mobile Sidebar */}
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
              initial={{ x: -260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -260, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              className="fixed inset-y-0 left-0 z-50 bg-gray-800 text-white w-64 shadow-lg md:hidden"
            >
              <div className="flex items-center justify-between px-4 py-6 border-b border-gray-700">
                <span className="text-xl font-bold">MyMLM</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Menu */}
              <nav className="mt-6 flex flex-col gap-1">
                {menuItems.map(item => (
                  <div key={item.name} className="flex flex-col">
                    {item.children ? (
                      <>
                        <button 
                          onClick={() => toggleMenu(item.name)}
                          className={clsx(
                            'flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded w-full justify-between',
                            openMenus[item.name] && 'bg-gray-700'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                          </div>
                          <ChevronDown className={clsx("w-4 h-4 transition-transform", openMenus[item.name] ? "rotate-180" : "")} />
                        </button>
                        <AnimatePresence>
                          {openMenus[item.name] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex flex-col pl-10 bg-gray-700"
                            >
                              {item.children.map(child => (
                                <Link 
                                  key={child.name} 
                                  href={child.href} 
                                  className={clsx(
                                    'py-2 hover:bg-gray-600 rounded px-2',
                                    isActive(child.href) && 'bg-blue-600 font-semibold'
                                  )}
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link href={item.href} className={clsx(
                        'flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded',
                        isActive(item.href) && 'bg-blue-600 font-semibold'
                      )}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ width: 80 }}
        animate={{ width: sidebarHover ? 256 : 80 }}
        transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
        className="hidden md:flex flex-col bg-gray-800 text-white border-r border-gray-700 relative"
      >
        {/* Top Section */}
        <div className="flex flex-col items-center border-b border-gray-700 px-4 py-6">
          <motion.div className="flex items-center gap-2 mb-4 cursor-pointer">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              M
            </div>
            {sidebarHover && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="text-lg font-bold"
              >
                MyMLM
              </motion.span>
            )}
          </motion.div>
          <div className="relative group w-full flex flex-col items-center">
            <motion.div
              className="w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-600 mb-2 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 120 }}
            />
            {sidebarHover ? (
              <motion.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-white font-medium"
              >
                Syed Rana
              </motion.span>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute left-full top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-50"
              >
                Syed Rana
              </motion.div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="mt-6 flex-1 flex flex-col gap-1">
          {menuItems.map(item => (
            <div key={item.name} className="relative group">
              {item.children ? (
                <>
                  <button 
                    onClick={() => toggleMenu(item.name)}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded w-full justify-between',
                      openMenus[item.name] && 'bg-gray-700'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: sidebarHover ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name}
                      </motion.span>
                    </div>
                    <ChevronDown className={clsx("w-4 h-4 transition-transform", openMenus[item.name] ? "rotate-180" : "")} />
                  </button>
                  <AnimatePresence>
                    {openMenus[item.name] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col pl-10 bg-gray-700"
                      >
                        {item.children.map(child => (
                          <Link 
                            key={child.name} 
                            href={child.href} 
                            className={clsx(
                              'py-2 hover:bg-gray-600 rounded px-2',
                              isActive(child.href) && 'bg-blue-600 font-semibold'
                            )}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link href={item.href} className={clsx(
                  'flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded',
                  isActive(item.href) && 'bg-blue-600 font-semibold'
                )}>
                  <item.icon className="w-5 h-5" />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: sidebarHover ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.name}
                  </motion.span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Menu className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {darkMode 
                ? <Sun className="w-5 h-5 text-yellow-400" /> 
                : <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}



















// 'use client';

// import clsx from 'clsx';
// import { CreditCard, FileText, Home, Moon, Sun, Upload, User, Menu, X, ChevronDown } from 'lucide-react';
// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { usePathname } from 'next/navigation';

// export default function DashboardLayout({ children }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [sidebarHover, setSidebarHover] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [openMenus, setOpenMenus] = useState({});
//   const pathname = usePathname();

//   const menuItems = [
//     { name: 'Dashboard', href: '/dashboard', icon: Home },
//     { 
//       name: 'Finance', 
//       icon: CreditCard,
//       children: [
//         { name: 'Deposit', href: '/dashboard/deposit' },
//         { name: 'Withdraw', href: '/dashboard/withdraw' },
//       ]
//     },
//     { name: 'Transactions', href: '/dashboard/transactions', icon: FileText },
//     { name: 'Profile', href: '/dashboard/profile', icon: User },
//   ];

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
//   }, [pathname]);

//   const toggleMenu = (name) => {
//     setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
//   }

//   const isActive = (href) => pathname === href;

//   return (
//     <div className={clsx('flex h-screen', darkMode ? 'dark' : '')}>
      
//       {/* Mobile Overlay */}
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
//               initial={{ x: -260 }}
//               animate={{ x: 0 }}
//               exit={{ x: -260 }}
//               drag="x"
//               dragConstraints={{ left: -260, right: 0 }}
//               dragElastic={0.2}
//               onDragEnd={(event, info) => {
//                 if (info.point.x < 120) setSidebarOpen(false);
//               }}
//               transition={{ type: 'spring', stiffness: 80, damping: 20 }}
//               className="fixed inset-y-0 left-0 z-50 bg-gray-800 text-white w-64 shadow-lg md:hidden"
//             >
//               <div className="flex items-center justify-between px-4 py-6 border-b border-gray-700">
//                 <span className="text-xl font-bold">MyMLM</span>
//                 <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-gray-700">
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//               <nav className="mt-6 flex flex-col gap-1">
//                 {menuItems.map(item => (
//                   <div key={item.name}>
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
//         {/* Logo & User */}
//         <div className="flex flex-col items-center border-b border-gray-700 px-4 py-6">
//           <motion.div className="flex items-center gap-2 mb-4 cursor-pointer">
//             <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
//               M
//             </div>
//             {sidebarHover && (
//               <motion.span
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="text-lg font-bold"
//               >
//                 MyMLM
//               </motion.span>
//             )}
//           </motion.div>
//           <div className="relative group w-full flex flex-col items-center">
//             <motion.div
//               className="w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-600 mb-2 cursor-pointer"
//               whileHover={{ scale: 1.1 }}
//               transition={{ type: 'spring', stiffness: 120 }}
//             />
//             {/* Tooltip */}
//             {!sidebarHover && (
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 whileHover={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="absolute left-full top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-50"
//               >
//                 Syed Rana
//               </motion.div>
//             )}
//             {sidebarHover && (
//               <motion.span
//                 initial={{ opacity: 0, y: -5 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="text-white font-medium"
//               >
//                 Syed Rana
//               </motion.span>
//             )}
//           </div>
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
//                   'flex items-center gap-3 px-4 py-3 hover:bg-gray-700 rounded group',
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
//                   {/* Tooltip */}
//                   {!sidebarHover && (
//                     <motion.div
//                       initial={{ opacity: 0, x: -10 }}
//                       whileHover={{ opacity: 1, x: 0 }}
//                       transition={{ duration: 0.2 }}
//                       className="absolute left-full top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-50"
//                     >
//                       {item.name}
//                     </motion.div>
//                   )}
//                 </Link>
//               )}
//             </div>
//           ))}
//         </nav>
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
//             <h1 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
//               Dashboard
//             </h1>
//           </div>
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setDarkMode(!darkMode)}
//               className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
//             >
//               {darkMode 
//                 ? <Sun className="w-5 h-5 text-yellow-400" /> 
//                 : <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200 />}
//             </button>
//           </div>
//         </header>

//         <main className="flex-1 overflow-y-auto p-4 md:p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

