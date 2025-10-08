'use client'
import { useMemo, useState, useEffect } from "react";
import { Ticket } from "@/types/maintenance";
import type {Status} from "@/types/maintenance";
import LoadingScreen from "@/components/maintenance/LoadingScreen";
import ManageModal from "@/components/maintenance/ManageModal";
import StatusFilter from "@/components/maintenance/StatusFilter";
import StatusColumn from "@/components/maintenance/StatusColumn";


const SEED: Ticket[] = [
    {
    id: 12345,
    bike: "Bike 1",
    title: "Distance Threshold",
    date: "2024-03-15",
    priority: "High",
    status: "Open",
  },
  {
    id: 98765,
    bike: "Bike 9",
    title: "Low Battery Voltage",
    date: "2024-04-06",
    priority: "Low",
    status: "Open",
  },
  {
    id: 54321,
    bike: "Bike 7",
    title: "Brake System Alert",
    date: "2024-04-02",
    priority: "Medium",
    status: "Open",
  },
  
  {
    id: 67890,
    bike: "Bike 2",
    title: "Abnormal Vibration",
    date: "2024-03-16",
    priority: "Medium",
    status: "In Progress",
  },
  {
    id: 24680,
    bike: "Bike 5",
    title: "Chain Tension Adjustment",
    date: "2024-04-04",
    priority: "High",
    status: "In Progress",
  },
  {
    id: 86420,
    bike: "Bike 6",
    title: "Sensor Calibration",
    date: "2024-04-07",
    priority: "Low",
    status: "In Progress",
  },
  {
    id: 11223,
    bike: "Bike 3",
    title: "Anchor Error",
    date: "2024-03-17",
    priority: "Low",
    status: "Done",
  },
  {
    id: 33445,
    bike: "Bike 4",
    title: "Software Update Completed",
    date: "2024-03-29",
    priority: "Medium",
    status: "Done",
  },
  {
    id: 55667,
    bike: "Bike 8",
    title: "Tire Replacement",
    date: "2024-04-01",
    priority: "High",
    status: "Done",
  },
];


export default function BikeMaintenanceDashboard() {
  const [filter, setFilter] = useState<Status | "All">("All");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const [manageOpen, setManageOpen] = useState(false);
  const [selected, setSelected] = useState<Ticket | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTickets(SEED);
      setInitialLoad(false);
      setTimeout(() => setLoading(false), 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const grouped = useMemo(() => {
    const by: Record<Status, Ticket[]> = { Open: [], "In Progress": [], Done: [] };
    tickets.forEach((t) => by[t.status].push(t));
    return by;
  }, [tickets]);

  const visibleColumns: Array<Status> = useMemo(() => {
    if (filter === "All") return ["Open", "In Progress", "Done"];
    return [filter];
  }, [filter]);

  const onSave = (id: number, newStatus: Status) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  };

  const onDelete = (id: number) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  if (initialLoad) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">Reports</h1>
          <StatusFilter active={filter} onChange={setFilter} />
        </div>

        <div className={`grid gap-6 ${visibleColumns.length === 3 ? "md:grid-cols-3" : "grid-cols-1"}`}>
          {visibleColumns.map((col) => (
            <StatusColumn 
              key={col} 
              title={col} 
              tickets={grouped[col]} 
              onManage={(t) => { setSelected(t); setManageOpen(true); }}
              loading={loading}
            />
          ))}
        </div>
      </div>

      <ManageModal
        open={manageOpen}
        ticket={selected}
        onClose={() => setManageOpen(false)}
        onSave={onSave}
        onDelete={onDelete}
      />
    </div>
  )}