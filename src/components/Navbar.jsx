'use client';
import Link from 'next/link';
import { useState } from 'react';

const PUBLIC_LINKS = [
  { label: 'Home', href: '/dashboard' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// ---- Navbar ----
export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  function handleLogout() {
    setOpen(false);
    if (typeof onLogout === 'function') onLogout();
  }

  const navLinks =
    user?.role === 'patient'
      ? [
          { label: 'Home', href: '/dashboard' },
          { label: 'Appointments', href: '/dashboard/appointments' },
          { label: 'Reports', href: '/dashboard/reports' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ]
      : PUBLIC_LINKS;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href={user ? '/dashboard' : '/'}
          className="flex items-center gap-2"
        >
          <div className="w-7 h-7 bg-blue-700 rounded-md flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 3v14M3 10h14"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span
            className="font-bold text-blue-700 text-base"
            style={{ fontFamily: 'Fraunces,serif' }}
          >
            Sahaj Swasthya
          </span>
        </Link>

        {/* No user — public nav */}
        {!user && (
          <nav className="hidden md:flex items-center gap-6">
            {PUBLIC_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm text-gray-600 hover:text-blue-700 font-medium"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="text-sm text-blue-700 font-medium hover:text-blue-800"
            >
              Login
            </Link>
          </nav>
        )}

        {/* Patient nav */}
        {user?.role === 'patient' && (
          <>
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-sm text-gray-600 hover:text-blue-700 font-medium"
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 font-medium hover:text-red-700"
              >
                Logout
              </button>
            </nav>
            <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {open ? (
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                ) : (
                  <>
                    <path d="M3 12h18" />
                    <path d="M3 6h18" />
                    <path d="M3 18h18" />
                  </>
                )}
              </svg>
            </button>
          </>
        )}

        {/* Staff / Admin nav */}
        {user && user.role !== 'patient' && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              {user.name}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                user.role === 'admin'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-teal-100 text-teal-700'
              }`}
            >
              {user.role === 'admin' ? 'Admin' : 'Staff'}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 font-medium hover:text-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-3">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-gray-700 font-medium py-1"
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={handleLogout}
              className="block text-sm text-red-600 font-medium py-1"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block text-sm text-blue-700 font-medium py-1"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
