'use client';

import { motion } from 'framer-motion';
import { UserPlus, ShieldCheck, CalendarCheck, PencilRuler } from 'lucide-react';

const features = [
  {
    title: 'Easy Registration & Login',
    description: 'Create an account in just a few steps and login easily.',
    icon: <UserPlus className="w-8 h-8 text-blue-600" />,
  },
  {
    title: 'Monthly Deposit Tracking',
    description: 'Keep accurate records of your savings every month.',
    icon: <CalendarCheck className="w-8 h-8 text-blue-600" />,
  },
  {
    title: 'Secure Data Storage',
    description: 'All your data is encrypted and stored securely.',
    icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
  },
  {
    title: 'Manual Admin Entry',
    description: 'Deposits are verified and managed by the admin.',
    icon: <PencilRuler className="w-8 h-8 text-blue-600" />,
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6 lg:px-12 text-center">
        <motion.h2
          className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Services
        </motion.h2>
        <p className="text-gray-600 text-lg mb-12">
          A simple, secure, and efficient system for all users
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-blue-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
