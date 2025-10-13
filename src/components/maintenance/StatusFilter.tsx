import { useTranslations } from "next-intl";
import type { Status } from "@/types/maintenance";

type StatusFilterProps = {
  active: Status | "All";
  onChange: (value: Status | "All") => void;
};

export default function StatusFilter({ active, onChange }: StatusFilterProps) {
  const t = useTranslations("StatusFilter.options");  
  const options: Array<Status | "All"> = ["All", "Open", "InProgress", "Done"];
  
  const getStatusText = (status: string) => {
    if (status === "All") return t("All");
    return t(status as "Open" | "InProgress" | "Done");
  };

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
          {getStatusText(opt)}
        </button>
      ))}
    </div>
  );
}