'use client'
import React from 'react'
const MOCK_PATIENTS = [
  {
    id: 'P001',
    name: 'Ananya Sharma',
    age: 32,
    dept: 'Cardiology',
    status: 'Waiting',
    token: 'C-01',
  },
  {
    id: 'P002',
    name: 'Rakesh Verma',
    age: 55,
    dept: 'Orthopedics',
    status: 'In Consultation',
    token: 'O-02',
  },
  {
    id: 'P003',
    name: 'Seema Patel',
    age: 28,
    dept: 'Gynaecology',
    status: 'Waiting',
    token: 'G-03',
  },
  {
    id: 'P004',
    name: 'Mohan Das',
    age: 61,
    dept: 'Cardiology',
    status: 'Done',
    token: 'C-04',
  },
];
function StaffDashboard({ user }) {
  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="card border-l-4 border-l-teal-600">
        <p className="text-xs text-gray-400">Staff Portal</p>
        <h2
          className="text-xl font-semibold"
          style={{ fontFamily: 'Fraunces,serif' }}
        >
          {user.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1">Cardiology · OPD Desk</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Today's OPD", val: '34' },
          { label: 'Waiting', val: '12' },
          { label: 'In Consultation', val: '1' },
          { label: 'Completed', val: '21' },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <p className="text-2xl font-bold text-blue-700">{s.val}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Patient queue */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Patient Queue
        </h3>
        <div className="space-y-2">
          {MOCK_PATIENTS.map((p) => (
            <div
              key={p.id}
              className="card flex items-center justify-between gap-2"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-400">
                  {p.dept} · Age {p.age} · Token {p.token}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                  p.status === 'Waiting'
                    ? 'bg-yellow-100 text-yellow-700'
                    : p.status === 'In Consultation'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                }`}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button className="btn-teal flex-1">Call Next Patient</button>
        <button className="btn-secondary flex-1">Mark Complete</button>
      </div>
    </main>
  );
}

export default StaffDashboard
