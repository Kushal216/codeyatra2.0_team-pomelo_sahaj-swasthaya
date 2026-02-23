const MAX_LOAD = 10;

function loadColor(pct) {
  if (pct >= 70) return 'bg-red-500';
  if (pct >= 40) return 'bg-yellow-500';
  return 'bg-green-500';
}

function DeptLoadBar({ dept, load }) {
  const pct = Math.min(Math.round((load / MAX_LOAD) * 100), 100);
  return (
    <div className="card">
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-gray-800">{dept}</span>
        <span className="text-gray-500">{load} waiting</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full">
        <div
          className={`h-2 rounded-full transition-all ${loadColor(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function DeptLoadList({ departmentLoad }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-800 mb-3">
        Department Load
      </h3>
      <div className="space-y-2">
        {departmentLoad.map((d) => (
          <DeptLoadBar key={d.dept} dept={d.dept} load={d.load} />
        ))}
      </div>
    </div>
  );
}
