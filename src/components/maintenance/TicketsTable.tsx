"use client";
import React, { useMemo } from "react";
import type { Ticket } from "@/types/maintenance"

export default function TicketsTable({
  tickets,
  loading,
  onManage,
}: {
  tickets: Ticket[];
  loading: boolean;
  onManage: (t: Ticket) => void;
}) {
  const sorted = useMemo(() => {
    const priorityOrder: Record<string, number> = { High: 1, Medium: 2, Low: 3 };
    return [...tickets].sort((a, b) => {
      const d = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (d !== 0) return d;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [tickets]);

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-slate-700">
      <table className="min-w-full divide-y divide-slate-700 text-sm">
        <thead className="bg-slate-800/70">
          <tr>
            <th className="px-3 py-3 text-left font-medium text-slate-300">ID</th>
            <th className="px-3 py-3 text-left font-medium text-slate-300">Bike</th>
            <th className="px-3 py-3 text-left font-medium text-slate-300">Description</th>
            <th className="px-3 py-3 text-left font-medium text-slate-300">Date</th>
            <th className="px-3 py-3 text-left font-medium text-slate-300">Priority</th>
            <th className="px-3 py-3 text-left font-medium text-slate-300">Status</th>
            <th className="px-3 py-3 text-left font-medium text-slate-300 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-900/40">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-3 py-3">
                  <div className="h-4 w-16 bg-slate-700 rounded" />
                </td>
                <td className="px-3 py-3">
                  <div className="h-4 w-24 bg-slate-700 rounded" />
                </td>
                <td className="px-3 py-3">
                  <div className="h-4 w-40 bg-slate-700 rounded" />
                </td>
                <td className="px-3 py-3">
                  <div className="h-4 w-20 bg-slate-700 rounded" />
                </td>
                <td className="px-3 py-3">
                  <div className="h-4 w-16 bg-slate-700 rounded" />
                </td>
                <td className="px-3 py-3">
                  <div className="h-4 w-20 bg-slate-700 rounded" />
                </td>
                <td className="px-3 py-3">
                  <div className="h-6 w-16 bg-slate-700 rounded" />
                </td>
              </tr>
            ))
          ) : sorted.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="text-center py-6 text-slate-500 italic"
              >
                No reports found
              </td>
            </tr>
          ) : (
            sorted.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/50 transition">
                <td className="px-3 py-3 text-slate-200 font-medium">{t.id}</td>
                <td className="px-3 py-3 text-slate-300">{t.bike}</td>
                <td className="px-3 py-3 text-slate-300">{t.description}</td>
                <td className="px-3 py-3 text-slate-400">{t.date}</td>
                <td className="px-3 py-3">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      t.priority === "High"
                        ? "bg-rose-900/40 text-rose-300"
                        : t.priority === "Medium"
                        ? "bg-amber-900/40 text-amber-300"
                        : "bg-emerald-900/40 text-emerald-300"
                    }`}
                  >
                    {t.priority}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-300">{t.status}</td>
                <td className="px-3 py-3 text-center">
                  <button
                    onClick={() => onManage(t)}
                    className="rounded-lg bg-slate-700/70 px-3 py-1 text-xs text-slate-100 hover:bg-slate-600"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
