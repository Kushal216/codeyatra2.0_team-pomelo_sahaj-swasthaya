'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import Navbar from '@/components/Navbar';
import {
  ChevronLeft,
  CalendarDays,
  Stethoscope,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { MOCK_APPOINTMENTS } from './mockAppointments';

const STATUS_CONFIG = {
  Completed: {
    icon: CheckCircle2,
    badge: 'bg-green-100 text-green-700',
    dot: 'bg-green-500',
  },
  Cancelled: {
    icon: XCircle,
    badge: 'bg-red-100 text-red-600',
    dot: 'bg-red-400',
  },
  Waiting: {
    icon: Clock,
    badge: 'bg-yellow-100 text-yellow-700',
    dot: 'bg-yellow-400',
  },
  InProgress: {
    icon: Stethoscope,
    badge: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
  },
};

const FILTERS = ['All', 'Completed', 'Cancelled'];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function AppointmentCard({ appt }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG['Completed'];
  const StatusIcon = cfg.icon;

  return (
    <div className="card space-y-3">
      {/* Header row */}
      <div className="flex items-start gap-3">
        {/* Department icon */}
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
          <Stethoscope size={18} className="text-blue-700" />
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            {appt.department}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {appt.doctor}
            {appt.specialization ? ` · ${appt.specialization}` : ''}
          </p>
        </div>

        {/* Status badge */}
        <span
          className={`flex-shrink-0 flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}
        >
          <StatusIcon size={11} />
          {appt.status}
        </span>
      </div>

      {/* Date / time / token row */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-gray-50 rounded-lg p-2.5">
          <p className="text-gray-400 mb-0.5">Date</p>
          <p className="font-semibold text-gray-800">{formatDate(appt.date)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2.5">
          <p className="text-gray-400 mb-0.5">Time</p>
          <p className="font-semibold text-gray-800">{appt.time}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2.5">
          <p className="text-gray-400 mb-0.5">Token</p>
          <p className="font-semibold text-blue-700">#{appt.tokenNumber}</p>
        </div>
      </div>

      {/* Expandable notes */}
      {appt.notes && (
        <div className="border-t border-gray-100 pt-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {expanded ? 'Hide notes' : 'View doctor notes'}
          </button>
          {expanded && (
            <p className="mt-2 text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3">
              {appt.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function AppointmentsPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  const filtered =
    activeFilter === 'All'
      ? MOCK_APPOINTMENTS
      : MOCK_APPOINTMENTS.filter((a) => a.status === activeFilter);

  const completedCount = MOCK_APPOINTMENTS.filter(
    (a) => a.status === 'Completed'
  ).length;
  const cancelledCount = MOCK_APPOINTMENTS.filter(
    (a) => a.status === 'Cancelled'
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={logout} />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Page header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors -ml-1"
            aria-label="Back to dashboard"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1
              className="text-xl font-semibold text-gray-900"
              style={{ fontFamily: 'Fraunces,serif' }}
            >
              Appointments
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Your visit history and upcoming bookings
            </p>
          </div>
        </div>

        {/* Book CTA */}
        <button
          onClick={() => router.push('/opd-registration')}
          className="btn-primary w-full text-base py-4 flex items-center justify-center gap-2"
        >
          <CalendarDays size={18} />
          Book a New Appointment
        </button>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card text-center">
            <p className="text-2xl font-bold text-gray-900">
              {MOCK_APPOINTMENTS.length}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Total Visits</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-green-600">
              {completedCount}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Completed</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-red-500">{cancelledCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">Cancelled</p>
          </div>
        </div>

        {/* Past appointments */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-800">
              Past Appointments
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  activeFilter === f
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-700'
                }`}
              >
                {f}
                {f !== 'All' && (
                  <span
                    className={`ml-1.5 text-xs ${activeFilter === f ? 'opacity-70' : 'text-gray-400'}`}
                  >
                    {MOCK_APPOINTMENTS.filter((a) => a.status === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="card text-center py-12 text-gray-400 text-sm">
              No appointments found.
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((appt) => (
                <AppointmentCard key={appt.id} appt={appt} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
