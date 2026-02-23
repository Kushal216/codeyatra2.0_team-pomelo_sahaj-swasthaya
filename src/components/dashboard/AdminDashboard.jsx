"use client";
import React, { useEffect, useState } from "react";

/* Small reusable card for statistics */
function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition">
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

/* Reusable card for quick action links */
function ActionCard({ label, link }) {
  return (
    <a
      href={link}
      className="bg-white border border-gray-200 rounded-xl p-4 text-center text-sm font-medium text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition shadow-sm"
    >
      {label}
    </a>
  );
}

function AdminDashboard({ user }) {
  // Main dashboard state
  const [stats, setStats] = useState({
    patientsToday: 0,
    activeDoctors: 0,
    openDepartments: 0,
    bedsOccupied: "0 / 0",
    pendingReports: 0,
    revenueToday: 0,
    departmentLoad: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard statistics on mount
  useEffect(() => {
    async function fetchStats() {
      try {
        const today = new Date().toISOString().split("T")[0];

        // Patients waiting today
        const queueRes = await fetch(`/api/token?status=Waiting`);
        const queueData = await queueRes.json();
        const patientsToday = queueData.tokens?.length || 0;

        // Active doctors
        const docRes = await fetch(`/api/doctors`);
        const docData = await docRes.json();
        const activeDoctors = docData.doctors?.length || 0;

        // Open departments
        const deptRes = await fetch(`/api/departments`);
        const deptData = await deptRes.json();
        const openDepartments = deptData.departments?.length || 0;

        // Pending lab reports
        const reportRes = await fetch(`/api/token?stage=Lab`);
        const reportData = await reportRes.json();
        const pendingReports = reportData.tokens?.length || 0;

        // Load per department (waiting tokens only)
        const departmentLoad = deptData.departments
          ? await Promise.all(
              deptData.departments.map(async (dept) => {
                const deptQueueRes = await fetch(
                  `/api/token?department=${dept._id}&status=Waiting`
                );
                const deptQueueData = await deptQueueRes.json();

                return {
                  dept: dept.name,
                  load: deptQueueData.tokens?.length || 0,
                };
              })
            )
          : [];

        // Revenue calculation (appointments today × 200)
        const todayRes = await fetch(`/api/token?date=${today}`);
        const todayData = await todayRes.json();
        const appointmentsToday = todayData.tokens?.length || 0;
        const revenueToday = appointmentsToday * 200;

        // Update dashboard state
        setStats({
          patientsToday,
          activeDoctors,
          openDepartments,
          bedsOccupied: "62 / 80", // Static for now
          pendingReports,
          revenueToday,
          departmentLoad,
        });

        setLoading(false);
      } catch (err) {
        setError(`Error in stats: ${err}`);
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  // Loading state
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );

  // Error state
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Admin header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <p className="text-xs text-gray-400 uppercase tracking-wide">
          Administration Panel
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 mt-1">
          {user.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          System Administrator
        </p>
      </div>

      {/* Statistics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Patients Today" value={stats.patientsToday} />
        <StatCard label="Active Doctors" value={stats.activeDoctors} />
        <StatCard label="Open Departments" value={stats.openDepartments} />
        <StatCard label="Beds Occupied" value={stats.bedsOccupied} />
        <StatCard label="Pending Reports" value={stats.pendingReports} />
        <StatCard
          label="Revenue Today"
          value={`रू ${stats.revenueToday.toLocaleString()}`}
        />
      </div>

      {/* Quick actions section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <ActionCard label="Manage Staff" link="/admin/doctors" />
          <ActionCard label="Departments" link="/admin/departments" />
          <ActionCard label="Reports" link="/admin/reports" />
        </div>
      </div>

      {/* Department workload visualization */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Department Load
        </h3>

        <div className="space-y-4">
          {stats.departmentLoad.map((d) => {
            const MAX = 10; // Expected max capacity
            const pct = Math.min(Math.round((d.load / MAX) * 100), 100);

            // Color based on load percentage
            let color = "bg-green-500";
            if (pct >= 70) color = "bg-red-500";
            else if (pct >= 40) color = "bg-yellow-500";

            return (
              <div
                key={d.dept}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-800">
                    {d.dept}
                  </span>
                  <span className="text-gray-500">
                    {d.load} waiting
                  </span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-2 ${color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </main>
  );
}

export default AdminDashboard;