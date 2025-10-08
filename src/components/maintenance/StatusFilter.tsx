import type { Status } from "@/types/maintenance";


export default function StatusFilter({
    active,
    onChange,
  }: {
    active: Status | "All";
    onChange: (value: Status | "All") => void;
  }) {
    const options: Array<Status | "All"> = ["All", "Open", "In Progress", "Done"];
    return (
      <div className="inline-flex items-center gap-2 rounded-xl bg-slate-800/50 p-1 ring-1 ring-slate-700">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors
              ${active === opt ? "bg-slate-700 text-slate-100" : "text-slate-300 hover:bg-slate-700/50"}
            `}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }
  