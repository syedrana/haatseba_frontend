// components/Footer.js
"use client";  // This makes the component a Client Component

import Image from 'next/image'; // Correctly import the Next.js Image component
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-cyan-50 py-10 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Logo and Description */}
          <div>
            <Image src="/trust1x.png" alt="Trust1x Logo" width={100} height={100} />
            <p className="mt-4 text-xs sm:text-sm">
              Feel free to contact us for any inquiries or assistance. Our dedicated team is here to support you on your learning journey.
            </p>
            <p className="mt-4 text-xs sm:text-sm">Trade-License : TRAD/DNCC/043784/2023</p>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-sm sm:text-lg font-bold mb-4">Find Us</h3>
            <p className="text-xs sm:text-sm">
              Address: 190/A/1A East Rampura, Dhaka 1219
            </p>
            <p className="text-xs sm:text-sm mt-2">
              Email: <a href="mailto:info@trust1xdps.com" className="text-blue-400">info@trust1xdps.com</a>
            </p>
            <p className="text-xs sm:text-sm mt-2">
              Phone: +8801986878899
            </p>
          </div>
          
          {/* Social Media and Links */}
          <div>
            <h3 className="text-sm sm:text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="https://facebook.com">
                <span className="text-blue-400 hover:text-white">Facebook</span>
              </Link>
            </div>
          </div>

        </div>

        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-xs sm:text-sm">
          © 2024 AI Point. All rights reserved.
          <div className="mt-4">
            <Link href="/privacy-policy">
              Privacy Policy
            </Link>
            <span className="mx-2">|</span>
            <Link href="/terms-of-service">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
