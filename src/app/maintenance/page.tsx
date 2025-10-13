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
import { Report } from "@/types/report";
import { useTranslations } from "next-intl";

const mapApiResponseToTickets = (reports: Report[]): Ticket[] => {
  return reports.map((report) => {
    let status: Status;
    switch (report.estado) {
      case 'Open':
      case 'InProgress':
      case 'Done':
        status = report.estado === 'InProgress' ? 'InProgress' : report.estado;
        break;
      default:
        status = 'Open';
    }    
    return {
      id: report.id,
      bike: `Bike ${report.id_bici || 'N/A'}`,
      description: report.descripcion || 'No description provided',
      date: report.fecha_reporte ? new Date(report.fecha_reporte).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      priority: report.prioridad,
      status: report.estado,
    };
  });
};

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
        const response = await api.get('/reports/getReports');
        const { data: responseData, success } = response.data;
        
        if (success && Array.isArray(responseData)) {
          const mappedTickets = mapApiResponseToTickets(responseData);
          setTickets(mappedTickets);
        } else {
          console.error('Unexpected response format:', response.data);
          setTickets([]);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
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
    tickets.forEach((t) => by[t.status].push(t));
    return by;
  }, [tickets]);

  const visibleColumns: Array<{id: Status, label: string}> = useMemo(() => {
    const statuses: Status[] = filter === "All" ? ["Open", "InProgress", "Done"] : [filter];
    return statuses.map(status => ({
      id: status,
      label: t(`status.${status}`)
    }));
  }, [filter, t]);

  const visibleTickets = useMemo(() => {
    if (filter === "All") return tickets;
    return tickets.filter((t) => t.status === filter);
  }, [tickets, filter]);

  const onSave = async (id: number, newStatus: Status, newPriority: 'High' | 'Medium' | 'Low') => {
    try {
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus, priority: newPriority } : t))
      );
      await api.patch(`/reports/${id}/status`, { status: newStatus });
      await api.patch(`/reports/${id}/priority`, { priority: newPriority });
    } catch (error) {
    }
  };

  const onDelete = async (id: number) => {
    try {
      setTickets((prev) => prev.filter((t) => t.id !== id));
      
      await api.delete(`/reports/deleteReport/${id}`);
    } catch (error) {
    }
  };

  if (initialLoad) return <LoadingScreen />;

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold tracking-tight">{t("title")}</h1>
          <div className="flex items-center gap-3">
            <StatusFilter active={filter} onChange={setFilter} />
            <ViewToggle value={view} onChange={setView} />
          </div>
        </div>

        {view === "cards" ? (
          <div
            className={`grid gap-6 ${
              visibleColumns.length === 3 ? "md:grid-cols-3" : "grid-cols-1"
            }`}
          >
            {visibleColumns.map(({id, label}) => (
              <StatusColumn
                key={id}
                title={label}
                tickets={grouped[id]}
                onManage={(t) => {
                  setSelected(t);
                  setManageOpen(true);
                }}
                loading={loading}
              />
            ))}
          </div>
        ) : (
          <TicketsTable
            tickets={visibleTickets}
            loading={loading}
            onManage={(t) => {
              setSelected(t);
              setManageOpen(true);
            }}
          />
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
