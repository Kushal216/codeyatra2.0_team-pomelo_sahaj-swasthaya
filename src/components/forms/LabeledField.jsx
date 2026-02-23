export default function LabeledField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
}) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border px-3 py-2 rounded"
      />
    </div>
  );
}
