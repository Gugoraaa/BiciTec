
import type { Status } from "@/types/stations";

export const statusStyles: Record<Status, { dot: string; pill: string }> = {
  Operational: {
    dot: "bg-emerald-500",
    pill: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20",
  },
  Maintenance: {
    dot: "bg-amber-500",
    pill: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20",
  },
  Offline: {
    dot: "bg-rose-500",
    pill: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20",
  },
};