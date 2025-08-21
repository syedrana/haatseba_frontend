'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';

const ProtectedPublicRoute = () => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies.access_token;
    const role = cookies.userRole;

    const publicRoutes = [
      '/',
      '/about',
      '/contact',
      '/blog',
      '/login',
      '/register',
    ];
    const adminRoutes = [
      '/adminur',
      '/adminur/overview',
      '/adminur/deposit',
      '/adminur/contact_message',
    ];
    const userRoutes = ['/dashboard', '/dashboard/profile'];

    const isPublic = publicRoutes.some((path) => pathname === path);
    const isAdminRoute = adminRoutes.some((path) => pathname.startsWith(path));
    const isUserRoute = userRoutes.some((path) => pathname.startsWith(path));

    if (!token) {
      // যদি টোকেন না থাকে এবং প্রাইভেট রাউটে ঢোকার চেষ্টা করে, তাহলে লগইন পেজে পাঠাও
      if (!isPublic) {
        router.replace('/login');
      }
    } else {
      // যদি টোকেন থাকে কিন্তু পাবলিক পেজে ঢোকে, তাহলে রিডিরেক্ট করো
      if (isPublic) {
        if (role === 'admin') {
          router.replace('/adminur/overview');
        } else {
          router.replace('/dashboard');
        }
      }

      // যদি ইউজার হয় কিন্তু অ্যাডমিন রাউটে ঢোকে, রিডিরেক্ট
      if (role !== 'admin' && isAdminRoute) {
        router.replace('/dashboard');
      }

      // যদি অ্যাডমিন হয় কিন্তু ইউজার রাউটে ঢোকে, রিডিরেক্ট
      if (role === 'admin' && isUserRoute) {
        router.replace('/adminur/overview');
      }
    }
  }, [pathname]);

  return null;
};

export default ProtectedPublicRoute;
