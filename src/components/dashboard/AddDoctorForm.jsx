'use client';
import { useAddDoctorForm } from '@/components/admin/useAddDoctorForm';
import LabeledField from '@/components/forms/LabeledField';
import LabeledSelect from '@/components/forms/LabeledSelect';

export default function AddDoctorForm({ departments }) {
  const { form, loading, error, success, handleChange, handleSubmit } =
    useAddDoctorForm();

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">Add Doctor</h2>

      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}

      <LabeledField
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <LabeledSelect
        label="Department"
        name="department"
        value={form.department}
        onChange={handleChange}
        required
      >
        <option value="">Select Department</option>
        {departments?.map((dept) => (
          <option key={dept._id} value={dept._id}>
            {dept.name}
          </option>
        ))}
      </LabeledSelect>

      <LabeledField
        label="Specialization"
        name="specialization"
        value={form.specialization}
        onChange={handleChange}
      />

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
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Adding...' : 'Add Doctor'}
      </button>
    </form>
  );
}
