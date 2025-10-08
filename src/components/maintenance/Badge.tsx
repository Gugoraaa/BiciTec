export default function Badge({ label, tone }: { label: string; tone: "success" | "warning" | "danger" }) {
    const tones = {
      success: "bg-emerald-900/40 text-emerald-300 ring-1 ring-emerald-700/50",
      warning: "bg-amber-900/40 text-amber-300 ring-1 ring-amber-700/50",
      danger: "bg-rose-900/40 text-rose-300 ring-1 ring-rose-700/50",
    } as const;
    return <span className={`px-2 py-0.5 text-xs rounded-full ${tones[tone]}`}>{label}</span>;
  }