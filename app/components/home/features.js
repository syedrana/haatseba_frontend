// components/home/WhyChooseUs.js
'use client';

import { ShieldCheck, Smartphone, ThumbsUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <ShieldCheck className="w-10 h-10 text-blue-500" />,
    title: "Secure & Reliable",
    desc: "We use encrypted data storage to keep your deposit records safe.",
  },
  {
    icon: <Zap className="w-10 h-10 text-yellow-500" />,
    title: "Fast Support",
    desc: "Our team is always ready to help you anytime you need.",
  },
  {
    icon: <ThumbsUp className="w-10 h-10 text-green-500" />,
    title: "User-Friendly",
    desc: "Simple interface that anyone can use without confusion.",
  },
  {
    icon: <Smartphone className="w-10 h-10 text-pink-500" />,
    title: "Mobile Friendly",
    desc: "Works perfectly on any device, anytime, anywhere.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative bg-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Floating graphics */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full opacity-40 filter blur-3xl animate-pulse -z-10" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-100 rounded-full opacity-40 filter blur-2xl animate-ping -z-10" />

      {/* Header */}
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Why Choose <span className="text-blue-600">Us?</span>
      </motion.h2>

      <motion.p
        className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        We provide the best services to make your deposit tracking experience smooth and reliable.
      </motion.p>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 text-center hover:scale-105 hover:shadow-2xl transition duration-300 ease-in-out"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-4">
              {item.icon}
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h4>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Bottom SVG Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180 -z-10">
        <svg
          className="relative block w-full h-20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M321.39 56.09c-58.56 18.27-116.79 27.39-175.36 8.1C86.15 44.34 28.74-25.74 0 6.48v113.52h1200V0c-36.36 28.2-74.33 49.6-114.64 62.95-82.82 26.35-168.51 7.87-247.36-15.19C730.44 24.84 649.38-10.3 568.7 1.34 497.56 11.9 435.11 37.64 369.66 50.82 353.34 54.28 337.05 54.94 321.39 56.09z"
            fill="#f3f4f6"
          ></path>
        </svg>
      </div>
    </section>
  );
}
