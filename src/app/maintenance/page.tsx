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

const SEED: Ticket[] = [
  // --- OPEN ---
  {
    id: 10001,
    bike: "Bike 01",
    description: "Brake Pressure Low",
    date: "2024-03-12",
    priority: "High",
    status: "Open",
  },
  {
    id: 10002,
    bike: "Bike 02",
    description: "Battery Warning",
    date: "2024-03-13",
    priority: "Medium",
    status: "Open",
  },
  {
    id: 10003,
    bike: "Bike 03",
    description: "Chain Needs Lubrication",
    date: "2024-03-14",
    priority: "Low",
    status: "Open",
  },
  {
    id: 10004,
    bike: "Bike 04",
    description: "Overheating Detected",
    date: "2024-03-15",
    priority: "High",
    status: "Open",
  },
  {
    id: 10005,
    bike: "Bike 05",
    description: "Sensor Misalignment",
    date: "2024-03-16",
    priority: "Medium",
    status: "Open",
  },
  {
    id: 10006,
    bike: "Bike 06",
    description: "Flat Tire",
    date: "2024-03-17",
    priority: "Low",
    status: "Open",
  },
  {
    id: 10007,
    bike: "Bike 07",
    description: "Speed Sensor Error",
    date: "2024-03-18",
    priority: "High",
    status: "Open",
  },
  {
    id: 10008,
    bike: "Bike 08",
    description: "Communication Timeout",
    date: "2024-03-19",
    priority: "Medium",
    status: "Open",
  },
  {
    id: 10009,
    bike: "Bike 09",
    description: "Brake Pad Wear",
    date: "2024-03-20",
    priority: "Low",
    status: "Open",
  },
  {
    id: 10010,
    bike: "Bike 10",
    description: "Throttle Sensor Drift",
    date: "2024-03-21",
    priority: "Medium",
    status: "Open",
  },

  // --- IN PROGRESS ---
  {
    id: 20001,
    bike: "Bike 11",
    description: "Vibration Analysis",
    date: "2024-03-22",
    priority: "High",
    status: "In Progress",
  },
  {
    id: 20002,
    bike: "Bike 12",
    description: "Power Module Replacement",
    date: "2024-03-23",
    priority: "Medium",
    status: "In Progress",
  },
  {
    id: 20003,
    bike: "Bike 13",
    description: "Brake Sensor Calibration",
    date: "2024-03-24",
    priority: "Low",
    status: "In Progress",
  },
  {
    id: 20004,
    bike: "Bike 14",
    description: "Chain Tension Adjustment",
    date: "2024-03-25",
    priority: "High",
    status: "In Progress",
  },
  {
    id: 20005,
    bike: "Bike 15",
    description: "Wheel Alignment",
    date: "2024-03-26",
    priority: "Medium",
    status: "In Progress",
  },
  {
    id: 20006,
    bike: "Bike 16",
    description: "Controller Firmware Update",
    date: "2024-03-27",
    priority: "Low",
    status: "In Progress",
  },
  {
    id: 20007,
    bike: "Bike 17",
    description: "Torque Sensor Recalibration",
    date: "2024-03-28",
    priority: "High",
    status: "In Progress",
  },
  {
    id: 20008,
    bike: "Bike 18",
    description: "Temperature Monitoring",
    date: "2024-03-29",
    priority: "Medium",
    status: "In Progress",
  },
  {
    id: 20009,
    bike: "Bike 19",
    description: "Cable Harness Inspection",
    date: "2024-03-30",
    priority: "Low",
    status: "In Progress",
  },
  {
    id: 20010,
    bike: "Bike 20",
    description: "Motor Overcurrent Issue",
    date: "2024-03-31",
    priority: "High",
    status: "In Progress",
  },

  // --- DONE ---
  {
    id: 30001,
    bike: "Bike 21",
    description: "Anchor Error",
    date: "2024-04-01",
    priority: "Low",
    status: "Done",
  },
  {
    id: 30002,
    bike: "Bike 22",
    description: "Tire Replacement",
    date: "2024-04-02",
    priority: "High",
    status: "Done",
  },
  {
    id: 30003,
    bike: "Bike 23",
    description: "Software Update Completed",
    date: "2024-04-03",
    priority: "Medium",
    status: "Done",
  },
  {
    id: 30004,
    bike: "Bike 24",
    description: "Brake Pad Replacement",
    date: "2024-04-04",
    priority: "Low",
    status: "Done",
  },
  {
    id: 30005,
    bike: "Bike 25",
    description: "Suspension Adjustment",
    date: "2024-04-05",
    priority: "Medium",
    status: "Done",
  },
  {
    id: 30006,
    bike: "Bike 26",
    description: "Handlebar Alignment",
    date: "2024-04-06",
    priority: "Low",
    status: "Done",
  },
  {
    id: 30007,
    bike: "Bike 27",
    description: "Torque Calibration",
    date: "2024-04-07",
    priority: "High",
    status: "Done",
  },
  {
    id: 30008,
    bike: "Bike 28",
    description: "Distance Sensor Fixed",
    date: "2024-04-08",
    priority: "Medium",
    status: "Done",
  },
  {
    id: 30009,
    bike: "Bike 29",
    description: "Seat Post Adjustment",
    date: "2024-04-09",
    priority: "Low",
    status: "Done",
  },
  {
    id: 30010,
    bike: "Bike 30",
    description: "Cooling Fan Replaced",
    date: "2024-04-10",
    priority: "High",
    status: "Done",
  },
];

function BikeMaintenanceDashboard() {
  const [filter, setFilter] = useState<Status | "All">("All");
  const [view, setView] = useState<"cards" | "table">("cards");
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
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const grouped = useMemo(() => {
    const by: Record<Status, Ticket[]> = {
      Open: [],
      "In Progress": [],
      Done: [],
    };
    tickets.forEach((t) => by[t.status].push(t));
    return by;
  }, [tickets]);

  const visibleColumns: Array<Status> = useMemo(() => {
    if (filter === "All") return ["Open", "In Progress", "Done"];
    return [filter];
  }, [filter]);

  const visibleTickets = useMemo(() => {
    if (filter === "All") return tickets;
    return tickets.filter((t) => t.status === filter);
  }, [tickets, filter]);

  const onSave = (id: number, newStatus: Status) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const onDelete = (id: number) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  if (initialLoad) return <LoadingScreen />;

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold tracking-tight">Reports</h1>
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
            {visibleColumns.map((col) => (
              <StatusColumn
                key={col}
                title={col}
                tickets={grouped[col]}
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
