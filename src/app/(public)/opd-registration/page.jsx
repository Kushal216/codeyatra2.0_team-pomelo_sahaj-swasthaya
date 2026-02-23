'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / GPay / PhonePe', icon: '📱' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'net', label: 'Net Banking', icon: '🏦' },
  { id: 'cash', label: 'Cash at Counter', icon: '💵' },
];

const DEPT_ICONS = {
  Cardiology: '🫀',
  Dental: '🦷',
  Ophthalmology: '👁️',
  Gynaecology: '🌸',
  Orthopaedics: '🦴',
  Dermatology: '🩺',
  Neurology: '🧠',
  Paediatrics: '🧒',
  ENT: '👂',
};

export default function OPDRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState('dept');
  const { user, loading } = useAuth();

  // API data
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Selections
  const [dept, setDept] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [slot, setSlot] = useState(null);
  const [details, setDetails] = useState({
    symptoms: '',
    duration: '',
    severity: 'Mild',
    history: '',
    allergies: '',
  });
  const [payMethod, setPayMethod] = useState('');
  const [ticketNo, setTicketNo] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Auth guard
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, router, user]);

  // Load departments on mount
  useEffect(() => {
    async function fetchDepts() {
      try {
        const res = await fetch('/api/departments');
        const data = await res.json();
        if (data.success) setDepartments(data.departments);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      } finally {
        setLoadingDepts(false);
      }
    }
    fetchDepts();
  }, []);

  // Load doctors when dept changes
  useEffect(() => {
    if (!dept) return;
    setDoctors([]);
    setDoctor(null);
    setSlots([]);
    setSlot(null);
    setLoadingDoctors(true);
    async function fetchDoctors() {
      try {
        const res = await fetch(`/api/doctors?department=${dept._id}`);
        const data = await res.json();
        if (data.success) setDoctors(data.doctors);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
      } finally {
        setLoadingDoctors(false);
      }
    }
    fetchDoctors();
  }, [dept]);

  // Load slots when doctor changes
  useEffect(() => {
    if (!doctor) return;
    setSlots([]);
    setSlot(null);
    setLoadingSlots(true);
    const today = new Date().toISOString().split('T')[0];
    async function fetchSlots() {
      try {
        const res = await fetch(
          `/api/slots?doctorId=${doctor._id}&date=${today}`
        );
        const data = await res.json();
        if (data.success) setSlots(data.slots);
      } catch (err) {
        console.error('Failed to fetch slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [doctor]);

  async function handlePayment() {
    setBookingLoading(true);
    setBookingError('');
    try {
      const res = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: user.name,
          phone: user.phone || '',
          userId: user._id,
          appointmentTime: slot.time,
          department: dept._id,
          doctor: doctor._id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBookingError(data.error || 'Booking failed. Please try again.');
        return;
      }
      setTicketNo('OPD-' + String(data.token.tokenNumber).padStart(4, '0'));
      setStep('success');
    } catch (err) {
      setBookingError('Network error. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  }

  if (!user) return null;

  // Step 1: Department
  if (step === 'dept')
    return (
      <PageWrapper onBack={() => router.push('/dashboard')}>
        <StepHeader
          activeStep={step}
          step="dept"
          title="Select Department"
          subtitle="Choose the specialty you need"
        />
        {loadingDepts ? (
          <p className="text-sm text-gray-400 text-center py-8">
            Loading departments...
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {departments.map((d) => (
              <button
                key={d._id}
                onClick={() => {
                  setDept(d);
                  setStep('slot');
                }}
                className="card text-left hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="text-2xl mb-2">
                  {DEPT_ICONS[d.name] || '🏥'}
                </div>
                <p className="text-sm font-semibold text-gray-900">{d.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{d.description}</p>
              </button>
            ))}
          </div>
        )}
      </PageWrapper>
    );

  // Step 2: Doctor + Slot
  if (step === 'slot')
    return (
      <PageWrapper onBack={() => setStep('dept')}>
        <StepHeader
          activeStep={step}
          step="slot"
          title={dept.name}
          subtitle="Select a doctor and time slot"
        />

        <div className="space-y-5">
          <div>
            <p className="label">Available Doctors</p>
            {loadingDoctors ? (
              <p className="text-sm text-gray-400">Loading doctors...</p>
            ) : doctors.length === 0 ? (
              <p className="text-sm text-gray-400">
                No doctors available for this department.
              </p>
            ) : (
              <div className="space-y-2">
                {doctors.map((d) => (
                  <button
                    key={d._id}
                    onClick={() => setDoctor(d)}
                    className={`w-full card text-left transition-colors ${doctor?._id === d._id ? 'border-blue-700 bg-blue-50' : 'hover:border-blue-200'}`}
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {d.name}
                    </p>
                    <p className="text-xs text-gray-400">{d.specialization}</p>
                    {doctor?._id === d._id && (
                      <p className="text-xs text-blue-600 mt-1 font-medium">
                        ✓ Selected
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {doctor && (
            <div>
              <p className="label">Available Slots — Today</p>
              {loadingSlots ? (
                <p className="text-sm text-gray-400">Loading slots...</p>
              ) : slots.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No slots available for today.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s.time}
                      disabled={!s.available}
                      onClick={() => setSlot(s)}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                        !s.available
                          ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                          : slot?.time === s.time
                            ? 'bg-blue-700 text-white border-blue-700'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'
                      }`}
                    >
                      {s.display}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {doctor && slot && (
            <button
              onClick={() => setStep('details')}
              className="btn-primary w-full"
            >
              Continue →
            </button>
          )}
        </div>
      </PageWrapper>
    );

  // Step 3: Problem Details
  if (step === 'details')
    return (
      <PageWrapper onBack={() => setStep('slot')}>
        <StepHeader
          activeStep={step}
          step="details"
          title="Describe your concern"
          subtitle="Help the doctor prepare for your visit"
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep('payment');
          }}
          className="space-y-4"
        >
          <div>
            <label className="label">Main Symptoms *</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Describe what you are experiencing..."
              value={details.symptoms}
              onChange={(e) =>
                setDetails({ ...details, symptoms: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="label">Duration *</label>
            <input
              className="input"
              placeholder="e.g. 3 days, 2 weeks..."
              value={details.duration}
              onChange={(e) =>
                setDetails({ ...details, duration: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="label">Severity</label>
            <div className="flex gap-2">
              {['Mild', 'Moderate', 'Severe'].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setDetails({ ...details, severity: s })}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    details.severity === s
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">
              Past Medical History{' '}
              <span className="text-gray-400 ml-1">(optional)</span>
            </label>
            <textarea
              className="input resize-none"
              rows={2}
              placeholder="Any previous diagnoses, surgeries..."
              value={details.history}
              onChange={(e) =>
                setDetails({ ...details, history: e.target.value })
              }
            />
          </div>
          <div>
            <label className="label">
              Known Allergies{' '}
              <span className="text-gray-400 ml-1">(optional)</span>
            </label>
            <input
              className="input"
              placeholder="e.g. Penicillin, dust..."
              value={details.allergies}
              onChange={(e) =>
                setDetails({ ...details, allergies: e.target.value })
              }
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Proceed to Payment →
          </button>
        </form>
      </PageWrapper>
    );

  // Step 4: Payment
  if (step === 'payment')
    return (
      <PageWrapper onBack={() => setStep('details')}>
        <StepHeader
          activeStep={step}
          step="payment"
          title="Payment"
          subtitle="Review and pay registration fee"
        />
        <div className="space-y-5">
          {/* Summary */}
          <div className="card bg-gray-50 border-gray-200 space-y-2 text-sm">
            <p className="font-semibold text-gray-800 mb-2">
              Appointment Summary
            </p>
            <SumRow label="Department" val={dept.name} />
            <SumRow label="Doctor" val={doctor.name} />
            <SumRow label="Time Slot" val={slot.display} />
            <SumRow
              label="Concern"
              val={
                details.symptoms.slice(0, 40) +
                (details.symptoms.length > 40 ? '...' : '')
              }
            />
            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold text-gray-900">
              <span>Registration Fee</span>
              <span className="text-blue-700">₹200</span>
            </div>
          </div>

          {/* Payment methods */}
          <div>
            <p className="label">Choose Payment Method</p>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => setPayMethod(pm.id)}
                  className={`w-full card text-left flex items-center gap-3 transition-colors ${
                    payMethod === pm.id
                      ? 'border-blue-700 bg-blue-50'
                      : 'hover:border-blue-200'
                  }`}
                >
                  <span className="text-xl">{pm.icon}</span>
                  <span className="text-sm font-medium text-gray-800">
                    {pm.label}
                  </span>
                  {payMethod === pm.id && (
                    <span className="ml-auto text-blue-600 text-sm">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {bookingError && (
            <p className="text-sm text-red-600 text-center">{bookingError}</p>
          )}
          {payMethod && (
            <button
              onClick={handlePayment}
              disabled={bookingLoading}
              className="btn-primary w-full text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {bookingLoading ? 'Booking...' : 'Pay ₹200 →'}
            </button>
          )}
        </div>
      </PageWrapper>
    );

  // Step 5: Success
  if (step === 'success')
    return (
      <PageWrapper onBack={null}>
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2.5"
            >
              <path
                d="M20 6L9 17l-5-5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2
            className="text-2xl font-semibold text-gray-900 mb-1"
            style={{ fontFamily: 'Fraunces,serif' }}
          >
            Booking Confirmed!
          </h2>
          <p className="text-gray-500 text-sm">
            Your appointment has been registered.
          </p>
        </div>

        <div className="card border-blue-200 bg-blue-50 text-center">
          <p className="text-xs text-gray-500 mb-1">Your Ticket Number</p>
          <p
            className="text-3xl font-bold text-blue-700 tracking-wider"
            style={{ fontFamily: 'Fraunces,serif' }}
          >
            {ticketNo}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {dept.name} · {doctor.name} · {slot.display}
          </p>
        </div>

        {/* QR Code using canvas */}
        <div className="flex flex-col items-center">
          <p className="text-xs text-gray-500 mb-3">
            Show this QR at the reception desk
          </p>
          <QRCodeCanvas value={ticketNo} />
        </div>

        <div className="card text-sm space-y-2">
          <p className="font-semibold text-gray-800">Instructions</p>
          <ul className="text-gray-500 space-y-1 text-xs">
            <li>• Arrive 15 minutes before your scheduled time</li>
            <li>• Carry a valid photo ID</li>
            <li>• Bring any previous prescriptions or reports</li>
            <li>• Show the QR code at the reception for instant check-in</li>
          </ul>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="btn-primary w-full"
        >
          Back to Dashboard
        </button>
      </PageWrapper>
    );

  return null;
}

function StepHeader({ title, subtitle, step, activeStep }) {
  const steps = ['dept', 'slot', 'details', 'payment', 'success'];
  const idx = steps.indexOf(activeStep);
  return (
    <div className="mb-6">
      {activeStep !== 'success' && (
        <div className="flex items-center gap-1 mb-4">
          {steps.slice(0, 4).map((st, i) => (
            <div key={st} className="flex items-center gap-1">
              <div
                className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium flex-shrink-0 ${
                  i < idx
                    ? 'bg-blue-700 text-white'
                    : i === idx
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-700'
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {i + 1}
              </div>
              {i < 3 && (
                <div
                  className={`h-0.5 w-8 flex-shrink-0 ${i < idx ? 'bg-blue-700' : 'bg-gray-200'}`}
                />
              )}
            </div>
          ))}
        </div>
      )}
      <h2
        className="text-xl font-semibold text-gray-900"
        style={{ fontFamily: 'Fraunces,serif' }}
      >
        {title}
      </h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function SumRow({ label, val }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right">{val}</span>
    </div>
  );
}

function PageWrapper({ children, onBack }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M19 12H5M12 5l-7 7 7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-700 rounded flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 3v14M3 10h14"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="font-semibold text-gray-800 text-sm">
              OPD Registration
            </span>
          </div>
        </div>
      </header>
      <div className="max-w-xl mx-auto px-4 py-6 space-y-5">{children}</div>
    </div>
  );
}

// Simple canvas-based QR Code (no external dep needed for proto)
function QRCodeCanvas({ value }) {
  // Generate a simple visual QR-like pattern from the value
  return (
    <div className="p-4 bg-white border-2 border-gray-200 rounded-xl inline-block">
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Finder patterns */}
        <rect x="10" y="10" width="40" height="40" rx="4" fill="#1d4ed8" />
        <rect x="16" y="16" width="28" height="28" rx="2" fill="white" />
        <rect x="22" y="22" width="16" height="16" rx="1" fill="#1d4ed8" />

        <rect x="110" y="10" width="40" height="40" rx="4" fill="#1d4ed8" />
        <rect x="116" y="16" width="28" height="28" rx="2" fill="white" />
        <rect x="122" y="22" width="16" height="16" rx="1" fill="#1d4ed8" />

        <rect x="10" y="110" width="40" height="40" rx="4" fill="#1d4ed8" />
        <rect x="16" y="116" width="28" height="28" rx="2" fill="white" />
        <rect x="22" y="122" width="16" height="16" rx="1" fill="#1d4ed8" />

        {/* Data dots derived from value string */}
        {Array.from(value).map((char, i) => {
          const code = char.charCodeAt(0);
          const col = (i * 7 + code) % 8;
          const row = Math.floor(i / 8) % 8;
          const x = 60 + col * 10;
          const y = 10 + row * 10;
          return code % 2 === 0 ? (
            <rect
              key={i}
              x={x}
              y={y}
              width="8"
              height="8"
              rx="1"
              fill="#1d4ed8"
            />
          ) : null;
        })}

        {/* Bottom data area */}
        {Array.from({ length: 24 }, (_, i) => {
          const seed = (value.charCodeAt(i % value.length) * (i + 3)) % 7;
          const col = i % 8;
          const row = Math.floor(i / 8);
          const x = 60 + col * 10;
          const y = 90 + row * 10;
          return seed > 3 ? (
            <rect
              key={`b${i}`}
              x={x}
              y={y}
              width="8"
              height="8"
              rx="1"
              fill="#1d4ed8"
            />
          ) : null;
        })}
      </svg>
      <p className="text-center text-xs text-gray-500 mt-2 font-mono tracking-wider">
        {value}
      </p>
    </div>
  );
}
