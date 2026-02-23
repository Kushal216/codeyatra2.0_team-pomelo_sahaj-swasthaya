import { Pill, Stethoscope, FileText, Syringe } from 'lucide-react';

const ITEMS = [
  { Icon: Pill, label: 'Active Prescriptions', val: '2' },
  { Icon: Stethoscope, label: 'Last Visit', val: 'Jan 12' },
  { Icon: FileText, label: 'Lab Reports', val: '3' },
  { Icon: Syringe, label: 'Vaccinations', val: 'Up to date' },
];

export default function HealthInfoCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {ITEMS.map(({ Icon, label, val }) => (
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
  );
}
