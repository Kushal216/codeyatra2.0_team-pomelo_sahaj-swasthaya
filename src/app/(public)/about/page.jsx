import NavbarWrapper from '@/components/NavbarWrapper';
import HeroSection from '@/components/about/HeroSection';
import StatsStrip from '@/components/about/StatsStrip';
import MissionCard from '@/components/about/MissionCard';
import PillarsGrid from '@/components/about/PillarsGrid';
import HackathonCard from '@/components/about/HackathonCard';
import CtaRow from '@/components/about/CtaRow';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarWrapper />
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-12">
        <HeroSection />
        <StatsStrip />
        <MissionCard />
        <PillarsGrid />
        <HackathonCard />
        <CtaRow />
      </main>
    </div>
  );
}
