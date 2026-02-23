'use client';
import { useState } from 'react';
import {
  Mail,
  User,
  Phone,
  Lock,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const ROLES = ['patient', 'staff', 'admin'];

function StatusBanner({ type, message }) {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium ${
        isError
          ? 'bg-red-50 border border-red-200 text-red-700'
          : 'bg-green-50 border border-green-200 text-green-700'
      }`}
    >
      {isError ? (
        <AlertCircle size={16} className="shrink-0" />
      ) : (
        <CheckCircle2 size={16} className="shrink-0" />
      )}
      {message}
    </div>
  );
}

function IconInput({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon size={18} className="text-gray-400" />
      </div>
      <input
        className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
        {...props}
      />
    </div>
  );
}

// ── Tab 1: Create new user ──────────────────────────────────────────────────
function CreateTab() {
  const empty = {
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'patient',
  };
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || 'Failed to create user');
      setStatus({
        type: 'success',
        message: `User "${data.user.name}" created successfully.`,
      });
      setForm(empty);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <StatusBanner {...status} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">
            Full Name
          </label>
          <IconInput
            icon={User}
            placeholder="Jane Doe"
            value={form.name}
            onChange={set('name')}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">
            Email
          </label>
          <IconInput
            icon={Mail}
            type="email"
            placeholder="jane@example.com"
            value={form.email}
            onChange={set('email')}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">
            Phone
          </label>
          <IconInput
            icon={Phone}
            type="tel"
            placeholder="9876543210"
            value={form.phone}
            onChange={set('phone')}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">
            Password
          </label>
          <IconInput
            icon={Lock}
            type="password"
            placeholder="Min 6 characters"
            value={form.password}
            onChange={set('password')}
            required
            minLength={6}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-gray-700">
          Role
        </label>
        <div className="flex gap-3">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setForm((f) => ({ ...f, role: r }))}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors capitalize ${
                form.role === r
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading ? 'Creating…' : 'Create User'}
      </button>
    </form>
  );
}

// ── Tab 2: Update existing user ────────────────────────────────────────────
function UpdateTab() {
  const [searchEmail, setSearchEmail] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'patient' });
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setStatus({ type: '', message: '' });
    setFoundUser(null);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to fetch users');
      const match = (data.users ?? []).find(
        (u) => u.email.toLowerCase() === searchEmail.trim().toLowerCase()
      );
      if (!match) throw new Error('No user found with that email.');
      setFoundUser(match);
      setForm({ name: match.name, email: match.email, role: match.role });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSearching(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: '', message: '' });
    try {
      const res = await fetch(`/api/admin/users/${foundUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || 'Failed to update user');
      setFoundUser(data.user);
      setStatus({ type: 'success', message: 'User updated successfully.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          Find user by email
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={17} className="text-gray-400" />
            </div>
            <input
              className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
              type="email"
              placeholder="user@example.com"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 shrink-0"
          >
            {searching ? '…' : 'Fetch'}
          </button>
        </div>
      </form>

      <StatusBanner {...status} />

      {/* Edit form */}
      {foundUser && (
        <form
          onSubmit={handleSave}
          className="space-y-5 pt-2 border-t border-gray-100"
        >
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            Editing — {foundUser._id}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <IconInput
                icon={User}
                placeholder="Full name"
                value={form.name}
                onChange={set('name')}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <IconInput
                icon={Mail}
                type="email"
                placeholder="email"
                value={form.email}
                onChange={set('email')}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Role
            </label>
            <div className="flex gap-3">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: r }))}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors capitalize ${
                    form.role === r
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function UserManagementPage() {
  const [tab, setTab] = useState('create');

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-8 py-8 text-center">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            User Management
          </h2>
          <p className="text-blue-100 text-sm mt-1.5">
            Create new accounts or update existing ones
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50">
          {[
            ['create', 'Create New'],
            ['update', 'Update User'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                tab === key
                  ? 'text-blue-700 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-8">
          {tab === 'create' ? <CreateTab /> : <UpdateTab />}
        </div>

        <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">Admin-only · Sahaj Swasthya</p>
        </div>
      </div>
    </div>
  );
}
