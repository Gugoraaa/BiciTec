import { Ticket, type Status } from "@/types/maintenance";
import {useState,useEffect} from "react"


export default function ManageModal({
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