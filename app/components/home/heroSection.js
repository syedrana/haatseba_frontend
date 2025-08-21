// pages/index.js
// import Image from 'next/image';

// export default function Hero() {
//   return (
//     <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between py-24 px-4 sm:px-6 lg:px-8">
//             <div className="md:w-1/2 text-center md:text-left">
//                 <h1 className="text-5xl md:text-8xl font-extrabold mb-4 text-white">
//                     Learn. Grow. Succeed.
//                 </h1>
//                 <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight">
//                     Empower Your Future with Cutting-edge Tech Skills
//                 </h2>
//                 <p className="mt-4 text-lg sm:text-xl">
//                     Join our comprehensive training programs and start your journey towards a successful tech career.
//                 </p>
//                 <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start">
//                     <a
//                     href="#courses"
//                     className="inline-block bg-white text-blue-800 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-200 hover:scale-105 transition-transform mb-4 sm:mb-0 sm:mr-4"
//                     >
//                     Explore Courses
//                     </a>
//                     <a
//                     href="#contact"
//                     className="inline-block bg-transparent border-2 border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-blue-800 transition-all"
//                     >
//                     Contact Us
//                     </a>
//                 </div>
//             </div>
//             <div className="md:w-1/2 mt-8 md:mt-0 flex justify-end">
//                 <Image
//                     src="/doller.png"
//                     alt="Tech Training"
//                     width={400}
//                     height={250}
//                     className="rounded-lg transform hover:scale-105 transition-transform"
//                 />
//             </div>
//         </div>    
//     </div>

//   );
// }





// 'use client';

// import { Button } from "@/components/ui/button";
// import { ArrowRight } from "lucide-react";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <section className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white flex items-center justify-center px-6">
//       <div className="max-w-4xl text-center">
//         <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
//           Your Trusted <span className="text-yellow-400">Deposit Tracker</span>
//         </h1>
//         <p className="text-lg md:text-xl mb-8 text-gray-300">
//           Manage your deposits securely, easily and efficiently.
//         </p>

//         <div className="flex flex-wrap justify-center gap-4">
//           <Link href="/register">
//             <Button className="bg-yellow-400 text-black hover:bg-yellow-300 text-lg px-6 py-4 rounded-full shadow-xl">
//               Register
//             </Button>
//           </Link>

//           <Link href="/login">
//             <Button variant="outline" className="border-white text-white text-lg px-6 py-4 rounded-full hover:bg-white hover:text-black transition-all">
//               Login
//             </Button>
//           </Link>

//           <Link href="/#how-it-works">
//             <Button variant="ghost" className="text-white flex items-center gap-2 text-lg hover:text-yellow-300">
//               Learn More <ArrowRight className="w-5 h-5" />
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }


// 'use client';

// import { motion } from "framer-motion";
// import Link from "next/link";
// import Image from "next/image";

// export default function HeroSection() {
//   return (
//     <section className="relative bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white overflow-hidden min-h-screen flex items-center justify-center px-6 py-12">
//       {/* Decorative background shapes */}
//       <div className="absolute inset-0 opacity-20 z-0">
//         <Image
//           src=""
//           alt="Background Pattern"
//           layout="fill"
//           objectFit="cover"
//           className="pointer-events-none"
//         />
//       </div>

//       <div className="relative z-10 max-w-6xl mx-auto text-center">
//         {/* Animated Heading */}
//         <motion.h1
//           initial={{ y: -40, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 1 }}
//           className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
//         >
//           Track & Manage Your{" "}
//           <span className="text-yellow-400">Deposits</span> Seamlessly
//         </motion.h1>

//         {/* Subtitle */}
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5, duration: 1 }}
//           className="text-lg md:text-xl text-gray-200 mb-10"
//         >
//           Your smart and secure way to monitor savings, track payments, and manage finances — all in one place.
//         </motion.p>

//         {/* CTA Buttons */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.9, duration: 1 }}
//           className="flex flex-wrap justify-center gap-4"
//         >
//           <Link href="/register">
//             <button className="bg-yellow-400 text-black hover:bg-yellow-300 text-lg px-6 py-3 rounded-full shadow-lg transition">
//               Get Started
//             </button>
//           </Link>
//           <Link href="/login">
//             <button className="border border-white text-white text-lg px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
//               Login
//             </button>
//           </Link>
//         </motion.div>
//       </div>

//       {/* Hero Image */}
//       <motion.div
//         initial={{ scale: 0.8, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ delay: 1.2, duration: 1 }}
//         className="absolute bottom-0 right-0 hidden md:block"
//       >
//         <Image
//           src="/hero.png"
//           alt="Deposit Illustration"
//           width={500}
//           height={500}
//           className="object-contain"
//         />
//       </motion.div>
//     </section>
//   );
// }




// app/components/home/HeroSection.jsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-white via-blue-50 to-white overflow-hidden pt-20">
      {/* Background Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 z-0">
        <svg
          className="relative block w-full h-[100px]"
          xmlns="/hero.png"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M321.39 56.44C180.39 77.44 0 22 0 22v98h1200V0c0 0-103.77 52.94-221.36 60.4-88.56 5.74-176.93-26.04-251.79-42.13C569.6 1.94 478.61 35.34 321.39 56.44z"
            fill="#eff6ff"
          />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-20 pb-28 flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        {/* Text Content */}
        <motion.div
          className="text-center lg:text-left max-w-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Your         <span className="text-blue-600">Trusted</span> Deposit Tracker
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Manage your deposits securely, easily and efficiently.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 transition-all shadow-md"
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-block text-blue-600 font-semibold hover:underline"
            >
              Already have an account?
            </Link>
          </div>
        </motion.div>

        {/* Image Illustration with float animation */}
        <motion.div
          className="w-full max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 4,
              ease: 'easeInOut',
            }}
          >
            <Image
              src="/hero.png"
              alt="Deposit Illustration"
              width={600}
              height={400}
              className="w-full h-auto drop-shadow-xl"
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
