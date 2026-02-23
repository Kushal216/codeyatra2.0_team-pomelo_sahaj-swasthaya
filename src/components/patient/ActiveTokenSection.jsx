'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import TokenCard from './TokenCard';

const POLL_INTERVAL = 30_000;

export default function ActiveTokenSection({ userId }) {
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef(null);

  const fetchToken = useCallback(
    async ({ silent = false } = {}) => {
      silent ? setRefreshing(true) : setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/token/my?userId=${userId}`);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = await res.json();
        if (data.success) setTokenData(data.token ?? null);
        else throw new Error(data.error || 'Failed to fetch token');
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
    fetchToken();
    intervalRef.current = setInterval(
      () => fetchToken({ silent: true }),
      POLL_INTERVAL
    );
    return () => clearInterval(intervalRef.current);
  }, [fetchToken]);

  const handleCancel = async () => {
    if (!tokenData) return;
    if (
      !window.confirm(
        'Are you sure you want to cancel this appointment? This will remove all traces of this token.'
      )
    )
      return;
    try {
      const res = await fetch(`/api/token/${tokenData._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTokenData(null);
        alert('Appointment fully removed.');
      } else {
        alert(data.error || 'Failed to remove appointment.');
      }
    } catch {
      alert('Failed to remove appointment.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-800">Active Token</h3>
        <button
          onClick={() => fetchToken({ silent: true })}
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
            onClick={() => fetchToken()}
            className="text-xs text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : tokenData ? (
        <TokenCard
          token={tokenData}
          onCancel={handleCancel}
          disabled={loading || refreshing}
        />
      ) : (
        <div className="card text-center py-8 text-gray-400 text-sm">
          No active token. Book an appointment to get started.
        </div>
      )}
    </div>
  );
}
