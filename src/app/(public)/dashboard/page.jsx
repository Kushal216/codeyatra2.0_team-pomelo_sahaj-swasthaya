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
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center px-4">
      <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600 mx-auto mb-5"></div>
      <p className="text-gray-700 font-semibold text-lg">Loading your dashboard...</p>
      <p className="text-gray-500 text-base mt-2">Please wait while we prepare your experience</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const isClient = useIsClient();

  if (!isClient || loading) return <Loader />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      {/* Subtle Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-red-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10">
        <Navbar user={user} onLogout={logout} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Welcome Banner - Enhanced */}
          <div className="mb-10">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Left: User Info */}
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl ring-4 ring-blue-100">
                    {user.role === 'patient'
                      ? '👤'
                      : user.role === 'staff'
                        ? '🏥'
                        : '⚙️'}
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                      Welcome back, {user.name?.split(' ')[0]}
                    </h1>
                    <p className="text-gray-600 text-lg capitalize mt-1 font-medium">
                      {user.role} dashboard
                    </p>
                  </div>
                </div>

                {/* Right: Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold tracking-wide ${
                      user.role === 'patient'
                        ? 'bg-blue-100 text-blue-800'
                        : user.role === 'staff'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                  {user.insured && (
                    <span className="px-4 py-2 rounded-full text-sm font-bold tracking-wide bg-green-100 text-green-800 flex items-center gap-1.5">
                      <span className="text-green-600">✓</span> Insured
                    </span>
                  )}
                  <span className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 bg-gray-100">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Role-Based Dashboard Container - Enhanced */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Subtle header for the container */}
            <div className="px-8 py-5 bg-linear-to-r from-gray-50 to-white border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <p className="text-gray-700 font-semibold text-lg">
                  {user.role === 'patient' && 'Your Health Overview'}
                  {user.role === 'staff' && 'Queue Management'}
                  {user.role === 'admin' && 'System Administration'}
                </p>
              </div>
            </div>

            {/* Dashboard Content with extra padding for readability */}
            <div className="p-6 md:p-8">
              {user.role === 'patient' && <PatientDashboard user={user} />}
              {user.role === 'staff' && <StaffDashboard user={user} />}
              {user.role === 'admin' && <AdminDashboard user={user} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
