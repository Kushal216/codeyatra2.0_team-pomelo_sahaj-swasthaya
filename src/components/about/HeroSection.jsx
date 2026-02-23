import { HeartPulse } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="text-center space-y-4">
      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100">
        <HeartPulse size={13} />
        Hospital Management, Simplified
      </div>
      <h1
        className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight"
        style={{ fontFamily: 'Fraunces,serif' }}
      >
        Healthcare that works{' '}
        <span className="text-blue-700">as fast as you need it to</span>
      </h1>
      <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
        Sahaj Swasthya is a digital-first hospital management platform built to
        eliminate the friction between patients and care — from booking an OPD
        slot to tracking a live queue token to accessing lab reports.
      </p>
    </section>
  );
}
