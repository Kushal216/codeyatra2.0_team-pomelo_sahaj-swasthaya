import { useState, useEffect } from 'react';

export function useAdminStats() {
  const [stats, setStats] = useState({
    patientsToday: 0,
    activeDoctors: 0,
    openDepartments: 0,
    bedsOccupied: '0 / 0',
    pendingReports: 0,
    revenueToday: 0,
    departmentLoad: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      try {
        const today = new Date().toISOString().split('T')[0];

        // Parallel fetches for independent data
        const [queueData, docData, deptData, reportData, todayData] =
          await Promise.all([
            fetch('/api/token?status=Waiting').then((r) => r.json()),
            fetch('/api/doctors').then((r) => r.json()),
            fetch('/api/departments').then((r) => r.json()),
            fetch('/api/token?stage=Lab').then((r) => r.json()),
            fetch(`/api/token?date=${today}`).then((r) => r.json()),
          ]);

        // Department load — active tokens per department (sequential after dept list)
        const departmentLoad = await Promise.all(
          (deptData.departments ?? []).map(async (dept) => {
            const res = await fetch(
              `/api/token?department=${dept._id}&status=Waiting`
            );
            const data = await res.json();
            return { dept: dept.name, load: data.tokens?.length ?? 0 };
          })
        );

        setStats({
          patientsToday: queueData.tokens?.length ?? 0,
          activeDoctors: docData.doctors?.length ?? 0,
          openDepartments: deptData.departments?.length ?? 0,
          bedsOccupied: '62 / 80',
          pendingReports: reportData.tokens?.length ?? 0,
          revenueToday: (todayData.tokens?.length ?? 0) * 200,
          departmentLoad,
        });
      } catch (err) {
        setError(`Error loading stats: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return { stats, loading, error };
}
