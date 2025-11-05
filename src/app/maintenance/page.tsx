"use client";
import { useMemo, useState, useEffect } from "react";
import { Ticket } from "@/types/maintenance";
import type { Status } from "@/types/maintenance";
import LoadingScreen from "@/components/maintenance/LoadingScreen";
import ManageModal from "@/components/maintenance/ManageModal";
import StatusFilter from "@/components/maintenance/StatusFilter";
import StatusColumn from "@/components/maintenance/StatusColumn";
import ViewToggle from "@/components/maintenance/ViewToggle";
import TicketsTable from "@/components/maintenance/TicketsTable";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import api from "@/lib/api";
import { useTranslations } from "next-intl";
import { mapApiResponseToTickets } from "@/components/maintenance/mapApiResponseToTickets";
import toast from 'react-hot-toast';

function BikeMaintenanceDashboard() {
  const [filter, setFilter] = useState<Status | "All">("All");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const t = useTranslations("Maintenance");

  const [manageOpen, setManageOpen] = useState(false);
  const [selected, setSelected] = useState<Ticket | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get("/reports/getReports");
        const { data: responseData, success } = response.data;

        if (success && Array.isArray(responseData)) {
          const mappedTickets = mapApiResponseToTickets(responseData);
          setTickets(mappedTickets);
        } else {
          console.error("Unexpected response format:", response.data);
          setTickets([]);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
        setTickets([]);
      } finally {
        setInitialLoad(false);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const grouped = useMemo(() => {
    const by: Record<Status, Ticket[]> = {
      Open: [],
      InProgress: [],
      Done: [],
    };
    tickets.forEach((t) => {
      if (by[t.status]) {
        by[t.status].push(t);
      } else {
        console.warn(`Encountered ticket with unknown status: ${t.status}`);
      }
    });
    return by;
  }, [tickets]);

  const visibleColumns: Array<{ id: Status; label: string }> = useMemo(() => {
    const statuses: Status[] =
      filter === "All" ? ["Open", "InProgress", "Done"] : [filter];
    return statuses.map((status) => ({
      id: status,
      label: t(`status.${status}`),
    }));
  }, [filter, t]);

  const visibleTickets = useMemo(() => {
    if (filter === "All") return tickets;
    return tickets.filter((t) => t.status === filter);
  }, [tickets, filter]);

  const onSave = async (
    id: number,
    newStatus: Status,
    newPriority: "High" | "Medium" | "Low"
  ) => {
    try {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: newStatus, priority: newPriority } : t
        )
      );
      await api.patch(`/reports/${id}/status`, { status: newStatus });
      await api.patch(`/reports/${id}/priority`, { priority: newPriority });
      toast.success("Ticket actualizado correctamente");
    } catch (err) {
      console.error("Error updating ticket:", err);
      toast.error("Error al actualizar el ticket");
    }
  };

  const onDelete = async (id: number) => {
    try {
      setTickets((prev) => prev.filter((t) => t.id !== id));
      await api.delete(`/reports/deleteReport/${id}`);
      toast.success("Ticket eliminado correctamente");
    } catch (err) {
      toast.error("Error al eliminar el ticket");
      console.error("Error deleting ticket:", err);
    }
  };

  if (initialLoad) return <LoadingScreen />;

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl p-3 sm:p-4 md:p-6">
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">{t("title")}</h1>
              <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-1"></div>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
              <div className="flex-1 sm:flex-none">
                <StatusFilter active={filter} onChange={setFilter} />
              </div>
              <div className="flex-1 sm:flex-none">
                <ViewToggle value={view} onChange={setView} />
              </div>
            </div>
          </div>
        </div>

        {view === "cards" ? (
          <div
            className={`grid gap-4 sm:gap-5 md:gap-6 ${
              visibleColumns.length === 3 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}
          >
            {visibleColumns.map(({ id, label }) => (
              <div key={id} className="h-full">
                <StatusColumn
                  title={label}
                  tickets={grouped[id]}
                  onManage={(t) => {
                    setSelected(t);
                    setManageOpen(true);
                  }}
                  loading={loading}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 overflow-hidden">
            <div className="overflow-x-auto">
              <TicketsTable
                tickets={visibleTickets}
                loading={loading}
                onManage={(t) => {
                  setSelected(t);
                  setManageOpen(true);
                }}
              />
            </div>
          </div>
        )}
      </div>

      <ManageModal
        open={manageOpen}
        ticket={selected}
        onClose={() => setManageOpen(false)}
        onSave={onSave}
        onDelete={onDelete}
      />
    </div>
  );
}

export default function MaintenancePage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <BikeMaintenanceDashboard />
    </ProtectedRoute>
  );
}
