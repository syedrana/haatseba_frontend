"use client";

import { Facebook, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-gray-300 py-12 relative overflow-hidden">
      {/* Glow Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-cyan-500/10 to-orange-500/10 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* HaatSheba Section */}
          <div>
            <Link href="/">
              <h1 className="text-3xl font-extrabold text-orange-600">
                HaatSeba
              </h1>
            </Link>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Your trusted online livestock marketplace. 
              Find cows, goats, camels and safe transportation services all in one place.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <p className="flex items-center text-sm mb-3">
              <MapPin className="w-4 h-4 text-orange-500 mr-2" />
              190/A/1A East Rampura, Dhaka 1219
            </p>
            <p className="flex items-center text-sm mb-3">
              <Mail className="w-4 h-4 text-orange-500 mr-2" />
              <a
                href="mailto:haatseba@gmail.com"
                className="hover:text-cyan-400 transition"
              >
                haatseba@gmail.com
              </a>
            </p>
            <p className="flex items-center text-sm">
              <Phone className="w-4 h-4 text-orange-500 mr-2" />
              +8801986878899
            </p>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-5">
              <Link
                href="https://facebook.com"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-lg shadow-cyan-400/60 hover:shadow-cyan-400/90 hover:scale-110 transition transform"
              >
                <Facebook className="w-6 h-6" />
              </Link>
              <Link
                href="https://twitter.com"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 text-white shadow-lg shadow-cyan-400/60 hover:shadow-cyan-400/90 hover:scale-110 transition transform"
              >
                <Twitter className="w-6 h-6" />
              </Link>
              <Link
                href="https://linkedin.com"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/60 hover:shadow-orange-500/90 hover:scale-110 transition transform"
              >
                <Linkedin className="w-6 h-6" />
              </Link>
              <Link
                href="https://youtube.com"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg shadow-red-500/60 hover:shadow-red-500/90 hover:scale-110 transition transform"
              >
                <Youtube className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-gray-700 pt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            © 2025 HaatSeba. All rights reserved.
          </p>
          <div className="mt-3 flex justify-center space-x-4 text-sm">
            <Link
              href="#"
              className="hover:text-orange-400 hover:underline transition"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-500">|</span>
            <Link
              href="#"
              className="hover:text-cyan-400 hover:underline transition"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
