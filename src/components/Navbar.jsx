"use client"
// import { useRouter } from 'next/router';
import { useState } from 'react'

// ---- Navbar ----
export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  // const router = useRouter();

  function handleLogout() {
    setOpen(false);
    if (typeof onLogout === 'function') {
      onLogout();
    }
    // router.push('/login');
  }

  const navLinks =
    user.role === 'patient'
      ? ['Home', 'Appointments', 'Reports', 'About', 'Contact']
      : [];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-700 rounded-md flex items-center justify-center flex-shrink-0">
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
        </div>

        {user.role === 'patient' && (
          <>
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-700 font-medium"
                >
                  {l}
                </a>
              ))}
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 font-medium hover:text-red-700"
              >
                Logout
              </button>
            </nav>

            {/* Mobile hamburger */}
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

        {user.role !== 'patient' && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              {user.name}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}
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
      {open && user.role === 'patient' && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-3">
          {navLinks.map((l) => (
            <a
              key={l}
              href="#"
              className="block text-sm text-gray-700 font-medium py-1"
            >
              {l}
            </a>
          ))}
          <button
            onClick={handleLogout}
            className="block text-sm text-red-600 font-medium py-1"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
