'use client';
import { useSyncExternalStore } from 'react';
import { useAuth } from '@/lib/context';
import Navbar from '@/components/Navbar';
import PatientDashboard from '@/components/dashboard/PatientDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import StaffDashboard from '@/components/dashboard/StaffDashboard';

// Returns false on the server, true on the client — no setState needed.
const useIsClient = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="text-gray-400 text-sm">Loading your dashboard...</p>
  </div>
);

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const isClient = useIsClient();

  if (!isClient || loading) return <Loader />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={logout} />
      {user.role === 'patient' && <PatientDashboard user={user} />}
      {user.role === 'staff' && <StaffDashboard user={user} />}
      {user.role === 'admin' && <AdminDashboard user={user} />}
    </div>
  );
}
