"use client";
import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  Calendar,
  User,
  Stethoscope,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ─── Single prescription card ─────────────────────────────────────────────────
function PrescriptionCard({ rx }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card space-y-3 border-l-4 border-l-teal-500">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
            <Stethoscope size={14} className="text-teal-600 shrink-0" />
            {rx.department}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <User size={12} className="shrink-0" />
            Dr. {rx.doctorName}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar size={12} className="shrink-0" />
            {new Date(rx.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            &nbsp;·&nbsp;Token #{rx.tokenNumber}
          </div>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 shrink-0"
        >
          {expanded ? (
            <>
              Less <ChevronUp size={13} />
            </>
          ) : (
            <>
              Details <ChevronDown size={13} />
            </>
          )}
        </button>
      </div>

      {/* Diagnosis */}
      <div className="bg-teal-50 rounded-lg px-3 py-2 text-sm text-teal-800">
        <span className="font-medium">Diagnosis: </span>
        {rx.diagnosis}
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="space-y-3 pt-1">
          {/* Medicines table */}
          {rx.medicines && rx.medicines.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                Medicines
              </p>
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-500">
                      <th className="text-left px-3 py-2">Medicine</th>
                      <th className="text-left px-3 py-2">Dosage</th>
                      <th className="text-left px-3 py-2">Frequency</th>
                      <th className="text-left px-3 py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rx.medicines.map((med, i) => (
                      <tr
                        key={i}
                        className="border-t border-gray-100 text-gray-700"
                      >
                        <td className="px-3 py-2 font-medium">{med.name}</td>
                        <td className="px-3 py-2">{med.dosage}</td>
                        <td className="px-3 py-2">{med.frequency}</td>
                        <td className="px-3 py-2">{med.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Advice */}
          {rx.advice && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                Advice
              </p>
              <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2">
                {rx.advice}
              </p>
            </div>
          )}

          {/* Follow-up */}
          {rx.followUpDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={14} className="text-blue-500" />
              <span>
                Follow-up:{" "}
                <strong>
                  {new Date(rx.followUpDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </strong>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Prescription list view (for patient profile) ────────────────────────────
export default function PrescriptionView({ userId }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    async function loadPrescriptions() {
      try {
        const res = await fetch(`/api/prescription?userId=${userId}`);
        const data = await res.json();

        if (!res.ok || !data.success)
          throw new Error(data.error || "Failed to load");
        setPrescriptions(data.prescriptions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPrescriptions();
  }, [userId]);

  if (loading) {
    return (
      <div className="card text-center py-10 text-gray-400 text-sm">
        Loading prescriptions…
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-10 text-red-500 text-sm">{error}</div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-2 py-10 text-gray-400 text-sm">
        <ClipboardList size={32} className="text-gray-300" />
        No prescriptions found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {prescriptions.map((rx) => (
        <PrescriptionCard key={rx._id} rx={rx} />
      ))}
    </div>
  );
}
