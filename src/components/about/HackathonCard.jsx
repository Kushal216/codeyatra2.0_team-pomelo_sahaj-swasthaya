export default function HackathonCard() {
  return (
    <section className="card border border-blue-200 bg-linear-to-br from-blue-50 to-indigo-50 text-center space-y-3 py-8">
      <h2
        className="text-xl font-semibold text-blue-900"
        style={{ fontFamily: 'Fraunces,serif' }}
      >
        Built at CodeYatra 2.0
      </h2>
      <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
        Sahaj Swasthya is a hackathon project by Team Pomelo — a group of
        developers who believe that thoughtful software design can make everyday
        healthcare feel less overwhelming and more human.
      </p>
      <p className="text-blue-500 text-xs italic">
        &quot;Sahaj&quot; means effortless in Nepali. That&apos;s the standard
        we hold our product to.
      </p>
    </section>
  );
}
