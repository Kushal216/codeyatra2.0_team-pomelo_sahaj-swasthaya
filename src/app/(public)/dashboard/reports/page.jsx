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
import { MOCK_REPORTS } from './mockReports';

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

const PRESCRIPTIONS = MOCK_REPORTS.filter((r) => r.type === 'Prescription');
const REPORTS = MOCK_REPORTS.filter((r) => r.type !== 'Prescription');

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

  return (
    <div
      className={`card border flex flex-col space-y-3 ${
        isAvailable ? 'border-gray-200' : 'border-yellow-100 bg-yellow-50/30'
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}
        >
          <Icon size={18} className={config.text} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-snug">
            {report.title}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {report.doctor} · {report.department}
          </p>
        </div>
        <span
          className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}
        >
          {report.type}
        </span>
      </div>

      {/* Summary */}
      <p className="text-xs text-gray-500 leading-relaxed flex-1">
        {report.summary}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs">
          {isAvailable ? (
            <CheckCircle size={13} className="text-green-500" />
          ) : (
            <Clock size={13} className="text-yellow-500" />
          )}
          <span className={isAvailable ? 'text-green-600' : 'text-yellow-600'}>
            {isAvailable ? 'Available' : 'Pending'}
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-400">{formatDate(report.date)}</span>
        </div>
        <button
          disabled={!isAvailable}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
            isAvailable
              ? 'text-blue-700 border-blue-200 hover:bg-blue-50'
              : 'text-gray-300 border-gray-100 cursor-not-allowed'
          }`}
        >
          <Download size={12} />
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

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  const filteredReports =
    reportFilter === 'All'
      ? REPORTS
      : REPORTS.filter((r) => r.type === reportFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={logout} />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Page header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors -ml-1"
            aria-label="Back to dashboard"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1
              className="text-xl font-semibold text-gray-900"
              style={{ fontFamily: 'Fraunces,serif' }}
            >
              Medical Records
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Your prescriptions, lab results, and imaging reports
            </p>
          </div>
        </div>

        {/* Main tabs */}
        <div className="flex border-b border-gray-200">
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
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                mainTab === key
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
              <span
                className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  mainTab === key
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-500'
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
            <div className="card text-center py-12 text-gray-400 text-sm">
              No prescriptions on record.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRESCRIPTIONS.map((r) => (
                <RecordCard key={r.id} report={r} />
              ))}
            </div>
          ))}

        {/* Reports tab */}
        {mainTab === 'reports' && (
          <div className="space-y-4">
            {/* Sub-filters */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {REPORT_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setReportFilter(f)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    reportFilter === f
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-700'
                  }`}
                >
                  {f}
                  {f !== 'All' && (
                    <span
                      className={`ml-1.5 text-xs ${
                        reportFilter === f ? 'opacity-70' : 'text-gray-400'
                      }`}
                    >
                      {REPORTS.filter((r) => r.type === f).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {filteredReports.length === 0 ? (
              <div className="card text-center py-12 text-gray-400 text-sm">
                No reports found for this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredReports.map((r) => (
                  <RecordCard key={r.id} report={r} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
