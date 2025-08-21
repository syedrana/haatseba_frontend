"use client";
import { useEffect, useState } from 'react';

const MoveToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          ↑ Move to Top
        </button>
      )}
    </>
  );
};

export default MoveToTopButton;
