"use client";
import Link from "next/link";
import { useState } from "react";

const PUBLIC_LINKS = [
  { label: "Home", href: "/dashboard" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const PATIENT_LINKS = [
  { label: "Home", href: "/dashboard" },
  { label: "Appointments", href: "/dashboard/appointments" },
  { label: "Reports", href: "/dashboard/reports" },
  { label: "About", href: "/about" },
];

const STAFF_LINKS = [
  { label: "Dashboard", href: "/staff" },
  { label: "Queue", href: "/staff" },
  { label: "Prescriptions", href: "/staff" },
];

const ADMIN_LINKS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Departments", href: "/admin/departments" },
  { label: "Doctors", href: "/admin/doctors" },
  { label: "Staff", href: "/admin/staff" },
];

// ---- Navbar ----
export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  function handleLogout() {
    setOpen(false);
    if (typeof onLogout === "function") onLogout();
  }

  const navLinks =
    user?.role === "patient"
      ? PATIENT_LINKS
      : user?.role === "staff"
        ? STAFF_LINKS
        : user?.role === "admin"
          ? ADMIN_LINKS
          : PUBLIC_LINKS;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:shadow-xl transition-shadow duration-200">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 3v14M3 10h14"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="font-extrabold text-blue-700 text-xl tracking-tight">
              Sahaj Swasthya
            </span>
          </Link>

          {/* No user — public nav */}
          {!user && (
            <nav className="hidden md:flex items-center gap-1">
              {PUBLIC_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="px-4 py-2 text-base font-medium text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="ml-2 px-5 py-2.5 text-base font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200"
              >
                Login
              </Link>
            </nav>
          )}

          {/* Patient nav */}
          {user?.role === "patient" && (
            <>
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="px-4 py-2 text-base font-medium text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    {l.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="ml-2 px-5 py-2.5 text-base font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200"
                >
                  Logout
                </button>
              </nav>
              <button 
                className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors" 
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          {user && user.role !== "patient" && (
            <>
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="px-4 py-2 text-base font-medium text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-3">
                {/* User info */}
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-blue-700 font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-right">
                    <p className="text-base font-semibold text-gray-900 leading-tight">{user.name}</p>
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-lg ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-teal-100 text-teal-700"
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-base font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200"
                >
                  Logout
                </button>
                
                {/* Mobile hamburger */}
                <button 
                  className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors" 
                  onClick={() => setOpen(!open)}
                  aria-label="Toggle menu"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu - Enhanced */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-gray-100">
              {user ? (
                <>
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-blue-700 font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">{user.name}</p>
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-lg ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-teal-100 text-teal-700"
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full mt-2 px-4 py-3 text-base font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-base font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}