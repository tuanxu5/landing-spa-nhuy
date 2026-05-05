/**
 * Landing Page
 * 
 * Main customer-facing page for the Spa Booking system.
 * Composes Hero, Services, BookingForm, and Footer components.
 * Implements smooth scrolling between sections.
 * 
 * Requirements: 6.1, 6.3, 6.5, 7.1, 7.2, 7.3, 14.1, 14.2, 14.4
 */

import Hero from '@/components/landing/Hero';
import Services from '@/components/landing/Services';
import BookingForm from '@/components/landing/BookingForm';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <Services />

      {/* Booking Form Section */}
      <BookingForm />

      {/* Footer */}
      <Footer />
    </div>
  );
}
