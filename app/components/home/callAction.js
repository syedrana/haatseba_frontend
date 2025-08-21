'use client';

import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { useState } from 'react';

export default function ContactSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    message: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateMobile = (mobile) => {
    const regex = /^\+8801[0-9]{9}$/;
    return regex.test(mobile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setStatus('loading');

    if (!form.name.trim()) {
      setErrorMessage('Please enter your name.');
      setStatus('error');
      return;
    }

    if (!validateEmail(form.email)) {
      setErrorMessage('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    if (!validateMobile(form.mobile)) {
      setErrorMessage('Please enter a valid mobile number in +8801XXXXXXXXX format.');
      setStatus('error');
      return;
    }

    if (!form.message.trim() || form.message.trim().length < 10) {
      setErrorMessage('Message must be at least 10 characters long.');
      setStatus('error');
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/contact`, form, {
        headers: {
          Authorization: '1234567890',
        },
      });

      
      setForm({ name: '', email: '', mobile: '', message: '' });
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Get in Touch</h2>
          <p className="text-gray-600 mb-4">
            We'd love to hear from you! Reach out through the form or use the contact info below.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="text-blue-600" />
              <span>+880 1234-567890</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="text-blue-600" />
              <span>trust1xdps@gmail.com</span>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-gray-50 rounded-xl shadow-lg p-8 space-y-6"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {errorMessage && (
            <div className="text-red-600 text-center font-medium">{errorMessage}</div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
              Your Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="+8801000000000"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'success' && (
            <p className="text-green-600 text-sm text-center mt-2">
              Your message was sent successfully!
            </p>
          )}
          {status === 'error' && (
            <p className="text-red-600 text-sm text-center mt-2">
              Something went wrong. Please try again later.
            </p>
          )}

        </motion.form>
      </div>
    </section>
  );
}
