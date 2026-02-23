"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, CheckCircle, Search, X } from "lucide-react";

// ─── Empty medicine row ───────────────────────────────────────────────────────
const emptyMedicine = () => ({
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  notes: "",
});

// ─── Sub-component: single medicine row ──────────────────────────────────────
function MedicineRow({ medicine, index, onChange, onRemove }) {
  const field = (key) => (e) => onChange(index, key, e.target.value);

  return (
    <div className="grid grid-cols-12 gap-2 items-start bg-gray-50 rounded-lg p-3">
      {/* Name */}
      <div className="col-span-12 sm:col-span-3">
        <label className="text-xs text-gray-400 mb-1 block">Medicine</label>
        <input
          type="text"
          value={medicine.name}
          onChange={field("name")}
          placeholder="e.g. Paracetamol"
          className="input-field w-full text-sm"
          required
        />
      </div>

      {/* Dosage */}
      <div className="col-span-6 sm:col-span-2">
        <label className="text-xs text-gray-400 mb-1 block">Dosage</label>
        <input
          type="text"
          value={medicine.dosage}
          onChange={field("dosage")}
          placeholder="500mg"
          className="input-field w-full text-sm"
          required
        />
      </div>

      {/* Frequency */}
      <div className="col-span-6 sm:col-span-3">
        <label className="text-xs text-gray-400 mb-1 block">Frequency</label>
        <select
          value={medicine.frequency}
          onChange={field("frequency")}
          className="input-field w-full text-sm"
          required
        >
          <option value="">Select</option>
          <option>Once a day</option>
          <option>Twice a day</option>
          <option>Three times a day</option>
          <option>Four times a day</option>
          <option>As needed</option>
        </select>
      </div>

      {/* Duration */}
      <div className="col-span-10 sm:col-span-2">
        <label className="text-xs text-gray-400 mb-1 block">Duration</label>
        <input
          type="text"
          value={medicine.duration}
          onChange={field("duration")}
          placeholder="7 days"
          className="input-field w-full text-sm"
          required
        />
      </div>

      {/* Remove button */}
      <div className="col-span-2 sm:col-span-1 flex items-end pb-0.5 justify-end sm:justify-center">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-400 hover:text-red-600 mt-5 transition"
          title="Remove"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────
// prefill: { tokenNumber, doctorName, department, patientName } — passed from QueueRow
export default function PrescriptionForm({ onSuccess, prefill = null }) {
  const emptyForm = () => ({
    tokenNumber: prefill?.tokenNumber ?? "",
    doctorName: prefill?.doctorName ?? "",
    department: prefill?.department ?? "",
    patientName: prefill?.patientName ?? "",
    diagnosis: "",
    advice: "",
    followUpDate: "",
    medicines: [emptyMedicine()],
  });

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [looking, setLooking] = useState(false); // token lookup in progress
  const [locked, setLocked] = useState(!!prefill); // doctor/dept locked when auto-filled

  // Re-initialise if prefill changes (e.g. different queue row clicked)
  useEffect(() => {
    setForm(emptyForm());
    setLocked(!!prefill);
    setSubmitted(false);
    setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill]);

  // ── Auto-lookup token details when token number is entered manually ─────────
  const handleTokenLookup = async () => {
    const num = Number(form.tokenNumber);
    if (!num || locked) return;
    setLooking(true);
    setError("");
    try {
      const res = await fetch(`/api/token?tokenNumber=${num}`);
      const data = await res.json();
      const t = data.tokens?.[0];
      if (t) {
        setForm((prev) => ({
          ...prev,
          doctorName: t.doctor?.name ?? prev.doctorName,
          department: t.department?.name ?? prev.department,
          patientName: t.patientName ?? prev.patientName,
        }));
        setLocked(true);
      } else {
        setError("Token not found. Please check the token number.");
      }
    } catch {
      setError("Failed to look up token.");
    } finally {
      setLooking(false);
    }
  };

  // ── Field updaters ──────────────────────────────────────────────────────────
  const setField = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const updateMedicine = (index, key, value) =>
    setForm((prev) => {
      const medicines = [...prev.medicines];
      medicines[index] = { ...medicines[index], [key]: value };
      return { ...prev, medicines };
    });

  const addMedicine = () =>
    setForm((prev) => ({
      ...prev,
      medicines: [...prev.medicines, emptyMedicine()],
    }));

  const removeMedicine = (index) =>
    setForm((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));

  const resetLock = () => {
    setLocked(false);
    setForm((prev) => ({
      ...prev,
      doctorName: "",
      department: "",
      patientName: "",
    }));
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tokenNumber: Number(form.tokenNumber),
          followUpDate: form.followUpDate || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || "Failed to save prescription");
      setSubmitted(true);
      onSuccess?.(data.prescription);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success state ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="card flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle size={40} className="text-green-500" />
        <p className="text-lg font-semibold text-gray-800">
          Prescription Saved
        </p>
        <p className="text-sm text-gray-500">
          The prescription has been recorded and is visible in the
          patient&apos;s profile.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm(emptyForm());
            setLocked(!!prefill);
          }}
          className="btn-primary mt-2"
        >
          Add Another
        </button>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      <h3 className="text-base font-semibold text-gray-800">
        Write Prescription
      </h3>

      {/* Error banner */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {/* ── Visit info ─────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Visit Details
        </p>

        {/* Token Number + Lookup */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="label">Token Number</label>
            <input
              type="number"
              value={form.tokenNumber}
              onChange={(e) => {
                setField("tokenNumber")(e);
                setLocked(false);
              }}
              placeholder="e.g. 42"
              className="input-field w-full"
              required
              min={1}
              readOnly={locked}
            />
          </div>
          {!locked ? (
            <button
              type="button"
              onClick={handleTokenLookup}
              disabled={!form.tokenNumber || looking}
              className="btn-teal flex items-center gap-1.5 py-2.5 disabled:opacity-50"
            >
              <Search size={14} />
              {looking ? "Looking up…" : "Lookup"}
            </button>
          ) : (
            <button
              type="button"
              onClick={resetLock}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 border border-gray-200 rounded-lg px-3 py-2.5"
              title="Change token"
            >
              <X size={14} /> Change
            </button>
          )}
        </div>

        {/* Auto-filled patient/doctor/dept info */}
        {locked && (form.patientName || form.doctorName || form.department) && (
          <div className="bg-teal-50 border border-teal-100 rounded-lg px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            {form.patientName && (
              <div>
                <p className="text-xs text-teal-500">Patient</p>
                <p className="font-medium text-gray-800">{form.patientName}</p>
              </div>
            )}
            {form.doctorName && (
              <div>
                <p className="text-xs text-teal-500">Doctor</p>
                <p className="font-medium text-gray-800">
                  Dr. {form.doctorName}
                </p>
              </div>
            )}
            {form.department && (
              <div>
                <p className="text-xs text-teal-500">Department</p>
                <p className="font-medium text-gray-800">{form.department}</p>
              </div>
            )}
          </div>
        )}

        {/* Manual doctor/dept entry — only when not auto-filled */}
        {!locked && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Doctor Name</label>
              <input
                type="text"
                value={form.doctorName}
                onChange={setField("doctorName")}
                placeholder="Dr. Anisha Sharma"
                className="input-field w-full"
                required
              />
            </div>
            <div>
              <label className="label">Department</label>
              <input
                type="text"
                value={form.department}
                onChange={setField("department")}
                placeholder="e.g. Cardiology"
                className="input-field w-full"
                required
              />
            </div>
          </div>
        )}

        <div>
          <label className="label">Diagnosis / Chief Complaint</label>
          <textarea
            value={form.diagnosis}
            onChange={setField("diagnosis")}
            rows={2}
            placeholder="Describe the patient's diagnosis…"
            className="input-field w-full resize-none"
            required
          />
        </div>
      </section>

      {/* ── Medicines ──────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Medicines
          </p>
          <button
            type="button"
            onClick={addMedicine}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus size={14} />
            Add Medicine
          </button>
        </div>

        <div className="space-y-2">
          {form.medicines.map((med, i) => (
            <MedicineRow
              key={i}
              index={i}
              medicine={med}
              onChange={updateMedicine}
              onRemove={removeMedicine}
            />
          ))}
        </div>
      </section>

      {/* ── Additional Info ────────────────────────────────────────────── */}
      <section className="space-y-3">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Additional Notes
        </p>

        <div>
          <label className="label">Advice / Instructions</label>
          <textarea
            value={form.advice}
            onChange={setField("advice")}
            rows={2}
            placeholder="e.g. Take medicines after food, avoid spicy food…"
            className="input-field w-full resize-none"
          />
        </div>

        <div>
          <label className="label">Follow-up Date</label>
          <input
            type="date"
            value={form.followUpDate}
            onChange={setField("followUpDate")}
            className="input-field"
          />
        </div>
      </section>

      {/* ── Submit ─────────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <Save size={16} />
        {submitting ? "Saving…" : "Save Prescription"}
      </button>
    </form>
  );
}
