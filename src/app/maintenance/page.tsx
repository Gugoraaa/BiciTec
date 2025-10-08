'use client'
import { useMemo, useState,useEffect } from "react";

// ---------- Types ----------
type Priority = "High" | "Medium" | "Low";
type Status = "Open" | "In Progress" | "Done";

interface Ticket {
  id: number;
  bike: string;
  title: string;
  date: string;
  priority: Priority;
  status: Status;
}

// ---------- Seed Data ----------
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
    id: 67890,
    bike: "Bike 2",
    title: "Abnormal Vibration",
    date: "2024-03-16",
    priority: "Medium",
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
];

// ---------- UI Atoms ----------
function Badge({ label, tone }: { label: string; tone: "success" | "warning" | "danger" }) {
  const tones = {
    success: "bg-emerald-900/40 text-emerald-300 ring-1 ring-emerald-700/50",
    warning: "bg-amber-900/40 text-amber-300 ring-1 ring-amber-700/50",
    danger: "bg-rose-900/40 text-rose-300 ring-1 ring-rose-700/50",
  } as const;
  return <span className={`px-2 py-0.5 text-xs rounded-full ${tones[tone]}`}>{label}</span>;
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-slate-700/60 bg-slate-800/70 p-4 shadow-sm">{children}</div>;
}

// ---------- Manage Modal ----------
function ManageModal({
  open,
  ticket,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  ticket: Ticket | null;
  onClose: () => void;
  onSave: (id: number, newStatus: Status) => void;
  onDelete: (id: number) => void;
}) {
  const [value, setValue] = useState<Status>(ticket?.status ?? "Open");

  useEffect(() => {
    if (ticket) setValue(ticket.status);
  }, [ticket]);

  if (!open || !ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-slate-800 p-5 ring-1 ring-slate-700">
        <h4 className="text-slate-100 font-semibold">Manage Report #{ticket.id}</h4>
        <p className="mt-1 text-sm text-slate-400">{ticket.bike} — {ticket.title}</p>

        <label className="mt-4 block text-sm text-slate-300">Status</label>
        <select
          value={value}
          onChange={(e) => setValue(e.target.value as Status)}
          className="mt-1 w-full rounded-lg bg-slate-900/60 px-3 py-2 text-slate-100 ring-1 ring-slate-700 focus:outline-none focus:ring-sky-500"
        >
          <option>Open</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => {
              onDelete(ticket.id);
              onClose();
            }}
            className="rounded-lg bg-rose-600/90 px-3 py-2 text-sm font-medium text-white hover:bg-rose-600"
          >
            Delete report
          </button>

          <div className="space-x-2">
            <button
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm text-slate-300 ring-1 ring-slate-600 hover:bg-slate-700/50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(ticket.id, value);
                onClose();
              }}
              className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Ticket Card ----------
function TicketCard({ t, onManage }: { t: Ticket; onManage: (t: Ticket) => void }) {
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
        {t.bike} - {t.title}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>{t.date}</span>
      </div>
    </Card>
  );
}

// ---------- Column ----------
function StatusColumn({ title, tickets, onManage }: { title: Status; tickets: Ticket[]; onManage: (t: Ticket) => void }) {
  return (
    <div className="space-y-3">
      <h3 className="text-slate-200 font-semibold mb-2">{title}</h3>
      <div className="grid gap-3">
        {tickets.length === 0 ? (
          <div className="text-sm text-slate-500">No tickets</div>
        ) : (
          tickets.map((t) => <TicketCard key={t.id} t={t} onManage={onManage} />)
        )}
      </div>
    </div>
  );
}

// ---------- Filter ----------
function StatusFilter({
  active,
  onChange,
}: {
  active: Status | "All";
  onChange: (value: Status | "All") => void;
}) {
  const options: Array<Status | "All"> = ["All", "Open", "In Progress", "Done"];
  return (
    <div className="inline-flex items-center gap-2 rounded-xl bg-slate-800/50 p-1 ring-1 ring-slate-700">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors
            ${active === opt ? "bg-slate-700 text-slate-100" : "text-slate-300 hover:bg-slate-700/50"}
          `}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ---------- Main ----------
export default function BikeMaintenanceDashboard() {
  const [filter, setFilter] = useState<Status | "All">("All");
  const [tickets, setTickets] = useState<Ticket[]>(SEED);

  const [manageOpen, setManageOpen] = useState(false);
  const [selected, setSelected] = useState<Ticket | null>(null);

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

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">Reports</h1>
          <StatusFilter active={filter} onChange={setFilter} />
        </div>

        <div className={`grid gap-6 ${visibleColumns.length === 3 ? "md:grid-cols-3" : "grid-cols-1"}`}>
          {visibleColumns.map((col) => (
            <StatusColumn key={col} title={col} tickets={grouped[col]} onManage={(t) => { setSelected(t); setManageOpen(true); }} />)
          )}
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
  );
}