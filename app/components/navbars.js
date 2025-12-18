'use client';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { destroyCookie } from 'nookies';
import { useEffect, useState } from 'react';
import { isTokenValid } from "../utils/auth";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem('userRole');
      if (token && isTokenValid() && role === "user") {
        setIsLoggedIn(true);
        setUserName(localStorage.getItem("userName") || "User");
        setUserImage(localStorage.getItem("image") || "/default-avatar.png");
        console.log(localStorage.getItem("image"));
      } else {
        setIsLoggedIn(false);
        setUserName("");
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
      } 
    };
    if (pathname) {
      checkLoginStatus();
    }
    // Listen to storage events (e.g., logout in another tab)
    const handleStorageChange = () => checkLoginStatus();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userImage');
    Cookies.remove('access_token');
    Cookies.remove('userRole');
    destroyCookie(null, 'access_token', { path: '/' });
    destroyCookie(null, 'userRole', { path: '/' });

    window.location.href = '/login';
  };

  const createWaveEffect = (text) =>
    text.split('').map((char, index) => (
      <span
        key={index}
        className="inline-block hover:animate-hoverWave"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));

  return (
    <nav className="Text-sm sm:text-sm bg-white fixed top-0 left-0 w-full shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              href='/'
            >
              {/* <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72">
                <Image
                  src="/trust1x.png"
                  alt="Logo"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 200px"
                  className="object-contain"
                  priority={true}
                />
              </div> */}
              {/* <Image src="/trust1x.png" alt="Trust1x Logo" width={100} height={100} /> */}
            </Link>
            <Link href="/">
               <h1 className="text-3xl font-extrabold text-orange-600">HaatSeba</h1>
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
          <div className="hidden md:flex items-center gap-6 ">
            {isLoggedIn ? (
              <>
                <Link
                  href="/"
                  className={`relative group ${
                    pathname === '/'
                      ? 'text-blue-500'
                      : 'text-gray-700'
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
                  href="/dashboard"
                  className={`relative group ${
                    pathname === '/dashboard'
                      ? 'text-blue-500'
                      : 'text-gray-700'
                  }`}
                >
                  <span className="relative z-10">
                    {createWaveEffect('Dashboard')}
                  </span>
                  <span
                    className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                      pathname === '/dashboard' ? 'w-full' : ''
                    }`}
                  ></span>
                </Link>
                <Link
                  href="/vendor/request"
                  className={`relative group ${
                    pathname === '/vendor/request'
                      ? 'text-blue-500'
                      : 'text-gray-700'
                  }`}
                >
                  <span className="relative z-10">
                    {createWaveEffect('Become a Vendor')}
                  </span>
                  <span
                    className={`absolute left-0 bottom-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full ${
                      pathname === '/vendor/request' ? 'w-full' : ''
                    }`}
                  ></span>
                </Link>
              </>
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

            {/* USER DROPDOWN */}
            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1 rounded-full"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                      {userName}
                    </span>
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border">
                      <Image
                        src={userImage || "/default-avatar.png"}
                        alt={userName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                    <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )} 
          </div>
        </div>

        {/* MOBILE SLIDE DRAWER */}
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300
              ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer */}
          <div
            className={`fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-50 md:hidden
              transform transition-transform duration-300 ease-in-out
              ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          >

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              {isLoggedIn &&(
                <>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border">
                      <Image
                        src={userImage || "/default-avatar.png"}
                        alt={userName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Welcome</p>
                      <p className="font-semibold text-gray-800 truncate max-w-[140px]">
                        {userName || "Guest User"}
                      </p>
                    </div>
                  </div>
                </>
              )}
              

              {/* ❌ Cancel Button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-500 hover:text-red-500 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Menu */}
            <nav className="p-4 space-y-3">

              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-gray-700 font-medium"
              >
                Home
              </Link>

              {isLoggedIn && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-700 font-medium"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/vendor/request"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-700 font-medium"
                  >
                    Become a Vendor
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 text-red-600 font-medium"
                  >
                    Logout
                  </button>
                </>
              )}

              {!isLoggedIn && (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-700 font-medium"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-700 font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </>
      </div>
    </nav>
  );
};

export default Navbar;
