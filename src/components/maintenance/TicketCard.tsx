import Card from "./Card";
import Badge from "./Badge";
import { Ticket } from "@/types/maintenance";
import { useTranslations } from "next-intl";
import { priorityMap } from "./maps";



export default function TicketCard({ t, onManage }: { t: Ticket; onManage: (t: Ticket) => void }) {
  const normalizedPriority = priorityMap[t.priority] || t.priority;
  
  const tone: "danger" | "warning" | "success" =
    normalizedPriority === "High" ? "danger" 
    : normalizedPriority === "Medium" ? "warning" 
    : "success";

  const p = useTranslations("Maintenance");

  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="font-semibold text-slate-100">#{t.id}</p>
        <div className="flex items-center gap-2">
          <Badge label={p("priorityOptions." + normalizedPriority)} tone={tone} />
          <button 
            onClick={() => onManage(t)}
            className="rounded-lg bg-slate-700/70 px-2.5 py-1 text-xs text-slate-100 hover:bg-slate-700"
            title="Manage"
          >
            {p("table.manage")}
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm text-slate-200">
        {t.bike} - {t.description}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>{t.date}</span>
      </div>
    </Card>
  );
}