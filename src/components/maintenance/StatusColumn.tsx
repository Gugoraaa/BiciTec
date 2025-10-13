import React from "react";
import type { Ticket } from "@/types/maintenance";  
import TicketCard from "./TicketCard";
import SkeletonCard from "./SkeletonCard";

export default function StatusColumn({
  title,
  tickets,
  onManage,
  loading,
}: {
  title: string;
  tickets: Ticket[];
  onManage: (t: Ticket) => void;
  loading: boolean;
}) {
  const priorityOrder: Record<string, number> = { High: 1, Medium: 2, Low: 3 };

  const sortedTickets = [...tickets]
    .sort((a, b) => {
      const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (pDiff !== 0) return pDiff;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 5); 

  return (
    <div className="space-y-3">
      <h3 className="text-slate-200 font-semibold mb-2">
        {title}
      </h3>
      <div className="grid gap-3">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : sortedTickets.length === 0 ? (
          <div className="text-sm text-slate-500">No tickets</div>
        ) : (
          sortedTickets.map((t) => (
            <TicketCard key={t.id} t={t} onManage={onManage} />
          ))
        )}
      </div>
    </div>
  );
}
