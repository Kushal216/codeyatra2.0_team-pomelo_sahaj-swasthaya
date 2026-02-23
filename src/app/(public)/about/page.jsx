'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/context';
import Navbar from '@/components/Navbar';
import {
  ClipboardList,
  Clock3,
  Users,
  ShieldCheck,
  HeartPulse,
  LayoutDashboard,
} from 'lucide-react';

const PILLARS = [
  {
    Icon: ClipboardList,
    title: 'Paperless Registration',
    desc: 'Replace queues and paper forms with a fully digital OPD booking flow — department, doctor, and slot selection in under two minutes.',
    bg: 'bg-blue-50',
    color: 'text-blue-700',
  },
  {
    Icon: Clock3,
    title: 'Real-Time Queue Tracking',
    desc: 'Patients see their live token status and estimated wait time on any device. No more crowding in corridors.',
    bg: 'bg-teal-50',
    color: 'text-teal-700',
  },
  {
    Icon: Users,
    title: 'Staff & Admin Visibility',
    desc: "Doctors and staff get a unified view of the day's patients. Admins manage users and departments from one dashboard.",
    bg: 'bg-purple-50',
    color: 'text-purple-700',
  },
  {
    Icon: ShieldCheck,
    title: 'Secure Health Records',
    desc: "Lab reports, prescriptions, and visit history stored securely under each patient's profile — accessible anywhere, anytime.",
    bg: 'bg-green-50',
    color: 'text-green-700',
  },
  {
    Icon: HeartPulse,
    title: 'Patient-First Design',
    desc: "Every screen is built mobile-first with clarity and speed in mind — because patients shouldn't need a manual to use healthcare software.",
    bg: 'bg-rose-50',
    color: 'text-rose-700',
  },
  {
    Icon: LayoutDashboard,
    title: 'One Platform, All Roles',
    desc: 'A single system adapts to patients, frontline staff, and hospital administrators — each with a tailored, role-aware experience.',
    bg: 'bg-amber-50',
    color: 'text-amber-700',
  },
];

const STATS = [
  { value: '< 2 min', label: 'To book an appointment' },
  { value: '3 roles', label: 'Patient · Staff · Admin' },
  { value: '0 paper', label: 'Fully digital workflow' },
  { value: '24 / 7', label: 'Access from any device' },
];

export default function AboutPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={logout} />

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-12">
        {/* Hero */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100">
            <HeartPulse size={13} />
            Hospital Management, Simplified
          </div>
          <h1
            className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight"
            style={{ fontFamily: 'Fraunces,serif' }}
          >
            Healthcare that works{' '}
            <span className="text-blue-700">as fast as you need it to</span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Sahaj Swasthya is a digital-first hospital management platform built
            to eliminate the friction between patients and care — from booking
            an OPD slot to tracking a live queue token to accessing lab reports.
          </p>
        </section>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATS.map(({ value, label }) => (
            <div key={label} className="card text-center">
              <p
                className="text-xl font-bold text-blue-700"
                style={{ fontFamily: 'Fraunces,serif' }}
              >
                {value}
              </p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <section className="card border-l-4 border-l-blue-700 space-y-2">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            Our Mission
          </p>
          <h2
            className="text-lg font-semibold text-gray-900"
            style={{ fontFamily: 'Fraunces,serif' }}
          >
            Remove every unnecessary step between a patient and their doctor
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Indian hospitals manage thousands of outpatient visits daily on
            systems built for administrators, not people. We believe the
            technology layer of healthcare should be invisible — it should just
            work. Sahaj Swasthya replaces paper tokens, crowded waiting rooms,
            and disconnected records with a single, cohesive platform that every
            stakeholder can rely on.
          </p>
        </section>

        {/* Pillars */}
        <section className="space-y-4">
          <h2
            className="text-lg font-semibold text-gray-900"
            style={{ fontFamily: 'Fraunces,serif' }}
          >
            What we&apos;re building
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PILLARS.map(({ Icon, title, desc, bg, color }) => (
              <div key={title} className="card space-y-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg}`}
                >
                  <Icon size={18} className={color} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="card border border-blue-200 bg-linear-to-br from-blue-50 to-indigo-50 text-center space-y-3 py-8">
          <h2
            className="text-xl font-semibold text-blue-900"
            style={{ fontFamily: 'Fraunces,serif' }}
          >
            Built at CodeYatra 2.0
          </h2>
          <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
            Sahaj Swasthya is a hackathon project by Team Pomelo — a group of
            developers who believe that thoughtful software design can make
            everyday healthcare feel less overwhelming and more human.
          </p>
          <p className="text-blue-500 text-xs italic">
            &quot;Sahaj&quot; means effortless in Nepali. That&apos;s the
            standard we hold our product to.
          </p>
        </section>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 pb-4">
          <Link
            href="/dashboard"
            className="btn-primary flex-1 text-center py-4 text-base"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/opd-registration"
            className="btn-secondary flex-1 text-center py-4"
          >
            Book an Appointment
          </Link>
        </div>
      </main>
    </div>
  );
}
