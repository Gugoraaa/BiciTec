"use client";

export default function ViewToggle({
  value,
  onChange,
}: {
  value: "cards" | "table";
  onChange: (v: "cards" | "table") => void;
}) {
  const options = [
    { key: "cards", label: "Card View" },
    { key: "table", label: "Table View" },
  ];

  return (
    <div className="inline-flex rounded-xl bg-slate-800/50 p-1 ring-1 ring-slate-700">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key as "cards" | "table")}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            value === opt.key
              ? "bg-slate-700 text-slate-100"
              : "text-slate-300 hover:bg-slate-700/50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
