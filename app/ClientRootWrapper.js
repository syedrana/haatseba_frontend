'use client';
import { usePathname } from 'next/navigation';
import Footer from './components/footer';
import MoveToTopButton from './components/MoveToTopButton';
import Navbar from './components/navbars';

export default function ClientRootWrapper({ children }) {
  const pathname = usePathname();
  const showNavbar = !pathname.startsWith('/dashboard');

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
      {showNavbar && <Footer />}
      <MoveToTopButton />
    </>
  );
}
