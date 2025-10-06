'use client'
export default function StationCapacityCard({
 title = "Station Capacity",
  data = [
    { name: "Station A", value: 90 },
    { name: "Station B", value: 82 },
    { name: "Station C", value: 75 },
    { name: "Station D", value: 60 },
    { name: "Station E", value: 55 },
  ],
}) {
  return (
    <div className="w-full h-full rounded-2xl bg-[#1e293b] p-5 text-slate-200 shadow-lg flex flex-col">
      <h3 className="text-lg font-semibold tracking-tight mb-4">{title}</h3>

      <ul className="space-y-3 flex-1 overflow-y-auto pr-2 -mt-1">
        {data.map((item) => (
          <li key={item.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-300">{item.name}</span>
              <span className="text-sm font-medium text-slate-200">{item.value}%</span>
            </div>

            <div
              className="h-2 w-full rounded-full bg-slate-700/70"
              aria-hidden="true"
            >
              <div
                className="h-2 rounded-full bg-blue-500 transition-[width] duration-500"
                style={{ width: `${Math.max(0, Math.min(100, item.value))}%` }}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={item.value}
                aria-label={`${item.name} capacity`}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
