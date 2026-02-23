"use client";
import React, { useEffect, useState } from "react";

function AdminDashboard({ user }) {
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

  useEffect(() => {
    async function fetchStats() {
      try {
        // Patients Today
        const today = new Date().toISOString().split("T")[0];
        const queueRes = await fetch(`/api/token?status=Waiting`);
        const queueData = await queueRes.json();
        const patientsToday = queueData.tokens ? queueData.tokens.length : 0;

        // Active Doctors
        const docRes = await fetch(`/api/doctors`);
        const docData = await docRes.json();
        const activeDoctors = docData.doctors ? docData.doctors.length : 0;

        // Open Departments
        const deptRes = await fetch(`/api/departments`);
        const deptData = await deptRes.json();
        const openDepartments = deptData.departments
          ? deptData.departments.length
          : 0;

        // Pending Reports
        const reportRes = await fetch(`/api/report/upload`);
        const reportData = await reportRes.json();
        const pendingReports = reportData.reports
          ? reportData.reports.length
          : 0;

        // Department Load (example: count tokens per department)
        const departmentLoad = deptData.departments
          ? await Promise.all(
              deptData.departments.map(async (dept) => {
                const deptQueueRes = await fetch(
                  `/api/token?department=${dept._id}`,
                );
                const deptQueueData = await deptQueueRes.json();
                const load = deptQueueData.tokens
                  ? deptQueueData.tokens.length
                  : 0;
                return { dept: dept.name, load };
              }),
            )
          : [];

        // Beds Occupied and Revenue Today (placeholder, update with real logic if available)
        const bedsOccupied = "62 / 80";
        const revenueToday = 84200;

        setStats({
          patientsToday,
          activeDoctors,
          openDepartments,
          bedsOccupied,
          pendingReports,
          revenueToday,
          departmentLoad,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard stats");
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="card border-l-4 border-l-purple-600">
        <p className="text-xs text-gray-400">Administration</p>
        <h2
          className="text-xl font-semibold"
          style={{ fontFamily: "Fraunces,serif" }}
        >
          {user.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1">System Administrator</p>
      </div>

      {/* Hospital overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Patients Today", val: stats.patientsToday },
          { label: "Active Doctors", val: stats.activeDoctors },
          { label: "Open Departments", val: stats.openDepartments },
          { label: "Beds Occupied", val: stats.bedsOccupied },
          { label: "Pending Reports", val: stats.pendingReports },
          { label: "Revenue Today", val: `₹${stats.revenueToday}` },
        ].map((s) => (
          <div key={s.label} className="card">
            <p className="text-xl font-bold text-gray-900">{s.val}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["Manage Staff", "Departments", "Reports", "Settings"].map((a) => (
            <button
              key={a}
              className="card text-sm font-medium text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-colors text-center py-4"
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Department load */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Department Load
        </h3>
        <div className="space-y-2">
          {stats.departmentLoad.map((d) => (
            <div key={d.dept} className="card">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-800">{d.dept}</span>
                <span className="text-gray-500">{d.load}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className={`h-2 rounded-full ${d.load > 75 ? "bg-red-500" : d.load > 50 ? "bg-yellow-500" : "bg-green-500"}`}
                  style={{ width: `${Math.min(d.load, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;
