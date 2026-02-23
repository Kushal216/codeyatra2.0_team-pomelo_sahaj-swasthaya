import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div >
              <div className="relative bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-xl">
                <Image fill className='border object-fit' alt= "logo" src="/Picture.png"></Image>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <Link 
                href="#about" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
              >
                About us
              </Link>
              <Link 
                href="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Comfortable and Fast healthcare<br />
            <span className="text-blue-200">at your finger tips.</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Smart queue management for modern healthcare facilities
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/register" 
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition shadow-lg"
            >
              Get Started
            </Link>
            <Link 
              href="#services" 
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg font-semibold transition shadow-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Our Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Card 1: Profile Management */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition border-t-4 border-blue-600">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Profile Management
              </h3>
              <p className="text-gray-600 mb-4">
                Create and manage your personal health profile with easy access to your medical history and information.
              </p>
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center">
                Learn more
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Service Card 2: Book Appointment */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition border-t-4 border-red-600">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Book Appointment
              </h3>
              <p className="text-gray-600 mb-4">
                Schedule appointments with your preferred doctor at convenient time slots. No more waiting in long queues.
              </p>
              <Link href="/dashboard" className="text-red-600 hover:text-red-700 font-semibold inline-flex items-center">
                Book now
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Service Card 3: Online Reports */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition border-t-4 border-blue-600">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Online Reports
              </h3>
              <p className="text-gray-600 mb-4">
                Access your lab reports and medical documents digitally. Download and share them anytime, anywhere.
              </p>
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center">
                View reports
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Why Choose <span className="text-blue-600">Sahaj Swasthya</span>?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-blue-600 text-white rounded-full p-2 mr-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Save Time</h4>
                    <p className="text-gray-600">Reduce waiting time from hours to minutes</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-red-600 text-white rounded-full p-2 mr-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Smart Notifications</h4>
                    <p className="text-gray-600">Get email updates about your appointment status</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-600 text-white rounded-full p-2 mr-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Digital Records</h4>
                    <p className="text-gray-600">Access your medical history anytime</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-red-600 text-white rounded-full p-2 mr-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Easy to Use</h4>
                    <p className="text-gray-600">Simple interface for all age groups</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Experience Better Healthcare?</h3>
              <p className="mb-6 text-blue-100">Join thousands of patients who have already simplified their hospital visits.</p>
              <Link 
                href="/register" 
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-2xl font-bold text-blue-400">Sahaj Swasthya</div>
              <p className="text-gray-400 text-sm mt-1">Digital Healthcare Queue Management</p>
            </div>
            <div className="text-gray-400 text-sm">
              © 2026 Sahaj Swasthya. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}