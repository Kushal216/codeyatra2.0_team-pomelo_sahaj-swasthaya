"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const [tokenData, setTokenData] = useState(null);
  const [loadingToken, setLoadingToken] = useState(true);
  const router = useRouter();

  // Fetch token (memoized to satisfy hook rules)
  const fetchToken = useCallback(async () => {
    if (!user) return;

    try {
      const res = await fetch(`/api/token/my?userId=${user._id}`);
      const data = await res.json();

      if (data.data) {
        setTokenData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch token:", error);
    } finally {
      setLoadingToken(false);
    }
  }, [user]);

  // Redirect or fetch token
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      fetchToken();
    }
  }, [user, loading, router, fetchToken]);

  const createToken = async () => {
    if (!user) return;

    try {
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
    }
  };

  if (loading || loadingToken) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Sahaj Swasthya</h1>
          <button
            onClick={logout}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            Logout
          </button>
        </div>

        {tokenData ? (
          /* Token Status View */
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-bold mb-4">
              Your Token: #{tokenData.tokenNumber}
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-500">Current Stage</p>
                <p className="text-lg font-bold text-blue-700">
                  {tokenData.stage}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-lg font-bold text-green-700">
                  {tokenData.status}
                </p>
              </div>

              <p className="text-sm text-gray-500">
                Created: {new Date(tokenData.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ) : (
          /* Create Token View */
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <h2 className="text-xl font-bold mb-4">No Active Token</h2>
            <p className="mb-6 text-gray-600">
              Start your hospital visit journey digitally.
            </p>
            <button
              onClick={createToken}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Get Appointment Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
