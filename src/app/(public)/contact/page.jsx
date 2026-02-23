'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context';
import Navbar from '@/components/Navbar';
import {
  Phone,
  Mail,
  MapPin,
  Clock3,
  Stethoscope,
  Send,
  CheckCircle2,
} from 'lucide-react';

const HOSPITAL = {
  name: 'Bir Hospital',
  tagline: 'A Sahaj Swasthya affiliated centre',
  address: 'Mahabauddha, Kathmandu 44600, Bagmati Province, Nepal',
  phone: '+977 1-4221119',
  emergency: '+977 1-4221988',
  email: 'info@birhospital.gov.np',
  hours: 'OPD: Sun – Fri, 8:00 AM – 5:00 PM',
  emergency_hours: 'Emergency & Casualty: 24 × 7',
};

const DOCTORS = [
  {
    name: 'Dr. Ramesh Adhikari',
    dept: 'Cardiology',
    phone: '+977 98410 34201',
    email: 'ramesh.adhikari@birhospital.gov.np',
    hours: 'Sun, Tue, Thu — 9 AM to 1 PM',
  },
  {
    name: 'Dr. Sushila Thapa',
    dept: 'Haematology & Internal Medicine',
    phone: '+977 98410 34202',
    email: 'sushila.thapa@birhospital.gov.np',
    hours: 'Mon, Wed, Fri — 10 AM to 2 PM',
  },
  {
    name: 'Dr. Bikash Shrestha',
    dept: 'Radiology',
    phone: '+977 98410 34203',
    email: 'bikash.shrestha@birhospital.gov.np',
    hours: 'Sun – Thu — 8 AM to 12 PM',
  },
  {
    name: 'Dr. Anita Maharjan',
    dept: 'Nephrology',
    phone: '+977 98410 34204',
    email: 'anita.maharjan@birhospital.gov.np',
    hours: 'Sun, Tue, Fri — 11 AM to 3 PM',
  },
  {
    name: 'Dr. Prakash Gurung',
    dept: 'ENT',
    phone: '+977 98410 34205',
    email: 'prakash.gurung@birhospital.gov.np',
    hours: 'Mon, Wed — 9 AM to 1 PM',
  },
  {
    name: 'Dr. Kabita Rai',
    dept: 'Endocrinology',
    phone: '+977 98410 34206',
    email: 'kabita.rai@birhospital.gov.np',
    hours: 'Sun, Thu — 10 AM to 2 PM',
  },
];

export default function ContactPage() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      <Navbar user={user} onLogout={logout} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Page title - Enhanced */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 mt-3 font-medium max-w-2xl mx-auto">
            Get in touch with our affiliated hospital or reach a doctor
            directly.
          </p>
        </div>

        {/* Hospital info card - Enhanced */}
        <section className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-14 h-14 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
              🏥
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 leading-tight">
                {HOSPITAL.name}
              </p>
              <p className="text-base text-blue-600 font-semibold mt-1">
                {HOSPITAL.tagline}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <MapPin size={20} className="text-blue-600 mt-0.5 shrink-0" />
              <span className="text-base text-gray-700 leading-relaxed">
                {HOSPITAL.address}
              </span>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <Phone size={20} className="text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-base font-semibold text-gray-900">
                  {HOSPITAL.phone}
                </p>
                <p className="text-sm text-red-600 font-semibold mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  Emergency: {HOSPITAL.emergency}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <Mail size={20} className="text-blue-600 mt-0.5 shrink-0" />
              <a
                href={`mailto:${HOSPITAL.email}`}
                className="text-base text-blue-700 hover:text-blue-800 font-medium hover:underline break-all"
              >
                {HOSPITAL.email}
              </a>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <Clock3 size={20} className="text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-base text-gray-700">{HOSPITAL.hours}</p>
                <p className="text-sm text-green-700 font-semibold mt-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {HOSPITAL.emergency_hours}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Doctors directory - Enhanced */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Doctor Directory
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DOCTORS.map((doc) => (
              <div
                key={doc.email}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Stethoscope size={20} className="text-blue-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-bold text-gray-900 leading-tight truncate">
                      {doc.name}
                    </p>
                    <p className="text-base text-blue-600 font-semibold truncate mt-0.5">
                      {doc.dept}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 text-base text-gray-600">
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="shrink-0 text-gray-400" />
                    <a
                      href={`tel:${doc.phone}`}
                      className="hover:text-blue-600 transition-colors font-medium"
                    >
                      {doc.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="shrink-0 text-gray-400" />
                    <a
                      href={`mailto:${doc.email}`}
                      className="hover:text-blue-600 transition-colors truncate font-medium"
                    >
                      {doc.email}
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock3
                      size={18}
                      className="shrink-0 text-gray-400 mt-0.5"
                    />
                    <span className="leading-relaxed">{doc.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact form - Enhanced */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Send us a message
          </h2>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 flex items-center gap-5">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center shrink-0">
                <CheckCircle2 size={28} className="text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-green-800">
                  Message sent successfully!
                </p>
                <p className="text-base text-green-700 mt-1.5 leading-relaxed">
                  We&apos;ll get back to you within 1–2 business days. Thank you
                  for reaching out.
                </p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2.5">
                    Your Name
                  </label>
                  <input
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="your.email@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2.5">
                  Message
                </label>
                <textarea
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                  rows={5}
                  placeholder="How can we help you today?"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <Send size={20} />
                Send Message
              </button>
            </form>
          )}
        </section>

        {/* Footer nav - Enhanced */}
        <div className="flex flex-col sm:flex-row gap-4 pb-6">
          <Link
            href="/dashboard"
            className="flex-1 bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700 px-6 py-4 rounded-2xl font-semibold text-base text-center transition-all duration-200"
          >
            ← Back to Dashboard
          </Link>
          <Link
            href="/about"
            className="flex-1 bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700 px-6 py-4 rounded-2xl font-semibold text-base text-center transition-all duration-200"
          >
            About Us →
          </Link>
        </div>
      </main>
    </div>
  );
}
