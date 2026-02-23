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
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  let hours = d.getUTCHours();
  const minutes = d.getUTCMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

function tokenToAppt(t) {
  return {
    id: t._id,
    department: t.department?.name ?? '—',
    doctor: t.doctor?.name ? `Dr. ${t.doctor.name}` : '—',
    specialization: t.doctor?.specialization ?? '',
    date: t.appointmentTime,
    time: formatTime(t.appointmentTime),
    tokenNumber: t.tokenNumber,
    stage: t.stage,
    status: t.status,
    notes: null,
  };
}

function AppointmentCard({ appt }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG['Completed'];
  const StatusIcon = cfg.icon;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header row */}
      <div className="flex items-start gap-4 mb-5">
        {/* Department icon */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0 ring-2 ring-blue-100">
          <Stethoscope size={22} className="text-blue-700" />
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-gray-900 leading-tight">
            {appt.department}
          </p>
          <p className="text-base text-gray-600 mt-1">
            {appt.doctor}
            {appt.specialization && <span className="text-gray-400"> · {appt.specialization}</span>}
          </p>
        </div>

        {/* Status badge */}
        <span className={`flex-shrink-0 flex items-center gap-1.5 text-sm px-3.5 py-1.5 rounded-full font-semibold ${cfg.badge}`}>
          <StatusIcon size={14} />
          {appt.status}
        </span>
      </div>

      {/* Date / time / token row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">Date</p>
          <p className="text-base font-bold text-gray-900">{formatDate(appt.date)}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">Time</p>
          <p className="text-base font-bold text-gray-900">{appt.time}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">Token</p>
          <p className="text-base font-bold text-blue-700">#{appt.tokenNumber}</p>
        </div>
      </div>

      {/* Expandable notes */}
      {appt.notes && (
        <div className="border-t border-gray-100 pt-4">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {expanded ? 'Hide doctor notes' : 'View doctor notes'}
          </button>
          {expanded && (
            <p className="mt-3 text-base text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4">
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
  const [appointments, setAppointments] = useState([]);
  const [apptLoading, setApptLoading] = useState(true);
  const [apptError, setApptError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user?._id) return;
    const load = async () => {
      setApptLoading(true);
      setApptError('');
      try {
        const r = await fetch(
          `/api/token/my?userId=${user._id}&allStatus=true`
        );
        const data = await r.json();
        if (data.success) {
          setAppointments((data.tokens ?? []).map(tokenToAppt));
        } else {
          setApptError(data.error || 'Failed to load appointments');
        }
      } catch {
        setApptError('Failed to load appointments');
      } finally {
        setApptLoading(false);
      }
    };
    load();
  }, [user?._id]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold text-lg">Loading appointments...</p>
        </div>
      </div>
    );
  }

  const filtered =
    activeFilter === 'All'
      ? appointments
      : appointments.filter((a) => a.status === activeFilter);

  const completedCount = appointments.filter(
    (a) => a.status === 'Completed'
  ).length;
  const cancelledCount = appointments.filter(
    (a) => a.status === 'Cancelled'
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar user={user} onLogout={logout} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Page header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors -ml-1"
            aria-label="Back to dashboard"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Appointments
            </h1>
            <p className="text-base text-gray-600 mt-1.5 font-medium">
              Your visit history and upcoming bookings
            </p>
          </div>
        </div>

        {/* Book CTA - Enhanced */}
        <button
          onClick={() => router.push('/opd-registration')}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
        >
          <CalendarDays size={22} />
          Book a New Appointment
        </button>

        {/* Summary stats - Enhanced */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center hover:shadow-md transition-shadow">
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {MOCK_APPOINTMENTS.length}
            </p>
            <p className="text-sm font-medium text-gray-500 mt-2">Total Visits</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center hover:shadow-md transition-shadow">
            <p className="text-3xl font-extrabold text-green-600 tracking-tight">
              {completedCount}
            </p>
            <p className="text-sm font-medium text-gray-500 mt-2">Completed</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center hover:shadow-md transition-shadow">
            <p className="text-3xl font-extrabold text-red-500 tracking-tight">
              {cancelledCount}
            </p>
            <p className="text-sm font-medium text-gray-500 mt-2">Cancelled</p>
          </div>
        </div>

        {/* Past appointments section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Past Appointments</h2>
          </div>

          {/* Filter tabs - Enhanced */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 mb-6 -mx-2 px-2">
            {FILTERS.map((f) => {
              const count = MOCK_APPOINTMENTS.filter((a) => a.status === f).length;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-200 ${
                    activeFilter === f
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  {f}
                  {f !== 'All' && (
                    <span className={`ml-2 text-xs font-semibold ${activeFilter === f ? 'text-blue-100' : 'text-gray-400'}`}>
                      ({count})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDays size={28} className="text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-gray-700">No appointments found</p>
              <p className="text-base text-gray-500 mt-2">Try selecting a different filter or book a new appointment</p>
            </div>
          ) : (
            <div className="space-y-4">
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