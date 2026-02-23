export default function StatsGrid({ stats }) {
  const items = [
    { label: 'Total Patients Today', val: stats.patientsToday },
    { label: 'Active Doctors', val: stats.activeDoctors },
    { label: 'Open Departments', val: stats.openDepartments },
    { label: 'Beds Occupied', val: stats.bedsOccupied },
    { label: 'Pending Reports', val: stats.pendingReports },
    {
      label: 'Revenue Today',
      val: `रू ${stats.revenueToday.toLocaleString()}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map(({ label, val }) => (
        <div key={label} className="card">
          <p className="text-xl font-bold text-gray-900">{val}</p>
          <p className="text-xs text-gray-400 mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}
