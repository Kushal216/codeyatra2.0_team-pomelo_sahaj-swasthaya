export default function LabeledSelect({
  label,
  name,
  value,
  onChange,
  required = false,
  children,
}) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border px-3 py-2 rounded"
      >
        {children}
      </select>
    </div>
  );
}
