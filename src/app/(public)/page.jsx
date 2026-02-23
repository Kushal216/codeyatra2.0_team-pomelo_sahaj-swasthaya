'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ==================== NAVIGATION ==================== */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="relative w-32 h-12 flex items-center justify-center">
              <Image
                src={'/logo.png'}
                alt="logo"
                fill
                className="object-contain"
              />
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold px-5 py-2.5 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2.5 rounded-xl font-semibold transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <Link
                href="#features"
                className="block text-gray-700 hover:text-blue-600 font-medium"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="block text-gray-700 hover:text-blue-600 font-medium"
              >
                How It Works
              </Link>
              <Link
                href="/login"
                className="block text-blue-600 font-semibold py-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block bg-red-600 text-white text-center py-2.5 rounded-xl font-semibold"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Comfortable and Fast{' '}
                <span className="bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Healthcare
                </span>{' '}
                at Your Fingertips
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Skip the queues. Book appointments, track your token, and
                receive lab reports digitally. Built for Nepals healthcare
                system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Book Appointment Now
                </Link>
                <Link
                  href="#how-it-works"
                  className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition shadow-md hover:shadow-lg"
                >
                  Watch Demo →
                </Link>
              </div>
            </div>

            {/* Right: Hero Image/Illustration */}
            <div className="relative">
              <div className="bg-linear-to-br from-blue-500 to-blue-700 rounded-3xl p-8 shadow-2xl transform">
                <div className="bg-white rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">👨‍⚕️</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">
                          Dr. Sharma
                        </div>
                        <div className="text-sm text-gray-500">Cardiology</div>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Available
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-700">Token #105</span>
                      <span className="text-blue-600 font-semibold">
                        10:15 AM
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Token #106</span>
                      <span className="text-gray-500">10:30 AM</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Token #107</span>
                      <span className="text-gray-500">10:45 AM</span>
                    </div>
                  </div>

                  <div className="mt-6 bg-lineaer-to-r from-blue-600 to-blue-700 text-white text-center py-3 rounded-xl font-semibold">
                    Next Patient in 5 mins
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for a seamless healthcare experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-linear-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 border border-blue-100">
              <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Profile Management
              </h3>
              <p className="text-gray-600 mb-6">
                Create and manage your personal health profile with easy access
                to your medical history and information.
              </p>
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center"
              >
                Get Started
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="group bg-linear-to-br from-red-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 border border-red-100">
              <div className="w-16 h-16 bg-linear-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Book Appointment
              </h3>
              <p className="text-gray-600 mb-6">
                Schedule appointments with your preferred doctor at convenient
                time slots. No more waiting in long queues.
              </p>
              <Link
                href="/dashboard"
                className="text-red-600 hover:text-red-700 font-semibold inline-flex items-center"
              >
                Book Now
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="group bg-linear-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 border border-blue-100">
              <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Online Reports
              </h3>
              <p className="text-gray-600 mb-6">
                Access your lab reports and medical documents digitally.
                Download and share them anytime, anywhere.
              </p>
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center"
              >
                View Reports
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section
        id="how-it-works"
        className="py-20 bg-linear-to-b from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple 3-step process to better healthcare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Book Your Slot
              </h3>
              <p className="text-gray-600">
                Choose your department, doctor, and preferred time slot online
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Get Notified
              </h3>
              <p className="text-gray-600">
                Receive email updates about your token status and turn
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Visit & Done
              </h3>
              <p className="text-gray-600">
                Arrive at your slot time, get served, receive reports digitally
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-20 bg-linear-to-r from-blue-600 via-blue-700 to-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience Better Healthcare?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of patients who have already simplified their
            hospital visits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Create Free Account
            </Link>
            <Link
              href="#contact"
              className="bg-transparent text-white border-2 border-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-4">
                🏥 Sahaj Swasthya
              </div>
              <p className="text-gray-400 text-sm">
                Digital Healthcare Queue Management for Nepal
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-white transition"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#testimonials"
                    className="hover:text-white transition"
                  >
                    Testimonials
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="#about" className="hover:text-white transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="#help" className="hover:text-white transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:text-white transition">
                    FAQ
                  </Link>
                </li>
                <li>support@sahajswasthya.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2024 Sahaj Swasthya. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
