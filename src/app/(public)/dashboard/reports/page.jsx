'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import Navbar from '@/components/Navbar';
import {
  FlaskConical,
  ScanLine,
  ClipboardList,
  Download,
  Clock,
  CheckCircle,
  ChevronLeft,
} from 'lucide-react';

const TYPE_CONFIG = {
  Lab: {
    Icon: FlaskConical,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
  },
  Radiology: {
    Icon: ScanLine,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700',
  },
  Prescription: {
    Icon: ClipboardList,
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    badge: 'bg-teal-100 text-teal-700',
  },
};

const REPORT_FILTERS = ['All', 'Lab', 'Radiology'];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function RecordCard({ report }) {
  const config = TYPE_CONFIG[report.type] ?? TYPE_CONFIG.Lab;
  const { Icon } = config;
  const isAvailable = report.status === 'Available';

  const handleDownload = async () => {
    try {
      // Fetch the actual file from backend
      const response = await fetch(`/api/report/download?id=${report._id}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.title.replace(/\s+/g, '_')}_${formatDate(report.date)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download report. Please try again.');
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow duration-200 ${isAvailable ? 'border-gray-100' : 'border-yellow-200 bg-yellow-50/40'}`}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ring-2 ${config.bg.replace('50', '100')}`}
        >
          <Icon size={24} className={config.text} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-gray-900 leading-tight">
            {report.title}
          </p>
          <p className="text-base text-gray-600 mt-1">
            {report.doctor} ·{' '}
            <span className="text-gray-400">{report.department}</span>
          </p>
        </div>
        <span
          className={`shrink-0 text-sm px-3.5 py-1.5 rounded-full font-semibold ${config.badge}`}
        >
          {report.type}
        </span>
      </div>

      {/* Summary */}
      <p className="text-base text-gray-700 leading-relaxed mb-5">
        {report.summary}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {isAvailable ? (
            <CheckCircle size={18} className="text-green-500" />
          ) : (
            <Clock size={18} className="text-yellow-500" />
          )}
          <span
            className={`text-base font-semibold ${isAvailable ? 'text-green-600' : 'text-yellow-600'}`}
          >
            {isAvailable ? 'Available' : 'Pending'}
          </span>
          <span className="text-gray-300 text-lg">·</span>
          <span className="text-base text-gray-500 font-medium">
            {formatDate(report.date)}
          </span>
        </div>
        <button
          disabled={!isAvailable}
          onClick={handleDownload}
          className={`flex items-center gap-2 text-base font-semibold px-4 py-2.5 rounded-xl border transition-all duration-200 ${
            isAvailable
              ? 'text-blue-700 border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm'
              : 'text-gray-300 border-gray-100 cursor-not-allowed bg-gray-50'
          }`}
        >
          <Download size={18} />
          Download
        </button>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [mainTab, setMainTab] = useState('prescriptions');
  const [reportFilter, setReportFilter] = useState('All');
  const [reports, setReports] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (user?._id) {
      fetchReports();
    }
  }, [user?._id]);

  const fetchReports = async () => {
    try {
      setLoadingData(true);
      setError(null);
      const response = await fetch(`/api/report?userId=${user._id}`);
      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      setReports(data.reports || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Unable to load your medical records. Please try again.');
    } finally {
      setLoadingData(false);
    }
  };

  const PRESCRIPTIONS = reports.filter((r) => r.type === 'Prescription');
  const REPORTS = reports.filter((r) => r.type !== 'Prescription');

  const filteredReports =
    reportFilter === 'All'
      ? REPORTS
      : REPORTS.filter((r) => r.type === reportFilter);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold text-lg">
            Loading medical records...
          </p>
        </div>
      </div>
    );
  }

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold text-lg">
            Fetching your records...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar user={user} onLogout={logout} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Page header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors -ml-1"
            aria-label="Back to dashboard"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Medical Records
            </h1>
            <p className="text-base text-gray-600 mt-1.5 font-medium">
              Your prescriptions, lab results, and imaging reports
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                <Clock size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-base font-semibold text-red-800">
                  Unable to load records
                </p>
                <p className="text-base text-red-600 mt-1">{error}</p>
                <button
                  onClick={fetchReports}
                  className="mt-3 text-base font-semibold text-red-700 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main tabs - Enhanced */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 inline-flex">
          {[
            {
              key: 'prescriptions',
              label: 'Prescriptions',
              count: PRESCRIPTIONS.length,
            },
            { key: 'reports', label: 'Reports', count: REPORTS.length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setMainTab(key)}
              className={`px-6 py-3 rounded-xl text-base font-bold transition-all duration-200 flex items-center gap-2 ${
                mainTab === key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {label}
              <span
                className={`text-sm font-semibold px-2 py-0.5 rounded-lg ${
                  mainTab === key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Prescriptions tab */}
        {mainTab === 'prescriptions' &&
          (PRESCRIPTIONS.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList size={28} className="text-teal-600" />
              </div>
              <p className="text-lg font-semibold text-gray-700">
                No prescriptions on record
              </p>
              <p className="text-base text-gray-500 mt-2">
                Prescriptions will appear here after your appointments
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {PRESCRIPTIONS.map((r) => (
                <RecordCard key={r._id} report={r} />
              ))}
            </div>
          ))}

        {/* Reports tab */}
        {mainTab === 'reports' && (
          <div className="space-y-6">
            {/* Sub-filters - Enhanced */}
            <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-2 px-2">
              {REPORT_FILTERS.map((f) => {
                const count = REPORTS.filter((r) => r.type === f).length;
                return (
                  <button
                    key={f}
                    onClick={() => setReportFilter(f)}
                    className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-200 ${
                      reportFilter === f
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    {f}
                    {f !== 'All' && (
                      <span
                        className={`ml-2 text-xs font-semibold ${reportFilter === f ? 'text-blue-100' : 'text-gray-400'}`}
                      >
                        ({count})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {filteredReports.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FlaskConical size={28} className="text-blue-600" />
                </div>
                <p className="text-lg font-semibold text-gray-700">
                  No reports found
                </p>
                <p className="text-base text-gray-500 mt-2">
                  Try selecting a different category or check back later
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredReports.map((r) => (
                  <RecordCard key={r._id} report={r} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
