'use client';
import WelcomeCard from '@/components/patient/WelcomeCard';
import CtaButtons from '@/components/patient/CtaButtons';
import ActiveTokenSection from '@/components/patient/ActiveTokenSection';
import HealthInfoCards from '@/components/patient/HealthInfoCards';

export default function PatientDashboard({ user }) {
  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <WelcomeCard user={user} />
      <CtaButtons />
      <ActiveTokenSection userId={String(user._id)} />
      <HealthInfoCards />
    </main>
  );
}
