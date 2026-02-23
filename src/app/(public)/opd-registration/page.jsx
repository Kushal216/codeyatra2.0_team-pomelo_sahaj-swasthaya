'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BookAppointmentPage() {
  const { user, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) {
      fetchDepartments();
    }
  }, [user, loading]);

  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/departments');
      const data = await res.json();
      if (data.departments) setDepartments(data.departments);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
    setLoadingData(false);
  };

  const fetchDoctors = async (deptId) => {
    try {
      const res = await fetch(`/api/doctors?department=${deptId}`);
      const data = await res.json();
      if (data.doctors) setDoctors(data.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchSlots = async (doctorId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`/api/slots?date=${today}&doctorId=${doctorId}`);
      const data = await res.json();
      if (data.slots) setSlots(data.slots);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleDeptSelect = (dept) => {
    setSelectedDept(dept);
    fetchDoctors(dept._id);
    setStep(2);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    fetchSlots(doctor._id);
    setStep(3);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep(4);
  };

  const handleBooking = async () => {
    if (!selectedSlot || !selectedDoctor || !selectedDept) return;
    
    setBookingLoading(true);
    try {
      const res = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: user.name,
          phone: user.phone,
          userId: user._id,
          appointmentTime: selectedSlot.time,
          department: selectedDept._id,
          doctor: selectedDoctor._id
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        alert('Appointment booked successfully!');
        router.push('/dashboard');
      } else {
        alert(data.error || 'Failed to book appointment');
      }
    } catch (error) {
      alert('Error booking appointment');
    }
    setBookingLoading(false);
  };

  const getDepartmentIcon = (name) => {
    const icons = {
      'Orthopedics': '🦴',
      'Pediatrics': '👶',
      'Radiology': '📡',
      'Neurology': '🧠',
      'Eye': '👁️',
      'Cardiology': '❤️',
      'Dermatology': '',
      'ENT': '👂',
      'General': '🏥'
    };
    return icons[name] || '🏥';
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold text-lg">
                🏥 Sahaj Swasthya
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
              <Link href="/dashboard/appointments" className="text-gray-700 hover:text-blue-600 font-medium">Appointments</Link>
              <Link href="/dashboard/reports" className="text-gray-700 hover:text-blue-600 font-medium">Reports</Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/logout" className="text-red-600 hover:text-red-700 font-medium px-4 py-2">
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">OPD Registration</h1>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition ${
                  s <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {s < step ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s
                  )}
                </div>
                {s < 4 && (
                  <div className={`w-16 md:w-24 h-1 mx-2 transition ${
                    s < step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600 px-4">
            <span>Department</span>
            <span>Doctor</span>
            <span>Time Slot</span>
            <span>Confirm</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          
          {/* Step 1: Select Department */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Select Department</h2>
              <p className="text-gray-600 mb-6">Choose the specialty you need</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept) => (
                  <button
                    key={dept._id}
                    onClick={() => handleDeptSelect(dept)}
                    className="bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl p-6 text-left transition group"
                  >
                    <div className="text-4xl mb-3">{getDepartmentIcon(dept.name)}</div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-700">{dept.name}</h3>
                    <p className="text-sm text-gray-600">{dept.description || 'Medical care and treatment'}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Doctor */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <button 
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  ← Back
                </button>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Select Doctor</h2>
              <p className="text-gray-600 mb-6">Choose from our specialists in {selectedDept?.name}</p>
              
              <div className="space-y-4">
                {doctors.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No doctors available in this department</p>
                  </div>
                ) : (
                  doctors.map((doctor) => (
                    <button
                      key={doctor._id}
                      onClick={() => handleDoctorSelect(doctor)}
                      className="w-full bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl p-6 text-left transition flex items-center gap-4"
                    >
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                        👨‍⚕️
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">Dr. {doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialization || 'General Physician'}</p>
                        <p className="text-xs text-gray-500 mt-1">{doctor.experience || '5+ years'} experience</p>
                      </div>
                      <div className="text-blue-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Step 3: Select Time Slot */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <button 
                  onClick={() => setStep(2)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  ← Back
                </button>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Select Time Slot</h2>
              <p className="text-gray-600 mb-6">Choose your preferred appointment time</p>
              
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                    👨‍⚕️
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Dr. {selectedDoctor?.name}</p>
                    <p className="text-sm text-gray-600">{selectedDoctor?.specialization}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {slots.filter(s => s.available).map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => handleSlotSelect(slot)}
                    className="bg-gray-50 hover:bg-blue-600 hover:text-white border-2 border-gray-200 hover:border-blue-600 rounded-lg p-3 text-center font-medium transition"
                  >
                    {slot.display}
                  </button>
                ))}
              </div>

              {slots.filter(s => s.available).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-2">No slots available today</p>
                  <p className="text-sm text-gray-500">Please try another date or doctor</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <button 
                  onClick={() => setStep(3)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  ← Back
                </button>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Confirm Appointment</h2>
              <p className="text-gray-600 mb-6">Review your appointment details</p>
              
              <div className="space-y-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Department</p>
                  <p className="font-semibold text-gray-900">{selectedDept?.name}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Doctor</p>
                  <p className="font-semibold text-gray-900">Dr. {selectedDoctor?.name}</p>
                  <p className="text-sm text-gray-600">{selectedDoctor?.specialization}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedSlot?.time).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-lg font-bold text-blue-600 mt-1">
                    {new Date(selectedSlot?.time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Note:</span> Please arrive 15 minutes before your appointment time. Late arrivals may be subject to rescheduling.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-semibold transition"
                >
                  Change Slot
                </button>
                <button
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  {bookingLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Booking...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}