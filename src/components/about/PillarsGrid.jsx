import {
  ClipboardList,
  Clock3,
  Users,
  ShieldCheck,
  HeartPulse,
  LayoutDashboard,
} from 'lucide-react';
import { PILLARS } from './aboutData';

const ICON_MAP = {
  ClipboardList,
  Clock3,
  Users,
  ShieldCheck,
  HeartPulse,
  LayoutDashboard,
};

export default function PillarsGrid() {
  return (
    <section className="space-y-4">
      <h2
        className="text-lg font-semibold text-gray-900"
        style={{ fontFamily: 'Fraunces,serif' }}
      >
        What we&apos;re building
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PILLARS.map(({ iconName, title, desc, bg, color }) => {
          const Icon = ICON_MAP[iconName];
          return (
            <div key={title} className="card space-y-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg}`}
              >
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
