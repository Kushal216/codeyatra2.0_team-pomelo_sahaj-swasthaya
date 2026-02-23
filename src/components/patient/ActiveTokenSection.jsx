'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import TokenCard from './TokenCard';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Toast from '@/components/ui/Toast';

const POLL_INTERVAL = 30_000;

export default function ActiveTokenSection({ userId }) {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const intervalRef = useRef(null);

  const fetchTokens = useCallback(
    async ({ silent = false } = {}) => {
      silent ? setRefreshing(true) : setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/token/my?userId=${userId}&activeList=true`
        );
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = await res.json();
        if (data.success) setTokens(data.tokens ?? []);
        else throw new Error(data.error || 'Failed to fetch tokens');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    fetchTokens();
    intervalRef.current = setInterval(
      () => fetchTokens({ silent: true }),
      POLL_INTERVAL
    );
    return () => clearInterval(intervalRef.current);
  }, [fetchTokens]);

  const confirmCancel = async () => {
    const target = cancelTarget;
    setCancelTarget(null);
    try {
      const res = await fetch(`/api/token/${target._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTokens((prev) => prev.filter((t) => t._id !== target._id));
        setToast({
          message: 'Appointment cancelled successfully.',
          type: 'success',
        });
      } else {
        setToast({
          message: data.error || 'Failed to cancel appointment.',
          type: 'error',
        });
      }
    } catch {
      setToast({ message: 'Failed to cancel appointment.', type: 'error' });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-800">
          Upcoming Appointments
          {tokens.length > 0 && (
            <span className="ml-2 text-xs font-normal text-gray-400">
              {tokens.length} active
            </span>
          )}
        </h3>
        <button
          onClick={() => fetchTokens({ silent: true })}
          disabled={refreshing || loading}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 disabled:opacity-40"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="card text-center py-8 text-gray-400 text-sm">
          Loading...
        </div>
      ) : error ? (
        <div className="card text-center py-8 space-y-2">
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={() => fetchTokens()}
            className="text-xs text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : tokens.length === 0 ? (
        <div className="card text-center py-8 text-gray-400 text-sm">
          No active appointments. Book one to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {tokens.map((t) => (
            <TokenCard
              key={t._id}
              token={t}
              onCancel={() => setCancelTarget(t)}
              disabled={loading || refreshing}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!cancelTarget}
        message="Are you sure you want to cancel this appointment?"
        confirmLabel="Yes, cancel it"
        cancelLabel="Keep appointment"
        danger
        onConfirm={confirmCancel}
        onCancel={() => setCancelTarget(null)}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
