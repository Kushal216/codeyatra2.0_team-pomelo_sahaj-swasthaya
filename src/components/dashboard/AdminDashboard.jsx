'use client';
import { useAdminStats } from '@/components/admin/useAdminStats';
import StatsGrid from '@/components/admin/StatsGrid';
import DeptLoadList from '@/components/admin/DeptLoadList';

const QUICK_ACTIONS = ['Manage Staff', 'Departments', 'Reports', 'Settings'];

export default function AdminDashboard({ user }) {
  const { stats, loading, error } = useAdminStats();

  if (loading)
    return (
      <div className="p-6 text-gray-400 text-sm">Loading dashboard...</div>
    );
  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>;

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="card border-l-4 border-l-purple-600">
        <p className="text-xs text-gray-400">Administration</p>
        <h2
          className="text-xl font-semibold"
          style={{ fontFamily: 'Fraunces,serif' }}
        >
          {user.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1">System Administrator</p>
      </div>

      <StatsGrid stats={stats} />

      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a}
              className="card text-sm font-medium text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-colors text-center py-4"
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <DeptLoadList departmentLoad={stats.departmentLoad} />
    </main>
  );
}
