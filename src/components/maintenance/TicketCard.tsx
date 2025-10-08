import Card from "./Card";
import Badge from "./Badge";
import { Ticket } from "@/types/maintenance";

export default function TicketCard({ t, onManage }: { t: Ticket; onManage: (t: Ticket) => void }) {
  const tone: "danger" | "warning" | "success" =
    t.priority === "High" ? "danger" : t.priority === "Medium" ? "warning" : "success";

  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="font-semibold text-slate-100">#{t.id}</p>
        <div className="flex items-center gap-2">
          <Badge label={t.priority} tone={tone} />
          <button
            onClick={() => onManage(t)}
            className="rounded-lg bg-slate-700/70 px-2.5 py-1 text-xs text-slate-100 hover:bg-slate-700"
            title="Manage"
          >
            Manage
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