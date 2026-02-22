'use client';
import React, { useState } from 'react';
import TicketModal from '@/components/TicketModal';
// import { useRouter } from 'next/router';
import { Pill, Stethoscope, FileText, Syringe } from 'lucide-react';

const MOCK_APPOINTMENTS = [
  {
    id: 'APT001',
    dept: 'Cardiology',
    doctor: 'Dr. Meena Rao',
    date: '2026-02-25',
    time: '10:30 AM',
    token: 'C-14',
    status: 'Confirmed',
  },
  {
    id: 'APT002',
    dept: 'Ophthalmology',
    doctor: 'Dr. Ajay Sen',
    date: '2026-03-02',
    time: '11:00 AM',
    token: 'O-07',
    status: 'Confirmed',
  },
];
function PatientDashboard({ user }) {
  const [selectedApt, setSelectedApt] = useState({
    id: 'APT001',
    dept: 'Cardiology',
    doctor: 'Dr. Meena Rao',
    date: '2026-02-25',
    time: '10:30 AM',
    token: 'C-14',
    status: 'Confirmed',
  });

  // const router = useRouter();

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Welcome card */}
      <div className="card border-l-4 border-l-blue-700">
        <p className="text-xs text-gray-400 mb-1">Welcome back</p>
        <h2
          className="text-xl font-semibold text-gray-900"
          style={{ fontFamily: 'Fraunces,serif' }}
        >
          {user.name}
        </h2>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
          <span>
            ID: <strong className="text-gray-800">{user.id}</strong>
          </span>
          <span>
            Phone: <strong className="text-gray-800">{user.phone}</strong>
          </span>
          {user.insuranceId && (
            <span>
              Insurance:{' '}
              <strong className="text-gray-800">{user.insuranceId}</strong>
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-400">{user.address}</p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => router.push('/opd-registration')}
          className="btn-primary flex-1 text-center text-base py-4"
        >
          Book an Appointment
        </button>
        <button className="btn-secondary flex-1 text-center">
          View Medical History
        </button>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Upcoming Appointments
        </h3>
        {MOCK_APPOINTMENTS.length === 0 ? (
          <div className="card text-center py-8 text-gray-400 text-sm">
            No appointments scheduled.
          </div>
        ) : (
          <div className="space-y-3">
            {MOCK_APPOINTMENTS.map((apt) => (
              <button
                key={apt.id}
                onClick={() => setSelectedApt(apt)}
                className="card w-full text-left hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {apt.dept}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{apt.doctor}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {apt.date} · {apt.time}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      {apt.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      Token: {apt.token}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2 font-medium">
                  Tap to view ticket →
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Health info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { Icon: Pill, label: 'Active Prescriptions', val: '2' },
          { Icon: Stethoscope, label: 'Last Visit', val: 'Jan 12' },
          { Icon: FileText, label: 'Lab Reports', val: '3' },
          { Icon: Syringe, label: 'Vaccinations', val: 'Up to date' },
        ].map(({ Icon, label, val }) => (
          <div
            key={label}
            className="card text-center flex flex-col items-center gap-1"
          >
            <Icon size={22} className="text-blue-600" />
            <p className="text-base font-bold text-gray-900">{val}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* {selectedApt && (
        <TicketModal apt={selectedApt} onClose={() => setSelectedApt(null)} />
      )} */}
    </main>
  );
}

export default PatientDashboard;
