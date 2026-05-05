'use client';

/**
 * Hero Component
 * 
 * Displays the main banner section with spa branding, heading, and call-to-action button.
 * Implements smooth scrolling to the booking form when CTA is clicked.
 * 
 * Requirements: 6.1, 6.3, 6.4, 6.5, 7.1, 7.2, 7.4
 */

export default function Hero() {
  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking-form');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full min-h-[500px] sm:min-h-[550px] md:min-h-[600px] flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 dark:from-teal-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-[url('/spa-pattern.svg')] opacity-5"></div>
      
      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 text-center">
        {/* Spa branding */}
        <div className="mb-6 sm:mb-7 md:mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 tracking-tight">
            Spa Nhuy
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light px-4">
            Your Journey to Wellness Begins Here
          </p>
        </div>

        {/* Main heading */}
        <div className="mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto px-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-800 dark:text-gray-200 mb-4 sm:mb-5 md:mb-6 leading-relaxed">
            Experience tranquility and rejuvenation with our premium spa services
          </h2>
          <p className="text-base sm:text-lg md:text-lg text-gray-600 dark:text-gray-400 px-2">
            Indulge in luxurious treatments designed to restore balance, relieve stress, and enhance your natural beauty
          </p>
        </div>

        {/* CTA Button - Touch-friendly size (min 44x44px) */}
        <button
          onClick={scrollToBooking}
          className="inline-flex items-center justify-center px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white bg-teal-600 rounded-full hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-h-[44px] min-w-[200px]"
          aria-label="Book your appointment"
        >
          Book Your Appointment
          <svg
            className="ml-2 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Features highlights - 3 columns on tablet and desktop */}
        <div className="mt-12 sm:mt-14 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4">
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 px-2">Flexible Scheduling</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm px-2">Book at your convenience</p>
          </div>

          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 px-2">Expert Therapists</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm px-2">Certified professionals</p>
          </div>

          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 px-2">Premium Experience</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm px-2">Luxury treatments</p>
          </div>
        </div>
      </div>
    </section>
  );
}
