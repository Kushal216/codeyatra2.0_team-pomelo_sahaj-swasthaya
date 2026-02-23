"use client";
import { useSyncExternalStore } from "react";
import { useAuth } from "@/lib/context";
import Navbar from "@/components/Navbar";
import StaffDashboard from "@/components/dashboard/StaffDashboard";

// ── Hydration-safe client guard ───────────────────────────────────────────────
const useIsClient = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

// ── Loading skeleton ──────────────────────────────────────────────────────────
function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 text-sm">Loading staff portal...</p>
      </div>
    </div>
  );
}

// ── Access denied ─────────────────────────────────────────────────────────────
function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card text-center space-y-2 max-w-xs w-full">
        <p className="text-2xl">🚫</p>
        <p className="font-semibold text-gray-800">Access Denied</p>
        <p className="text-sm text-gray-500">This page is for staff only.</p>
        <a href="/login" className="btn-primary inline-block mt-2">
          Go to Login
        </a>
      </div>
    </div>
  );
}

// ── Staff layout wrapper ──────────────────────────────────────────────────────
function StaffLayout({ user, onLogout, children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function StaffPage() {
  const { user, logout, loading } = useAuth();
  const isClient = useIsClient();

  if (!isClient || loading) return <Loader />;
  if (!user || (user.role !== "staff" && user.role !== "admin"))
    return <Unauthorized />;

  return (
    <StaffLayout user={user} onLogout={logout}>
      <StaffDashboard user={user} />
    </StaffLayout>
  );
}
