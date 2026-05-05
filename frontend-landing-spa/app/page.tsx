'use client';

/**
 * Landing Page - Modern Spa Website
 * 
 * Trang landing hiện đại cho spa làm đẹp phong cách Việt Nam
 * Bao gồm: Hero, About, Services, Booking, Footer
 */

import { useState, useEffect } from 'react';
import HeroModern from '@/components/landing/HeroModern';
import AboutSection from '@/components/landing/AboutSection';
import Services from '@/components/landing/Services';
import BookingForm from '@/components/landing/BookingForm';
import Footer from '@/components/landing/Footer';

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Slideshow */}
      <HeroModern />

      {/* About Section - Giới thiệu */}
      <AboutSection />

      {/* Services Section - Dịch vụ */}
      <Services />

      {/* Booking Form Section - Đặt lịch */}
      <BookingForm />

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full shadow-2xl hover:shadow-primary-600/50 hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center group cursor-pointer"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6 group-hover:-translate-y-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
