"use client"
import { useState } from 'react';

const FaqSection = () => {
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);

  const faqs = [
    {
      question: 'How can I register?',
      answer: 'Click the Register button on the top right and fill out the simple registration form.',
    },
    {
      question: 'How can I view my deposit?',
      answer: 'After logging in, go to your dashboard. Your monthly deposit records will be displayed there.',
    },
    {
      question: 'How can I contact support?',
      answer: 'You can use our contact form from the footer or email us directly at support@example.com.',
    },
    // Add more FAQs as needed
  ];

  const toggleQuestion = (index) => {
    if (openQuestionIndex === index) {
      setOpenQuestionIndex(null);
    } else {
      setOpenQuestionIndex(index);
    }
  };

  return (
    <section className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
        <div className="mt-6 space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b-2 border-gray-200 pb-4">
              <button
                className="w-full text-left flex justify-between items-center text-lg font-medium text-gray-900"
                onClick={() => toggleQuestion(index)}
              >
                {faq.question}
                <span className="ml-2">{openQuestionIndex === index ? '-' : '+'}</span>
              </button>
              {openQuestionIndex === index && (
                <p className="mt-4 text-gray-700">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;




// // components/home/FAQSection.js
// 'use client';

// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronDown } from 'lucide-react';

// const faqs = [
//   {
//     question: "How can I register?",
//     answer: "Click the 'Register' button on the top right and fill out the simple registration form.",
//   },
//   {
//     question: "How can I view my deposit?",
//     answer: "After logging in, go to your dashboard. Your monthly deposit records will be displayed there.",
//   },
//   {
//     question: "How can I contact support?",
//     answer: "You can use our contact form from the footer or email us directly at support@example.com.",
//   },
// ];

// export default function FAQSection() {
//   const [openIndex, setOpenIndex] = useState(null);

//   const toggle = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <motion.h2
//           className="text-4xl font-bold text-center text-gray-800 mb-10"
//           initial={{ opacity: 0, y: -20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//         >
//           Frequently Asked <span className="text-blue-600">Questions</span>
//         </motion.h2>

//         <div className="space-y-4">
//           {faqs.map((faq, index) => (
//             <div key={index} className="border border-gray-200 rounded-xl bg-white shadow-md">
//               <button
//                 className="flex items-center justify-between w-full px-6 py-4 text-left"
//                 onClick={() => toggle(index)}
//               >
//                 <span className="text-lg font-medium text-gray-800">{faq.question}</span>
//                 <motion.div
//                   animate={{ rotate: openIndex === index ? 180 : 0 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <ChevronDown className="w-5 h-5 text-gray-500" />
//                 </motion.div>
//               </button>

//               <AnimatePresence initial={false}>
//                 {openIndex === index && (
//                   <motion.div
//                     className="px-6 pb-4 text-gray-600"
//                     key="content"
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: "auto" }}
//                     exit={{ opacity: 0, height: 0 }}
//                     transition={{ duration: 0.4 }}
//                   >
//                     <p>{faq.answer}</p>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
