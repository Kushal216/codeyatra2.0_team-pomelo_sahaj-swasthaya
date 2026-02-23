import Link from 'next/link';

export default function CtaRow() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pb-4">
      <Link
        href="/dashboard"
        className="btn-primary flex-1 text-center py-4 text-base"
      >
        Go to Dashboard
      </Link>
      <Link
        href="/opd-registration"
        className="btn-secondary flex-1 text-center py-4"
      >
        Book an Appointment
      </Link>
    </div>
  );
}
