"use client";
import { useState } from "react";

export default function AddDoctorForm({ departments }) {
  const [form, setForm] = useState({
    name: "",
    department: "",
    specialization: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (!form.name || !form.department) {
        setError("Name and Department are required.");
        setLoading(false);
        return;
      }
      // Send POST request to API
      const res = await fetch("/api/admin/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          department: form.department,
          specialization: form.specialization,
          isActive: form.isActive,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("Doctor added successfully!");
        setForm({
          name: "",
          department: "",
          specialization: "",
          isActive: true,
        });
      } else {
        setError(data.error || "Failed to add doctor.");
      }
    } catch (err) {
      setError(err.message || "Failed to add doctor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">Add Doctor</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Department<span className="text-red-500">*</span>
        </label>
        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Select Department</option>
          {departments &&
            departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Specialization</label>
        <input
          type="text"
          name="specialization"
          value={form.specialization}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
          className="mr-2"
        />
        <label className="font-medium">Active</label>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Doctor"}
      </button>
    </form>
  );
}
