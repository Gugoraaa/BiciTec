
import type { Status } from "@/types/stations";
import { useTranslations } from "next-intl";
import { statusStyles } from "./statusStyles";


export default function StatusBadge({ status }: { status?: Status }) {
  const t = useTranslations("StationTable.status");
  const safeStatus = status && status in statusStyles ? status : 'Offline';
  const s = statusStyles[safeStatus];
  
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${s.pill}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
      {t(safeStatus)}
    </span>
  );
}