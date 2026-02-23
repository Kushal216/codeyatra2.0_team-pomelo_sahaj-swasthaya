'use client';
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Search,
  X,
  FileText,
  ClipboardList,
} from 'lucide-react';

// ─── Empty medicine row ───────────────────────────────────────────────────────
const emptyMedicine = () => ({
  name: '',
  dosage: '',
  frequency: '',
  duration: '',
  notes: '',
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
          onChange={field('name')}
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
          onChange={field('dosage')}
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
          onChange={field('frequency')}
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
          onChange={field('duration')}
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
    tokenNumber: prefill?.tokenNumber ?? '',
    doctorName: prefill?.doctorName ?? '',
    department: prefill?.department ?? '',
    patientName: prefill?.patientName ?? '',
    diagnosis: '',
    advice: '',
    followUpDate: '',
    medicines: [emptyMedicine()],
  });

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [looking, setLooking] = useState(false); // token lookup in progress
  const [locked, setLocked] = useState(!!prefill); // doctor/dept locked when auto-filled

  // ── Report request state ────────────────────────────────────────────────────
  const [includeReport, setIncludeReport] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportForm, setReportForm] = useState({ reportType: '', notes: '' });
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportError, setReportError] = useState('');
  const [reportCreated, setReportCreated] = useState(false);

  // Re-initialise if prefill changes (e.g. different queue row clicked)
  useEffect(() => {
    setForm(emptyForm());
    setLocked(!!prefill);
    setSubmitted(false);
    setError('');
    setIncludeReport(false);
    setReportCreated(false);
    setReportForm({ reportType: '', notes: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill]);

  // ── Auto-lookup token details when token number is entered manually ─────────
  const handleTokenLookup = async () => {
    const num = Number(form.tokenNumber);
    if (!num || locked) return;
    setLooking(true);
    setError('');
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
        setError('Token not found. Please check the token number.');
      }
    } catch {
      setError('Failed to look up token.');
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
      doctorName: '',
      department: '',
      patientName: '',
    }));
  };

  // ── Report Request Submit ────────────────────────────────────────────────────
  const handleReportSubmit = async () => {
    if (!reportForm.reportType) return;
    if (!form.tokenNumber || !form.department) {
      setReportError(
        'Please ensure token number and department are filled in before adding a report.'
      );
      return;
    }
    setReportSubmitting(true);
    setReportError('');
    try {
      const res = await fetch('/api/report/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenNumber: Number(form.tokenNumber),
          department: form.department,
          reportType: reportForm.reportType,
          notes: reportForm.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || 'Failed to create report request');
      setReportCreated(true);
      setReportModalOpen(false);
    } catch (err) {
      setReportError(err.message);
    } finally {
      setReportSubmitting(false);
    }
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tokenNumber: Number(form.tokenNumber),
          followUpDate: form.followUpDate || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || 'Failed to save prescription');
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
            setIncludeReport(false);
            setReportCreated(false);
            setReportForm({ reportType: '', notes: '' });
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
    <>
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
                  setField('tokenNumber')(e);
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
                {looking ? 'Looking up…' : 'Lookup'}
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
          {locked &&
            (form.patientName || form.doctorName || form.department) && (
              <div className="bg-teal-50 border border-teal-100 rounded-lg px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                {form.patientName && (
                  <div>
                    <p className="text-xs text-teal-500">Patient</p>
                    <p className="font-medium text-gray-800">
                      {form.patientName}
                    </p>
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
                    <p className="font-medium text-gray-800">
                      {form.department}
                    </p>
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
                  onChange={setField('doctorName')}
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
                  onChange={setField('department')}
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
              onChange={setField('diagnosis')}
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
              onChange={setField('advice')}
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
              onChange={setField('followUpDate')}
              className="input-field"
            />
          </div>
        </section>

        {/* ── Report Request ─────────────────────────────────────────────── */}
        <section className="space-y-3 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="includeReport"
              checked={includeReport}
              onChange={(e) => {
                if (e.target.checked) {
                  setIncludeReport(true);
                  setReportModalOpen(true);
                } else {
                  setIncludeReport(false);
                  setReportCreated(false);
                  setReportForm({ reportType: '', notes: '' });
                }
              }}
              className="w-4 h-4 accent-teal-600 cursor-pointer"
            />
            <label
              htmlFor="includeReport"
              className="text-sm text-gray-700 cursor-pointer flex items-center gap-2"
            >
              <FileText size={15} className="text-teal-600" />
              Include Lab Report Request
            </label>
            {reportCreated && (
              <span className="ml-auto text-xs text-green-600 flex items-center gap-1">
                <CheckCircle size={13} /> Report request saved
              </span>
            )}
          </div>
          {reportCreated && (
            <div className="bg-teal-50 border border-teal-100 rounded-lg px-4 py-2 flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-gray-800">
                  {reportForm.reportType}
                </p>
                {reportForm.notes && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {reportForm.notes}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="text-xs text-teal-600 hover:underline ml-4"
              >
                Edit
              </button>
            </div>
          )}
        </section>

        {/* ── Submit ─────────────────────────────────────────────────────── */}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Save size={16} />
          {submitting ? 'Saving…' : 'Save Prescription'}
        </button>
      </form>

      {/* ── Report Request Modal ──────────────────────────────────────────── */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <ClipboardList size={18} className="text-teal-600" />
                Lab Report Request
              </h4>
              <button
                type="button"
                onClick={() => {
                  setReportModalOpen(false);
                  if (!reportCreated) setIncludeReport(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg px-3 py-2 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Token #</p>
                <p className="font-medium">{form.tokenNumber || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Department</p>
                <p className="font-medium">{form.department || '—'}</p>
              </div>
            </div>

            {reportError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {reportError}
              </p>
            )}

            <div>
              <label className="label">Report Type</label>
              <select
                value={reportForm.reportType}
                onChange={(e) =>
                  setReportForm((prev) => ({
                    ...prev,
                    reportType: e.target.value,
                  }))
                }
                className="input-field w-full"
              >
                <option value="">Select report type…</option>
                <option>Blood Test (CBC)</option>
                <option>Blood Test (LFT)</option>
                <option>Blood Test (KFT)</option>
                <option>Urine Test</option>
                <option>X-Ray</option>
                <option>MRI</option>
                <option>CT Scan</option>
                <option>ECG</option>
                <option>Ultrasound</option>
                <option>Biopsy</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="label">
                Clinical Notes{' '}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={reportForm.notes}
                onChange={(e) =>
                  setReportForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                rows={3}
                placeholder="Any instructions for the lab…"
                className="input-field w-full resize-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setReportModalOpen(false);
                  if (!reportCreated) setIncludeReport(false);
                }}
                className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReportSubmit}
                disabled={reportSubmitting || !reportForm.reportType}
                className="flex-1 btn-primary disabled:opacity-60"
              >
                {reportSubmitting ? 'Adding…' : 'Add Report Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
