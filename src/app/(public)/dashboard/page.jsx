'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { Pill, Stethoscope, FileText, Syringe } from 'lucide-react';
import Navbar from "@/components/Navbar"
import PatientDashboard from '@/components/dashboard/PatientDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import StaffDashboard from '@/components/dashboard/StaffDashboard';

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

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const [tokenData, setTokenData] = useState(null);
  const [loadingToken, setLoadingToken] = useState(false);
  const router = useRouter();

  // const fetchToken = useCallback(async () => {
  //   if (!user || user.role !== 'patient') {
  //     setLoadingToken(false);
  //     return;
  //   }
  //   try {
  //     const res = await fetch(`/api/token/my?userId=${user._id}`);
  //     const data = await res.json();
  //     if (data.data) setTokenData(data.data);
  //   } catch (error) {
  //     console.error('Failed to fetch token:', error);
  //   } finally {
  //     setLoadingToken(false);
  //   }
  // }, [user]);

  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/login');
  //   } else if (user) {
  //     fetchToken();
  //   }
  // }, [user, loading, router, fetchToken]);

  const createToken = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: user.name,
          phone: user.phone,
          userId: user._id,
        }),
      });
      const data = await res.json();
      if (data.data) {
        setTokenData(data.data);
      } else {
        alert(data.error || 'Failed to create token');
      }
    } catch (error) {
      console.error('Token creation failed:', error);
      alert('Something went wrong.');
    }
  };

  if (loading || loadingToken)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading your dashboard...</p>
      </div>
    );

  if (!user) return null;

  user.role == 'patient';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={logout} />
      {user.role === 'staff' && (
        <PatientDashboard
          user={user}
          tokenData={tokenData}
          createToken={createToken}
        />
      )}
      {user.role === 'admin' && <StaffDashboard user={user} />}
      {user.role === 'patient' && <AdminDashboard user={user} />}
    </div>
  );
}
