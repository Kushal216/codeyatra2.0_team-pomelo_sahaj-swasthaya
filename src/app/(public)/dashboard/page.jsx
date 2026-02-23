"use client";

import { useAuth } from "@/lib/context";
import Navbar from "@/components/Navbar";
import PatientDashboard from "@/components/dashboard/PatientDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import StaffDashboard from "@/components/dashboard/StaffDashboard";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();

  const [tokenData, setTokenData] = useState(null);
  const [loadingToken, setLoadingToken] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const createToken = async () => {
    if (!user) return;

    try {
      setLoadingToken(true);

      const res = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: user.name,
          phone: user.phone,
          userId: user._id,
        }),
      });

      const data = await res.json();

      if (data.data) {
        setTokenData(data.data);
      } else {
        alert(data.error || "Failed to create token");
      }
    } catch (error) {
      console.error("Token creation failed:", error);
      alert("Something went wrong.");
    } finally {
      setLoadingToken(false);
    }
  };

  // Hydration-safe loading state
  if (!mounted || loading || loadingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={logout} />

      {user.role === "patient" && (
        <PatientDashboard
          user={user}
          tokenData={tokenData}
          createToken={createToken}
        />
      )}

      {user.role === "staff" && <StaffDashboard user={user} />}

      {user.role === "admin" && <AdminDashboard user={user} />}
    </div>
  );
}
