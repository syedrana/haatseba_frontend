'use client';

//import Cookies from 'js-cookie';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
//import { destroyCookie } from 'nookies';
import { useState } from 'react';
//import { isTokenValid } from "../utils/auth";

const Navbar = () => {
  const pathname = usePathname();
  // const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false);

  // useEffect(() => {
  //   const checkLoginStatus = () => {
  //     const token = localStorage.getItem("token");
  //     const role = localStorage.getItem('userRole');
  //     if (token && isTokenValid()) {
  //       setIsLoggedIn(true);
  //       setIsAdmin(role === 'admin');
  //     } else {
  //       setIsLoggedIn(false);
  //       setIsAdmin(false);
  //       localStorage.removeItem("token");
  //       localStorage.removeItem("userRole");
  //     } 
  //   };
  //   if (pathname) {
  //     checkLoginStatus();
  //   }
  //   // Listen to storage events (e.g., logout in another tab)
  //   const handleStorageChange = () => checkLoginStatus();
  //   window.addEventListener("storage", handleStorageChange);

  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, [pathname]);

  // const handleLogout = () => {
  //   const role = Cookies.get('userRole') || localStorage.getItem('userRole');

  //   localStorage.removeItem('token');
  //   localStorage.removeItem('userRole');
  //   Cookies.remove('access_token');
  //   Cookies.remove('userRole');
  //   destroyCookie(null, 'access_token', { path: '/' });
  //   destroyCookie(null, 'userRole', { path: '/' });

  //   if (role === 'admin') {
  //     window.location.href = '/adminur'; // অ্যাডমিন লগআউট হলে এ্যাডমিন লগইন পেজে যাবে
  //   } else {
  //     window.location.href = '/login'; // সাধারন ইউজার হলে নরমাল লগইন পেজে যাবে
  //   }
  // };

  const createWaveEffect = (text) =>
    text.split('').map((char, index) => (
      <span
        key={index}
        className="inline-block hover:animate-hoverWave"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {char}
      </span>
    ));

  return (
    <nav className="Text-sm sm:text-sm bg-white fixed top-0 left-0 w-full shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              href={
                isLoggedIn
                  ? isAdmin
                    ? '/adminur/overview'
                    : '/dashboard'
                  : '/'
              }
            >
              {/* <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72">
                <Image
                  src="/vercel.svg"
                  alt="Logo"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 200px"
                  className="object-contain"
                  priority={true}
                />
              </div> */}
              {/* <Image src="/trust1x.png" alt="Trust1x Logo" width={100} height={100} /> */}
              <h1 className="text-4xl">Haat Seba</h1>
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 ">
            {isLoggedIn ? (
              isAdmin ? (
                <>
                  <Link
                    href="/adminur/overview"
                    className={`relative group ${
                      pathname === '/adminur/overview'
                        ? 'text-blue-500'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="relative z-10">
                      {createWaveEffect('Overview')}
                    </span>
                    <span
                      className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                        pathname === '/adminur/overview' ? 'w-full' : ''
                      }`}
                    ></span>
                  </Link>
                  <Link
                    href="/adminur/deposit/notdeposited"
                    className={`relative group ${
                      pathname === '/adminur/deposit/notdeposited'
                        ? 'text-blue-500'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="relative z-10">
                      {createWaveEffect('Deposit')}
                    </span>
                    <span
                      className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                        pathname === '/adminur/deposit/notdeposited'
                          ? 'w-full'
                          : ''
                      }`}
                    ></span>
                  </Link>
                  <Link
                    href="/adminur/deposit/history"
                    className={`relative group ${
                      pathname === '/adminur/deposit/history'
                        ? 'text-blue-500'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="relative z-10">
                      {createWaveEffect('History')}
                    </span>
                    <span
                      className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                        pathname === '/adminur/deposit/history' ? 'w-full' : ''
                      }`}
                    ></span>
                  </Link>
                  <Link
                    href="/adminur/approval/pending"
                    className={`relative group ${
                      pathname === '/adminur/approval/pending'
                        ? 'text-blue-500'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="relative z-10">
                      {createWaveEffect('Pending')}
                    </span>
                    <span
                      className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                        pathname === '/adminur/approval/pending' ? 'w-full' : ''
                      }`}
                    ></span>
                  </Link>
                  <Link
                    href="/adminur/approval"
                    className={`relative group ${
                      pathname === '/adminur/approval'
                        ? 'text-blue-500'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="relative z-10">
                      {createWaveEffect('Approval')}
                    </span>
                    <span
                      className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                        pathname === '/adminur/approval' ? 'w-full' : ''
                      }`}
                    ></span>
                  </Link>
                  <Link
                    href="/adminur/contact_message"
                    className={`relative group ${
                      pathname === '/adminur/contact_message'
                        ? 'text-blue-500'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="relative z-10">
                      {createWaveEffect('Message')}
                    </span>
                    <span
                      className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                        pathname === '/adminur/contact_message' ? 'w-full' : ''
                      }`}
                    ></span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className={`relative group ${
                      pathname === '/dashboard'
                        ? 'text-blue-500'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="relative z-10">
                      {createWaveEffect('Overview')}
                    </span>
                    <span
                      className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                        pathname === '/dashboard' ? 'w-full' : ''
                      }`}
                    ></span>
                  </Link>
                  <Link
                    href="/dashboard/deposit/request"
                    className={`relative group ${
                      pathname === '/dashboard/deposit/request'
                        ? 'text-blue-500'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="relative z-10">
                      {createWaveEffect('Deposit')}
                    </span>
                    <span
                      className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                        pathname === '/dashboard/deposit/request' ? 'w-full' : ''
                      }`}
                    ></span>
                  </Link>
                  <Link
                    href="/dashboard/deposit/request/status"
                    className={`relative group ${
                      pathname === '/dashboard/deposit/request/status'
                        ? 'text-blue-500'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="relative z-10">
                      {createWaveEffect('Status')}
                    </span>
                    <span
                      className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                        pathname === '/dashboard/deposit/request/status' ? 'w-full' : ''
                      }`}
                    ></span>
                  </Link>
                  <Link
                    href="/dashboard/receipt"
                    className={`relative group ${
                      pathname === '/dashboard/receipt'
                        ? 'text-blue-500'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="relative z-10">
                      {createWaveEffect('Receipt')}
                    </span>
                    <span
                      className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                        pathname === '/dashboard/receipt' ? 'w-full' : ''
                      }`}
                    ></span>
                  </Link>
                  <Link
                    href="/dashboard/withdrawal/request"
                    className={`relative group ${
                      pathname === '/dashboard/withdrawal/request'
                        ? 'text-blue-500'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="relative z-10">
                      {createWaveEffect('Withdrawal')}
                    </span>
                    <span
                      className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                        pathname === '/dashboard/withdrawal/request' ? 'w-full' : ''
                      }`}
                    ></span>
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className={`relative group ${
                      pathname === '/dashboard/profile'
                        ? 'text-blue-500'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="relative z-10">
                      {createWaveEffect('Profile')}
                    </span>
                    <span
                      className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                        pathname === '/dashboard/profile' ? 'w-full' : ''
                      }`}
                    ></span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </>
              )
            ) : (
              <>
                <Link
                  href="/"
                  className={`relative group ${
                    pathname === '/' ? 'text-blue-500' : 'text-gray-700'
                  }`}
                >
                  <span className="relative z-10">
                    {createWaveEffect('Home')}
                  </span>
                  <span
                    className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                      pathname === '/' ? 'w-full' : ''
                    }`}
                  ></span>
                </Link>
                <Link
                  href="/about"
                  className={`relative group ${
                    pathname === '/about' ? 'text-blue-500' : 'text-gray-700'
                  }`}
                >
                  <span className="relative z-10">
                    {createWaveEffect('About')}
                  </span>
                  <span
                    className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                      pathname === '/about' ? 'w-full' : ''
                    }`}
                  ></span>
                </Link>
                <Link
                  href="/contact"
                  className={`relative group ${
                    pathname === '/contact' ? 'text-blue-500' : 'text-gray-700'
                  }`}
                >
                  <span className="relative z-10">
                    {createWaveEffect('Contact')}
                  </span>
                  <span
                    className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                      pathname === '/contact' ? 'w-full' : ''
                    }`}
                  ></span>
                </Link>
                <Link
                  href="/blog"
                  className={`relative group ${
                    pathname === '/blog' ? 'text-blue-500' : 'text-gray-700'
                  }`}
                >
                  <span className="relative z-10">
                    {createWaveEffect('Blog')}
                  </span>
                  <span
                    className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                      pathname === '/blog' ? 'w-full' : ''
                    }`}
                  ></span>
                </Link>
                <Link
                  href="/login"
                  className={`relative group ${
                    pathname === '/login' ? 'text-blue-500' : 'text-gray-700'
                  }`}
                >
                  <span className="relative z-10">
                    {createWaveEffect('Login')}
                  </span>
                  <span
                    className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                      pathname === '/login' ? 'w-full' : ''
                    }`}
                  ></span>
                </Link>
                <Link
                  href="/register"
                  className={`relative group ${
                    pathname === '/register' ? 'text-blue-500' : 'text-gray-700'
                  }`}
                >
                  <span className="relative z-10">
                    {createWaveEffect('Register')}
                  </span>
                  <span
                    className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                      pathname === '/register' ? 'w-full' : ''
                    }`}
                  ></span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isLoggedIn ? (
              isAdmin ? (
                <>
                  <Link
                    href="/adminur/overview"
                    className="block text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Overview
                  </Link>
                  <Link
                    href="/adminur/deposit/notdeposited"
                    className="block text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Deposit
                  </Link>
                  <Link
                    href="/adminur/deposit/history"
                    className="block text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    History
                  </Link>
                  <Link
                    href="/adminur/approval/pending"
                    className="block text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pending
                  </Link>
                  <Link
                    href="/adminur/approval"
                    className="block text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Approval
                  </Link>
                  <Link
                    href="/adminur/contact_message"
                    className="block text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Message
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block text-gray-700 hover:text-gray-900 w-full text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="block text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Overview
                  </Link>
                  <Link
                    href="/dashboard/deposit/request"
                    className="block text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Deposit
                  </Link>
                  <Link
                    href="/dashboard/deposit/request/status"
                    className="block text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Status
                  </Link>
                  <Link
                    href="/dashboard/receipt"
                    className="block text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Receipt
                  </Link>
                  <Link
                    href="/dashboard/withdrawal/request"
                    className="block text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Withdrawal
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="block text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block text-gray-700 hover:text-gray-900 w-full text-left"
                  >
                    Logout
                  </button>
                </>
              )
            ) : (
              <>
                <Link
                  href="/"
                  className="block text-gray-700 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="block text-gray-700 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-700 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/blog"
                  className="block text-gray-700 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/login"
                  className="block text-gray-700 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block text-gray-700 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
