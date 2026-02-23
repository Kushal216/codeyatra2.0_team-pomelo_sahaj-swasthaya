'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RefreshCw, ClipboardList, Building2, UserRound } from 'lucide-react';
import PrescriptionForm from './PrescriptionForm';

const TABS = ['Queue', 'Write Prescription'];
const ALL = 'All';

function StatusBadge({ status }) {
  const styles = {
    Waiting: 'bg-yellow-100 text-yellow-700',
    InProgress: 'bg-blue-100 text-blue-700',
    Completed: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${styles[status] ?? 'bg-gray-100 text-gray-600'}`}
    >
      {status}
    </span>
  );
}

function FilterPills({ label, icon: Icon, options, selected, onSelect }) {
  return (
    <div className="space-y-1.5">
      <p className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
        <Icon size={12} />
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {[ALL, ...options].map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              selected === opt
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-teal-400 hover:text-teal-700'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function QueueRow({ token, onPrescribe }) {
  return (
    <div className="card flex items-center justify-between gap-2">
      <div className="space-y-0.5 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {token.patientName}
        </p>
        <p className="text-xs text-gray-400">
          {token.department?.name ?? '—'} · Dr. {token.doctor?.name ?? '—'} ·{' '}
          Token #{token.tokenNumber}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <StatusBadge status={token.status} />
        {(token.status === 'Waiting' || token.status === 'InProgress') && (
          <button
            onClick={() => onPrescribe(token)}
            className="flex items-center gap-1 text-xs text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1.5 rounded-lg hover:bg-teal-100 transition font-medium"
          >
            <ClipboardList size={13} />
            Prescribe
          </button>
        )}
      </div>
    </div>
  );
}

function StatsRow({ tokens }) {
  const count = (status) => tokens.filter((t) => t.status === status).length;
  const stats = [
    { label: "Today's OPD", val: tokens.length },
    { label: 'Waiting', val: count('Waiting') },
    { label: 'In Progress', val: count('InProgress') },
    { label: 'Completed', val: count('Completed') },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="card text-center">
          <p className="text-2xl font-bold text-teal-600">{s.val}</p>
          <p className="text-xs text-gray-400 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function StaffDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('Queue');
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [rxPrefill, setRxPrefill] = useState(null); // pre-fill data for PrescriptionForm

  // Filter state
  const [selectedDept, setSelectedDept] = useState(ALL);
  const [selectedDoctor, setSelectedDoctor] = useState(ALL);

  // Only Waiting/InProgress tokens belong in the active queue list
  const activeTokens = useMemo(
    () =>
      tokens.filter(
        (t) => t.status !== 'Completed' && t.status !== 'Cancelled'
      ),
    [tokens]
  );

  // Derived unique departments from active tokens
  const departments = useMemo(() => {
    const seen = new Set();
    return activeTokens
      .map((t) => t.department?.name)
      .filter((name) => name && !seen.has(name) && seen.add(name));
  }, [activeTokens]);

  // Doctors belonging to the selected department (active tokens only)
  const doctorsInDept = useMemo(() => {
    const base =
      selectedDept === ALL
        ? activeTokens
        : activeTokens.filter((t) => t.department?.name === selectedDept);
    const seen = new Set();
    return base
      .map((t) => t.doctor?.name)
      .filter((name) => name && !seen.has(name) && seen.add(name));
  }, [activeTokens, selectedDept]);

  // Reset doctor filter whenever department changes
  const handleDeptSelect = (dept) => {
    setSelectedDept(dept);
    setSelectedDoctor(ALL);
  };

  // Final filtered token list (from active tokens only)
  const filteredTokens = useMemo(() => {
    return activeTokens.filter((t) => {
      const deptMatch =
        selectedDept === ALL || t.department?.name === selectedDept;
      const doctorMatch =
        selectedDoctor === ALL || t.doctor?.name === selectedDoctor;
      return deptMatch && doctorMatch;
    });
  }, [activeTokens, selectedDept, selectedDoctor]);

  // When a queue row's Prescribe button is clicked
  const handlePrescribe = (token) => {
    setRxPrefill({
      tokenId: token._id,
      tokenNumber: token.tokenNumber,
      doctorName: token.doctor?.name ?? '',
      department: token.department?.name ?? '',
      patientName: token.patientName ?? '',
    });
    setActiveTab('Write Prescription');
  };

  const fetchQueue = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError('');

    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`/api/token?date=${today}`);
      const data = await res.json();

      if (!res.ok || !data.success)
        throw new Error(data.error || 'Failed to load queue');
      setTokens(data.tokens ?? []);
      // Reset filters on full refresh
      setSelectedDept(ALL);
      setSelectedDoctor(ALL);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Called by PrescriptionForm after a prescription is successfully saved
  const handlePrescriptionSuccess = useCallback(() => {
    fetchQueue({ silent: true });
    setRxPrefill(null);
    setActiveTab('Queue');
  }, [fetchQueue]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Welcome card */}
      <div className="card border-l-4 border-l-teal-600">
        <p className="text-xs text-gray-400">Staff Portal</p>
        <h2
          className="text-xl font-semibold"
          style={{ fontFamily: 'Fraunces,serif' }}
        >
          {user.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1 capitalize">{user.role}</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-sm py-2 rounded-md font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Queue' && (
        <>
          {/* Stats — always show even while loading (based on full list) */}
          {!loading && !error && <StatsRow tokens={tokens} />}

          {/* Department + Doctor filters */}
          {!loading && !error && activeTokens.length > 0 && (
            <div className="card space-y-3">
              <FilterPills
                label="Department"
                icon={Building2}
                options={departments}
                selected={selectedDept}
                onSelect={handleDeptSelect}
              />
              {doctorsInDept.length > 0 && (
                <FilterPills
                  label="Doctor"
                  icon={UserRound}
                  options={doctorsInDept}
                  selected={selectedDoctor}
                  onSelect={setSelectedDoctor}
                />
              )}
            </div>
          )}

          {/* Queue header + refresh */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">
              Today&apos;s Patient Queue
              {(selectedDept !== ALL || selectedDoctor !== ALL) && (
                <span className="ml-2 text-xs font-normal text-teal-600">
                  {filteredTokens.length} shown
                </span>
              )}
            </h3>
            <button
              onClick={() => fetchQueue({ silent: true })}
              disabled={refreshing || loading}
              className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 disabled:opacity-40"
            >
              <RefreshCw
                size={13}
                className={refreshing ? 'animate-spin' : ''}
              />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="card text-center py-10 text-gray-400 text-sm">
              Loading queue…
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="card text-center py-10 space-y-2">
              <p className="text-sm text-red-500">{error}</p>
              <button
                onClick={() => fetchQueue()}
                className="text-xs text-teal-600 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty — no active patients today */}
          {!loading && !error && activeTokens.length === 0 && (
            <div className="card text-center py-10 text-gray-400 text-sm">
              {tokens.length > 0
                ? 'All patients for today have been attended to.'
                : 'No patients in the queue today.'}
            </div>
          )}

          {/* Empty after filtering */}
          {!loading &&
            !error &&
            activeTokens.length > 0 &&
            filteredTokens.length === 0 && (
              <div className="card text-center py-10 text-gray-400 text-sm">
                No patients match the selected filters.
              </div>
            )}

          {/* Token rows */}
          {!loading && !error && filteredTokens.length > 0 && (
            <div className="space-y-2">
              {filteredTokens.map((t) => (
                <QueueRow key={t._id} token={t} onPrescribe={handlePrescribe} />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'Write Prescription' && (
        <PrescriptionForm
          prefill={rxPrefill}
          onSuccess={handlePrescriptionSuccess}
        />
      )}
    </main>
  );
}

export default StaffDashboard;
