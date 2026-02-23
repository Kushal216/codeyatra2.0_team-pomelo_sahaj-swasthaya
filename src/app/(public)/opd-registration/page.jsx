'use client';
import { useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import Navbar from '@/components/Navbar';
import { ChevronLeft, CalendarDays, Stethoscope, Clock, CheckCircle2 } from 'lucide-react';

const useIsClient = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

const STEPS = ['Department', 'Doctor', 'Date & Slot', 'Confirm'];

export default function OpdRegistrationPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const isClient = useIsClient();

  const [step, setStep] = useState(0);

  // Data
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);

  // Selections
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [selectedSlot, setSelectedSlot] = useState(null);

  // UI state
  const [deptLoading, setDeptLoading] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [slotLoading, setSlotLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  // Load departments on mount
  useEffect(() => {
    if (!isClient) return;
    setDeptLoading(true);
    fetch('/api/departments')
      .then((r) => r.json())
      .then((d) => setDepartments(d.departments ?? []))
      .catch(() => setError('Failed to load departments'))
      .finally(() => setDeptLoading(false));
  }, [isClient]);

  // Load doctors when dept changes
  useEffect(() => {
    if (!selectedDept) return;
    setDoctors([]);
    setSelectedDoctor(null);
    setDoctorLoading(true);
    fetch(`/api/doctors?department=${selectedDept._id}`)
      .then((r) => r.json())
      .then((d) => setDoctors(d.doctors ?? []))
      .catch(() => setError('Failed to load doctors'))
      .finally(() => setDoctorLoading(false));
  }, [selectedDept]);

  // Load slots when doctor or date changes
  useEffect(() => {
    if (!selectedDoctor || !selectedDate) return;
    setSlots([]);
    setSelectedSlot(null);
    setSlotLoading(true);
    fetch(`/api/slots?doctorId=${selectedDoctor._id}&date=${selectedDate}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .catch(() => setError('Failed to load slots'))
      .finally(() => setSlotLoading(false));
  }, [selectedDoctor, selectedDate]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: user.name,
          phone: user.phone ?? '',
          userId: user._id,
          appointmentTime: selectedSlot.time,
          department: selectedDept._id,
          doctor: selectedDoctor._id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isClient || loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={logout} />
        <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Appointment Booked!</h2>
          <p className="text-gray-500 text-sm">
            Your slot with <span className="font-medium text-gray-700">Dr. {selectedDoctor.name}</span> at{' '}
            <span className="font-medium text-gray-700">{selectedSlot.display}</span> on{' '}
            <span className="font-medium text-gray-700">{selectedDate}</span> has been confirmed.
          </p>
          <button onClick={() => router.push('/dashboard')} className="btn-primary w-full">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={logout} />

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => (step > 0 ? setStep(step - 1) : router.push('/dashboard'))}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 -ml-1"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
            <p className="text-sm text-gray-500 mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Step 0 — Department */}
        {step === 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Select a department</p>
            {deptLoading ? (
              <div className="text-sm text-gray-400 py-8 text-center">Loading departments…</div>
            ) : (
              departments.map((d) => (
                <button
                  key={d._id}
                  onClick={() => { setSelectedDept(d); setStep(1); }}
                  className="w-full card text-left flex items-center gap-4 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Stethoscope size={18} className="text-blue-700" />
                  </div>
                  <span className="font-medium text-gray-800">{d.name}</span>
                </button>
              ))
            )}
          </div>
        )}

        {/* Step 1 — Doctor */}
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Select a doctor in <span className="text-blue-700">{selectedDept?.name}</span>
            </p>
            {doctorLoading ? (
              <div className="text-sm text-gray-400 py-8 text-center">Loading doctors…</div>
            ) : doctors.length === 0 ? (
              <div className="card text-center py-10 text-gray-400 text-sm">No doctors available in this department.</div>
            ) : (
              doctors.map((d) => (
                <button
                  key={d._id}
                  onClick={() => { setSelectedDoctor(d); setStep(2); }}
                  className="w-full card text-left flex items-center gap-4 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
                >
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-teal-700 font-bold text-sm">Dr</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Dr. {d.name}</p>
                    {d.specialization && <p className="text-xs text-gray-400">{d.specialization}</p>}
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Step 2 — Date & Slot */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="label">Date</label>
              <input
                type="date"
                className="input"
                value={selectedDate}
                min={todayStr()}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <p className="label">Available Slots</p>
              {slotLoading ? (
                <div className="text-sm text-gray-400 py-6 text-center">Loading slots…</div>
              ) : slots.length === 0 ? (
                <div className="card text-center py-8 text-gray-400 text-sm">No slots found for this date.</div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s.time}
                      disabled={!s.available}
                      onClick={() => setSelectedSlot(s)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                        selectedSlot?.time === s.time
                          ? 'bg-blue-600 text-white border-blue-600'
                          : s.available
                          ? 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                      }`}
                    >
                      <Clock size={11} className="inline mr-1 -mt-0.5" />
                      {s.display}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              disabled={!selectedSlot}
              onClick={() => setStep(3)}
              className="btn-primary w-full disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3 — Confirm */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="card space-y-4">
              <h3 className="font-semibold text-gray-800">Booking Summary</h3>
              {[
                { label: 'Patient', value: user.name },
                { label: 'Department', value: selectedDept?.name },
                { label: 'Doctor', value: `Dr. ${selectedDoctor?.name}` },
                { label: 'Date', value: selectedDate },
                { label: 'Time', value: selectedSlot?.display },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                <span className="text-gray-500">Consultation Fee</span>
                <span className="font-semibold text-blue-700">₹200</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary w-full disabled:opacity-60"
            >
              {submitting ? 'Booking…' : 'Confirm Appointment'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

