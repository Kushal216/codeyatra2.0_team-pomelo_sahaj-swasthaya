'use client';

const STATUS_CLASSES = {
  Waiting: 'bg-yellow-100 text-yellow-700',
  InProgress: 'bg-blue-100 text-blue-700',
};

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TokenCard({ token, onCancel, disabled }) {
  return (
    <div className="card border-l-4 border-l-blue-600 space-y-3">
      {/* Header: token number + status */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400">Your Token</p>
          <span className="text-2xl font-bold text-blue-700">
            #{token.tokenNumber}
          </span>
        </div>
        <div
          className={`text-xs px-2 py-0.5 rounded-full font-medium self-start mt-1 ${
            STATUS_CLASSES[token.status] ?? 'bg-green-100 text-green-700'
          }`}
        >
          {token.status}
        </div>
      </div>

      {/* Dept · Doctor · Time in one row */}
      <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-gray-400 mb-0.5">Department</p>
          <p className="font-semibold text-gray-800 truncate">
            {token.department?.name || '—'}
          </p>
        </div>
        <div>
          <p className="text-gray-400 mb-0.5">Doctor</p>
          <p className="font-semibold text-gray-800 truncate">
            Dr. {token.doctor?.name || '—'}
          </p>
        </div>
        <div>
          <p className="text-gray-400 mb-0.5">Time</p>
          <p className="font-semibold text-gray-800">
            {token.appointmentTime ? formatTime(token.appointmentTime) : '—'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Issued: {new Date(token.createdAt).toLocaleString()}
        </p>
        <button
          onClick={onCancel}
          disabled={disabled}
          className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
