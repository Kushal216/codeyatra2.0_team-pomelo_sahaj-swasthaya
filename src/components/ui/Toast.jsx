'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const STYLES = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200   bg-red-50   text-red-800',
};

const ICONS = {
  success: <CheckCircle size={16} className="text-green-500 shrink-0" />,
  error: <XCircle size={16} className="text-red-500   shrink-0" />,
};

export default function Toast({
  message,
  type = 'success',
  onClose,
  duration = 3500,
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium max-w-xs ${STYLES[type]}`}
    >
      {ICONS[type]}
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
