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
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={logout} />

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-10">
        {/* Page title */}
        <div>
          <h1
            className="text-2xl sm:text-3xl font-semibold text-gray-900"
            style={{ fontFamily: 'Fraunces,serif' }}
          >
            Contact Us
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Get in touch with our affiliated hospital or reach a doctor
            directly.
          </p>
        </div>

        {/* Hospital info card */}
        <section className="card border-l-4 border-l-blue-700 space-y-4">
          <div>
            <p className="text-base font-semibold text-gray-900">
              {HOSPITAL.name}
            </p>
            <p className="text-xs text-blue-600 font-medium">
              {HOSPITAL.tagline}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <span className="text-gray-600 leading-snug">
                {HOSPITAL.address}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-blue-600 shrink-0" />
              <div>
                <p className="text-gray-800 font-medium">{HOSPITAL.phone}</p>
                <p className="text-xs text-red-600 font-medium">
                  Emergency: {HOSPITAL.emergency}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-blue-600 shrink-0" />
              <a
                href={`mailto:${HOSPITAL.email}`}
                className="text-blue-700 hover:underline break-all"
              >
                {HOSPITAL.email}
              </a>
            </div>
            <div className="flex items-start gap-3">
              <Clock3 size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-gray-600">{HOSPITAL.hours}</p>
                <p className="text-xs text-green-700 font-medium mt-0.5">
                  {HOSPITAL.emergency_hours}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Doctors directory */}
        <section className="space-y-4">
          <h2
            className="text-lg font-semibold text-gray-900"
            style={{ fontFamily: 'Fraunces,serif' }}
          >
            Doctor Directory
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DOCTORS.map((doc) => (
              <div key={doc.email} className="card space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Stethoscope size={16} className="text-blue-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-blue-600 font-medium truncate">
                      {doc.dept}
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Phone size={11} className="shrink-0 text-gray-400" />
                    <a
                      href={`tel:${doc.phone}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {doc.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={11} className="shrink-0 text-gray-400" />
                    <a
                      href={`mailto:${doc.email}`}
                      className="hover:text-blue-600 transition-colors truncate"
                    >
                      {doc.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 size={11} className="shrink-0 text-gray-400" />
                    <span>{doc.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact form */}
        <section className="space-y-4">
          <h2
            className="text-lg font-semibold text-gray-900"
            style={{ fontFamily: 'Fraunces,serif' }}
          >
            Send us a message
          </h2>

          {submitted ? (
            <div className="card border-green-200 bg-green-50 flex items-center gap-3 py-6">
              <CheckCircle2 size={24} className="text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Message sent!
                </p>
                <p className="text-xs text-green-700 mt-0.5">
                  We&apos;ll get back to you within 1–2 business days.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Your Name</label>
                  <input
                    className="input"
                    placeholder="Riya Desai"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="riya@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label">Message</label>
                <textarea
                  className="input resize-none"
                  rows={4}
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
              >
                <Send size={14} />
                Send Message
              </button>
            </form>
          )}
        </section>

        {/* Footer nav */}
        <div className="flex flex-col sm:flex-row gap-3 pb-4">
          <Link
            href="/dashboard"
            className="btn-secondary flex-1 text-center py-3"
          >
            Back to Dashboard
          </Link>
          <Link href="/about" className="btn-secondary flex-1 text-center py-3">
            About Us
          </Link>
        </div>
      </main>
    </div>
  );
}
