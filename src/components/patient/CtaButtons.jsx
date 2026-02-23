import Link from 'next/link';

export default function CtaButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Link
        href="/opd-registration"
        className="btn-primary flex-1 text-center text-base py-4"
      >
        Book an Appointment
      </Link>
      <Link
        href="/dashboard/appointments"
        className="btn-secondary flex-1 text-center"
      >
        My Appointments
      </Link>
      <Link
        href="/dashboard/reports"
        className="btn-secondary flex-1 text-center"
      >
        View Medical History
      </Link>
    </div>
  );
}
