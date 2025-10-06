// src/components/StationTable.tsx
"use client";
import React from "react";

type Status = "Operational" | "Maintenance" | "Offline";

export type StationRow = {
  id: string;
  station: string;     // e.g., "Station A"
  location: string;    // e.g., "Central Plaza"
  capacity: number;    // total docks
  docked: number;      // bikes docked
  available: number;   // available bikes
  status: Status;
};

const statusStyles: Record<Status, { dot: string; pill: string }> = {
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

function StatusBadge({ status }: { status: Status }) {
  const s = statusStyles[status];
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${s.pill}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

export default function StationTable({
  data,
  title = "Stations",
}: {
  data: StationRow[];
  title?: string;
}) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg">
      <div className="px-4 py-3 border-b border-slate-800">
        <h3 className="text-slate-200 font-semibold">{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/80">
            <tr className="[&>th]:py-3 [&>th]:px-4 text-slate-400 font-medium">
              <th className="w-40">Station</th>
              <th>Location</th>
              <th className="text-right">Capacity</th>
              <th className="text-right">Bikes Docked</th>
              <th className="text-right">Available</th>
              <th className="w-40">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {data.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="text-slate-200 font-semibold">
                      {row.station}
                    </span>
                    <span className="text-slate-500 text-xs sm:hidden">
                      {row.location}
                    </span>
                  </div>
                </td>

                <td className="py-3 px-4 text-slate-300 hidden sm:table-cell">
                  {row.location}
                </td>

                <td className="py-3 px-4 text-right text-slate-300">
                  {row.capacity}
                </td>

                <td className="py-3 px-4 text-right text-slate-300">
                  {row.docked}
                </td>

                <td className="py-3 px-4 text-right">
                  <span className="text-slate-200 font-medium">
                    {row.available}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
