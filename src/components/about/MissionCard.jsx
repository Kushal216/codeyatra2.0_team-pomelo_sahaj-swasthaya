export default function MissionCard() {
  return (
    <section className="card border-l-4 border-l-blue-700 space-y-2">
      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
        Our Mission
      </p>
      <h2
        className="text-lg font-semibold text-gray-900"
        style={{ fontFamily: 'Fraunces,serif' }}
      >
        Remove every unnecessary step between a patient and their doctor
      </h2>
      <p className="text-sm text-gray-500 leading-relaxed">
        Indian hospitals manage thousands of outpatient visits daily on systems
        built for administrators, not people. We believe the technology layer of
        healthcare should be invisible — it should just work. Sahaj Swasthya
        replaces paper tokens, crowded waiting rooms, and disconnected records
        with a single, cohesive platform that every stakeholder can rely on.
      </p>
    </section>
  );
}
