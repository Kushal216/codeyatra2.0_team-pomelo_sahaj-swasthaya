import { STATS } from './aboutData';

export default function StatsStrip() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {STATS.map(({ value, label }) => (
        <div key={label} className="card text-center">
          <p
            className="text-xl font-bold text-blue-700"
            style={{ fontFamily: 'Fraunces,serif' }}
          >
            {value}
          </p>
          <p className="text-xs text-gray-400 mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}
