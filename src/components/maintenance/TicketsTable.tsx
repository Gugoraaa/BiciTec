"use client";
import React, { useMemo } from "react";
import type { Ticket } from "@/types/maintenance"
import { useTranslations } from "next-intl";

export default function TicketsTable({
  tickets,
  loading,
  onManage,
}: {
  tickets: Ticket[];
  loading: boolean;
  onManage: (t: Ticket) => void;
}) {
  const t = useTranslations("Maintenance");
  const tStatus = useTranslations("Maintenance.status");
  const tPriority = useTranslations("Maintenance.priority");
  
  const sorted = useMemo(() => {
    const priorityOrder: Record<string, number> = { High: 1, Medium: 2, Low: 3 };
      return [...tickets].sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff !== 0) return dateDiff > 0 ? 1 : -1;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [tickets]);

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-slate-700">
      <table className="min-w-full divide-y divide-slate-700 text-sm">
        <thead className="bg-slate-800/70">
          <tr>
            <th className="px-3 py-3 text-left font-medium text-slate-300">{t("table.columns.id")}</th>
            <th className="px-3 py-3 text-left font-medium text-slate-300">{t("table.columns.bike")}</th>
            <th className="px-3 py-3 text-left font-medium text-slate-300">{t("table.columns.description")}</th>
            <th className="px-3 py-3 text-left font-medium text-slate-300">{t("table.columns.date")}</th>
            <th className="px-3 py-3 text-left font-medium text-slate-300">{t("table.columns.priority")}</th>
            <th className="px-3 py-3 text-left font-medium text-slate-300">{t("table.columns.status")}</th>
            <th className="px-3 py-3 text-left font-medium text-slate-300 text-center">{t("table.columns.actions")}</th>
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
                {t("table.empty")}
              </td>
            </tr>
          ) : (
            sorted.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-800/50 transition">
                <td className="px-3 py-3 text-slate-200 font-medium">{ticket.id}</td>
                <td className="px-3 py-3 text-slate-300">{ticket.bike}</td>
                <td className="px-3 py-3 text-slate-300">{ticket.description}</td>
                <td className="px-3 py-3 text-slate-400">{ticket.date}</td>
                <td className="px-3 py-3">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      ticket.priority === "High"
                        ? "bg-rose-900/40 text-rose-300"
                        : ticket.priority === "Medium"
                        ? "bg-amber-900/40 text-amber-300"
                        : "bg-emerald-900/40 text-emerald-300"
                    }`}
                  >
                    {tPriority(ticket.priority)}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-300">
                  <span className="inline-flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      ticket.status === 'Open' ? 'bg-rose-500' : 
                      ticket.status === 'InProgress' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}></span>
                    {tStatus(ticket.status)}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <button
                    onClick={() => onManage(ticket)}
                    className="rounded-lg bg-slate-700/70 px-3 py-1 text-xs text-slate-100 hover:bg-slate-600 transition-colors"
                  >
                    {t("table.manage")}
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
