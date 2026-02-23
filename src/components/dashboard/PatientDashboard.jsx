'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Pill, Stethoscope, FileText, Syringe, RefreshCw } from 'lucide-react';

const POLL_INTERVAL = 30_000; // 30 seconds

function PatientDashboard({ user }) {
  const [tokenData, setTokenData] = useState(null);
  const [loadingToken, setLoadingToken] = useState(true);
  const [tokenError, setTokenError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef(null);
  const router = useRouter();

  const userId = String(user._id);

  const fetchToken = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoadingToken(true);
      else setRefreshing(true);
      setTokenError(null);

      try {
        const res = await fetch(`/api/token/my?userId=${userId}`);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = await res.json();

        if (data.success) {
          setTokenData(data.token ?? null);
        } else {
          throw new Error(data.error || 'Failed to fetch token');
        }
      } catch (error) {
        console.error('Failed to fetch token:', error);
        setTokenError(error.message);
      } finally {
        setLoadingToken(false);
        setRefreshing(false);
      }
    },
    [userId]
  );

  // Initial fetch + polling
  useEffect(() => {
    fetchToken();

    intervalRef.current = setInterval(() => {
      fetchToken({ silent: true });
    }, POLL_INTERVAL);

    return () => clearInterval(intervalRef.current);
  }, [fetchToken]);

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
            ID: <strong className="text-gray-800">{user._id}</strong>
          </span>
          <span>
            Phone: <strong className="text-gray-800">{user.phone}</strong>
          </span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => router.push('/opd-registration')}
          className="btn-primary flex-1 text-center text-base py-4"
        >
          Book an Appointment
        </button>
        <button
          onClick={() => router.push('/dashboard/appointments')}
          className="btn-secondary flex-1 text-center"
        >
          My Appointments
        </button>
        <button
          onClick={() => router.push('/dashboard/reports')}
          className="btn-secondary flex-1 text-center"
        >
          View Medical History
        </button>
      </div>

      {/* Active Token */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-800">
            Active Token
          </h3>
          <button
            onClick={() => fetchToken({ silent: true })}
            disabled={refreshing || loadingToken}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 disabled:opacity-40"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {loadingToken ? (
          <div className="card text-center py-8 text-gray-400 text-sm">
            Loading...
          </div>
        ) : tokenError ? (
          <div className="card text-center py-8 space-y-2">
            <p className="text-sm text-red-500">{tokenError}</p>
            <button
              onClick={() => fetchToken()}
              className="text-xs text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : tokenData ? (
          <div className="card border-l-4 border-l-blue-600 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {tokenData.department?.name || '—'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Dr. {tokenData.doctor?.name || '—'}
                </p>
                {tokenData.doctor?.specialization && (
                  <p className="text-xs text-gray-400">
                    {tokenData.doctor.specialization}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-blue-700">
                  #{tokenData.tokenNumber}
                </span>
                <div
                  className={`mt-1 text-xs px-2 py-0.5 rounded-full font-medium inline-block ${
                    tokenData.status === 'Waiting'
                      ? 'bg-yellow-100 text-yellow-700'
                      : tokenData.status === 'InProgress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                  }`}
                >
                  {tokenData.status}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Stage</p>
                <p className="font-semibold text-gray-800">{tokenData.stage}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Appointment Time</p>
                <p className="font-semibold text-gray-800">
                  {tokenData.appointmentTime
                    ? new Date(tokenData.appointmentTime).toLocaleTimeString(
                        [],
                        { hour: '2-digit', minute: '2-digit' }
                      )
                    : '—'}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Issued: {new Date(tokenData.createdAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="card text-center py-8 text-gray-400 text-sm">
            No active token. Book an appointment to get started.
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
    </main>
  );
}

export default PatientDashboard;
