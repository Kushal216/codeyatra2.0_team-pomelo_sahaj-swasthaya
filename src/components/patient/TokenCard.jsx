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
      {/* Header: dept/doctor on left, token number + status on right */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {token.department?.name || '—'}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Dr. {token.doctor?.name || '—'}
          </p>
          {token.doctor?.specialization && (
            <p className="text-xs text-gray-400">
              {token.doctor.specialization}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-blue-700">
            #{token.tokenNumber}
          </span>
          <div
            className={`mt-1 text-xs px-2 py-0.5 rounded-full font-medium inline-block ${
              STATUS_CLASSES[token.status] ?? 'bg-green-100 text-green-700'
            }`}
          >
            {token.status}
          </div>
        </div>
      </div>

      {/* Stage + appointment time */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-400">Stage</p>
          <p className="font-semibold text-gray-800">{token.stage}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-400">Appointment Time</p>
          <p className="font-semibold text-gray-800">
            {token.appointmentTime ? formatTime(token.appointmentTime) : '—'}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Issued: {new Date(token.createdAt).toLocaleString()}
      </p>
      <button
        onClick={onCancel}
        disabled={disabled}
        className="btn-danger w-full mt-2"
      >
        Cancel Appointment
      </button>
    </div>
  );
}
